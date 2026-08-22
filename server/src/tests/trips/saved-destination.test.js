import 'dotenv/config';
import request from 'supertest';
import app from '../../app.js';
import { createTestUser, createTestCity } from './test-helper.js';

describe('Module 13: Saved Destinations (Bookmarks) Integration Tests', () => {
    let auth;
    let otherAuth;
    let city1;
    let city2;

    beforeEach(async () => {
        auth = await createTestUser();
        otherAuth = await createTestUser();

        city1 = await createTestCity({ name: 'Barcelona', country: 'Spain', region: 'Europe' });
        city2 = await createTestCity({ name: 'Bangkok', country: 'Thailand', region: 'Asia' });
    });

    describe('POST /api/saved-destinations', () => {
        it('should bookmark a destination city successfully', async () => {
            const res = await request(app)
                .post('/api/saved-destinations')
                .set('Cookie', [auth.cookie])
                .send({
                    cityId: city1.id,
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.destination).toBeDefined();
            expect(res.body.data.destination.cityId).toBe(city1.id);
            expect(res.body.data.destination.city.name).toBe(city1.name);
        });

        it('should handle duplicate bookmark idempotently', async () => {
            // Save once
            await request(app)
                .post('/api/saved-destinations')
                .set('Cookie', [auth.cookie])
                .send({ cityId: city1.id });

            // Save second time
            const res = await request(app)
                .post('/api/saved-destinations')
                .set('Cookie', [auth.cookie])
                .send({ cityId: city1.id });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
        });

        it('should reject non-existent cityId with 404', async () => {
            const res = await request(app)
                .post('/api/saved-destinations')
                .set('Cookie', [auth.cookie])
                .send({
                    cityId: '00000000-0000-0000-0000-000000000000',
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/saved-destinations', () => {
        it('should list all saved destinations for the user with city metadata', async () => {
            // Bookmark both cities
            await request(app)
                .post('/api/saved-destinations')
                .set('Cookie', [auth.cookie])
                .send({ cityId: city1.id });
            await request(app)
                .post('/api/saved-destinations')
                .set('Cookie', [auth.cookie])
                .send({ cityId: city2.id });

            const res = await request(app)
                .get('/api/saved-destinations')
                .set('Cookie', [auth.cookie]);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.destinations).toHaveLength(2);
            expect(res.body.data.pagination.total).toBe(2);
        });

        it('should isolate saved destinations per user', async () => {
            // User 1 saves city1
            await request(app)
                .post('/api/saved-destinations')
                .set('Cookie', [auth.cookie])
                .send({ cityId: city1.id });

            // User 2 lists bookmarks
            const res = await request(app)
                .get('/api/saved-destinations')
                .set('Cookie', [otherAuth.cookie]);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.destinations).toHaveLength(0);
        });
    });

    describe('DELETE /api/saved-destinations/:cityId', () => {
        it('should remove a destination bookmark', async () => {
            // Save city
            await request(app)
                .post('/api/saved-destinations')
                .set('Cookie', [auth.cookie])
                .send({ cityId: city1.id });

            // Delete bookmark
            const res = await request(app)
                .delete(`/api/saved-destinations/${city1.id}`)
                .set('Cookie', [auth.cookie]);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);

            // Verify list is empty
            const listRes = await request(app)
                .get('/api/saved-destinations')
                .set('Cookie', [auth.cookie]);

            expect(listRes.body.data.destinations).toHaveLength(0);
        });

        it('should return 404 when deleting a bookmark that does not exist', async () => {
            const res = await request(app)
                .delete(`/api/saved-destinations/${city1.id}`)
                .set('Cookie', [auth.cookie]);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });
});
