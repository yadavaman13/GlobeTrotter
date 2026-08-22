import 'dotenv/config';
import request from 'supertest';
import app from '../../app.js';
import { db } from '../../config/database.config.js';
import { users } from '../../db/schema/users.schema.js';
import redis from '../../config/cache.config.js';
import bcrypt from 'bcryptjs';

describe('Auth Module Integration Tests (Jest + Supertest)', () => {
    const testUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
    };

    beforeEach(async () => {
        // Clear rate-limiter keys in Redis before each test to avoid contamination
        const keys = await redis.keys('ratelimit:*');
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully and return user details with a cookie', async () => {
            // Bypass email OTP verification by setting the email as verified in Redis
            await redis.set(`verified_email:${testUser.email.toLowerCase()}`, 'true');

            const res = await request(app).post('/api/auth/register').send(testUser);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.user.firstName).toBe(testUser.firstName);
            expect(res.body.user.lastName).toBe(testUser.lastName);
            expect(res.body.user.email).toBe(testUser.email.toLowerCase());
            expect(res.body.user.role).toBe('user');
            expect(res.body.user.password).toBeUndefined();
            expect(res.headers['set-cookie']).toBeDefined();
            expect(res.headers['set-cookie'][0]).toContain('token=');
        });

        it('should fail registration when validation constraints are not met', async () => {
            const invalidData = {
                firstName: '',
                lastName: '',
                email: 'invalid-email',
                password: '123',
            };
            const res = await request(app).post('/api/auth/register').send(invalidData);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Validation failed');
            expect(res.body.errors).toBeDefined();
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            const hashedPassword = await bcrypt.hash(testUser.password, 10);
            await db.insert(users).values({
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                email: testUser.email.toLowerCase(),
                password: hashedPassword,
                role: 'user',
            });
        });

        it('should login user successfully with correct credentials and set token cookie', async () => {
            const loginData = {
                email: testUser.email,
                password: testUser.password,
            };
            const res = await request(app).post('/api/auth/login').send(loginData);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user.email).toBe(testUser.email.toLowerCase());
            expect(res.headers['set-cookie']).toBeDefined();
            expect(res.headers['set-cookie'][0]).toContain('token=');
        });

        it('should reject login for wrong password', async () => {
            const loginData = {
                email: testUser.email,
                password: 'WrongPassword!',
            };
            const res = await request(app).post('/api/auth/login').send(loginData);

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Incorrect password.');
        });
    });

    describe('GET /api/auth/get-me', () => {
        let cookie;

        beforeEach(async () => {
            const hashedPassword = await bcrypt.hash(testUser.password, 10);
            await db.insert(users).values({
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                email: testUser.email.toLowerCase(),
                password: hashedPassword,
                role: 'user',
            });

            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ email: testUser.email, password: testUser.password });
            cookie = loginRes.headers['set-cookie'];
        });

        it('should retrieve current user details successfully when authenticated', async () => {
            const res = await request(app).get('/api/auth/get-me').set('Cookie', cookie);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user.email).toBe(testUser.email.toLowerCase());
        });

        it('should fail profile retrieval when unauthenticated', async () => {
            const res = await request(app).get('/api/auth/get-me');

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('PATCH /api/auth/change-password', () => {
        let cookie;

        beforeEach(async () => {
            const hashedPassword = await bcrypt.hash(testUser.password, 10);
            await db.insert(users).values({
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                email: testUser.email.toLowerCase(),
                password: hashedPassword,
                role: 'user',
            });

            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ email: testUser.email, password: testUser.password });
            cookie = loginRes.headers['set-cookie'];
        });

        it('should allow user to change their password with valid inputs', async () => {
            const changePayload = {
                currentPassword: testUser.password,
                newPassword: 'NewPassword123!',
            };
            const res = await request(app)
                .patch('/api/auth/change-password')
                .set('Cookie', cookie)
                .send(changePayload);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain('Password changed successfully');
        });

        it('should deny password change with incorrect current password', async () => {
            const changePayload = {
                currentPassword: 'IncorrectPassword1!',
                newPassword: 'NewPassword123!',
            };
            const res = await request(app)
                .patch('/api/auth/change-password')
                .set('Cookie', cookie)
                .send(changePayload);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Current password is incorrect');
        });
    });

    describe('POST /api/auth/logout', () => {
        let cookie;

        beforeEach(async () => {
            const hashedPassword = await bcrypt.hash(testUser.password, 10);
            await db.insert(users).values({
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                email: testUser.email.toLowerCase(),
                password: hashedPassword,
                role: 'user',
            });

            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ email: testUser.email, password: testUser.password });
            cookie = loginRes.headers['set-cookie'];
        });

        it('should clear cookies and logout successfully', async () => {
            const res = await request(app).post('/api/auth/logout').set('Cookie', cookie);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain('Logout successful');
            expect(res.headers['set-cookie'][0]).toContain('token=;');
        });
    });
});
