import 'dotenv/config';
import request from 'supertest';
import app from '../../app.js';
import { createTestUser } from './test-helper.js';

describe('Module 6: Trip Management Integration Tests', () => {
    let auth;
    let otherAuth;

    beforeEach(async () => {
        auth = await createTestUser();
        otherAuth = await createTestUser();
    });

    describe('POST /api/trips', () => {
        it('should create a new trip successfully', async () => {
            const payload = {
                title: 'Grand Tour of Japan',
                description: 'Tokyo, Kyoto, and Osaka spring journey',
                startDate: '2026-04-01',
                endDate: '2026-04-14',
                totalBudget: 4500.0,
                currency: 'USD',
            };

            const res = await request(app)
                .post('/api/trips')
                .set('Cookie', [auth.cookie])
                .send(payload);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.trip).toBeDefined();
            expect(res.body.trip.name).toBe(payload.title);
            expect(res.body.trip.title).toBe(payload.title);
            expect(res.body.trip.startDate).toBe('2026-04-01');
            expect(res.body.trip.endDate).toBe('2026-04-14');
            expect(res.body.trip.status).toBe('draft');
            expect(res.body.trip.visibility).toBe('private');
            expect(res.body.trip.publicSlug).toBeDefined();
        });

        it('should reject trip creation if end date is earlier than start date', async () => {
            const payload = {
                title: 'Time Travel Error',
                startDate: '2026-05-10',
                endDate: '2026-05-01',
            };

            const res = await request(app)
                .post('/api/trips')
                .set('Cookie', [auth.cookie])
                .send(payload);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should require authentication', async () => {
            const res = await request(app).post('/api/trips').send({
                title: 'Unauthorized Trip',
                startDate: '2026-05-01',
                endDate: '2026-05-10',
            });

            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/trips', () => {
        it('should list trips for the authenticated user', async () => {
            await request(app)
                .post('/api/trips')
                .set('Cookie', [auth.cookie])
                .send({ title: 'Trip 1', startDate: '2026-06-01', endDate: '2026-06-05' });

            await request(app)
                .post('/api/trips')
                .set('Cookie', [auth.cookie])
                .send({ title: 'Trip 2', startDate: '2026-07-01', endDate: '2026-07-05' });

            const res = await request(app).get('/api/trips').set('Cookie', [auth.cookie]);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.trips.length).toBe(2);
            expect(res.body.pagination).toBeDefined();
        });

        it('should filter trips by search query', async () => {
            await request(app)
                .post('/api/trips')
                .set('Cookie', [auth.cookie])
                .send({ title: 'Tokyo Adventure', startDate: '2026-06-01', endDate: '2026-06-05' });

            await request(app)
                .post('/api/trips')
                .set('Cookie', [auth.cookie])
                .send({ title: 'Paris Getaway', startDate: '2026-07-01', endDate: '2026-07-05' });

            const res = await request(app)
                .get('/api/trips?search=Tokyo')
                .set('Cookie', [auth.cookie]);

            expect(res.statusCode).toBe(200);
            expect(res.body.trips.length).toBe(1);
            expect(res.body.trips[0].title).toBe('Tokyo Adventure');
        });
    });

    describe('GET /api/trips/:tripId, PATCH, DELETE, and State Transitions', () => {
        let createdTripId;

        beforeEach(async () => {
            const createRes = await request(app)
                .post('/api/trips')
                .set('Cookie', [auth.cookie])
                .send({
                    title: 'Swiss Alps Expedition',
                    startDate: '2026-08-01',
                    endDate: '2026-08-10',
                    totalBudget: 3000,
                });
            createdTripId = createRes.body.trip.id;
        });

        it('should retrieve hydrated trip details', async () => {
            const res = await request(app)
                .get(`/api/trips/${createdTripId}`)
                .set('Cookie', [auth.cookie]);

            expect(res.statusCode).toBe(200);
            expect(res.body.trip.id).toBe(createdTripId);
            expect(res.body.trip.stops).toBeDefined();
            expect(res.body.trip.costItems).toBeDefined();
        });

        it('should update trip details', async () => {
            const res = await request(app)
                .patch(`/api/trips/${createdTripId}`)
                .set('Cookie', [auth.cookie])
                .send({
                    title: 'Updated Swiss Alps Expedition',
                    totalBudget: 3500,
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.trip.title).toBe('Updated Swiss Alps Expedition');
            expect(res.body.trip.totalBudget).toBe(3500);
        });

        it('should update trip status through valid state machine transition', async () => {
            // draft -> planned
            const res1 = await request(app)
                .patch(`/api/trips/${createdTripId}/status`)
                .set('Cookie', [auth.cookie])
                .send({ status: 'planned' });

            expect(res1.statusCode).toBe(200);
            expect(res1.body.trip.status).toBe('planned');

            // planned -> ongoing
            const res2 = await request(app)
                .patch(`/api/trips/${createdTripId}/status`)
                .set('Cookie', [auth.cookie])
                .send({ status: 'ongoing' });

            expect(res2.statusCode).toBe(200);
            expect(res2.body.trip.status).toBe('ongoing');

            // ongoing -> completed
            const res3 = await request(app)
                .patch(`/api/trips/${createdTripId}/status`)
                .set('Cookie', [auth.cookie])
                .send({ status: 'completed' });

            expect(res3.statusCode).toBe(200);
            expect(res3.body.trip.status).toBe('completed');
        });

        it('should reject invalid state transition', async () => {
            // draft -> completed is illegal
            const res = await request(app)
                .patch(`/api/trips/${createdTripId}/status`)
                .set('Cookie', [auth.cookie])
                .send({ status: 'completed' });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should toggle visibility between private and public', async () => {
            const res = await request(app)
                .patch(`/api/trips/${createdTripId}/visibility`)
                .set('Cookie', [auth.cookie])
                .send({ visibility: 'public' });

            expect(res.statusCode).toBe(200);
            expect(res.body.trip.visibility).toBe('public');
            expect(res.body.trip.publicSlug).toBeDefined();
        });

        it('should block non-owner from updating trip', async () => {
            const res = await request(app)
                .patch(`/api/trips/${createdTripId}`)
                .set('Cookie', [otherAuth.cookie])
                .send({ title: 'Hacked Title' });

            expect(res.statusCode).toBe(403);
        });

        it('should delete trip', async () => {
            const res = await request(app)
                .delete(`/api/trips/${createdTripId}`)
                .set('Cookie', [auth.cookie]);

            expect(res.statusCode).toBe(200);

            // Verify it is gone
            const checkRes = await request(app)
                .get(`/api/trips/${createdTripId}`)
                .set('Cookie', [auth.cookie]);

            expect(checkRes.statusCode).toBe(404);
        });
    });
});
