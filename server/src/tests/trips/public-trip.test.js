import 'dotenv/config';
import request from 'supertest';
import app from '../../app.js';
import { createTestUser, createTestCity } from './test-helper.js';

describe('Module 12: Public Itinerary & Trip Cloning Integration Tests', () => {
    let authorAuth;
    let clonerAuth;
    let trip;
    let city;
    let stop;

    beforeEach(async () => {
        authorAuth = await createTestUser();
        clonerAuth = await createTestUser();
        city = await createTestCity({ name: 'Rome', country: 'Italy' });

        // Create public trip
        const tripRes = await request(app)
            .post('/api/trips')
            .set('Cookie', [authorAuth.cookie])
            .send({
                title: 'Classical Rome Expedition',
                description: 'Ancient Colosseum, Forum, and Vatican wonders',
                startDate: '2026-09-01',
                endDate: '2026-09-05',
                totalBudget: 2200,
                currency: 'EUR',
                visibility: 'public',
            });
        trip = tripRes.body.trip;

        // Add stop
        const stopRes = await request(app)
            .post(`/api/trips/${trip.id}/stops`)
            .set('Cookie', [authorAuth.cookie])
            .send({
                cityId: city.id,
                startDate: '2026-09-01',
                endDate: '2026-09-05',
            });
        stop = stopRes.body.stop;

        // Add activity
        await request(app)
            .post(`/api/trips/${trip.id}/stops/${stop.id}/activities`)
            .set('Cookie', [authorAuth.cookie])
            .send({
                name: 'Colosseum Underground Tour',
                category: 'culture',
                activityDate: '2026-09-02',
                startTime: '09:00',
                endTime: '11:30',
                cost: 65,
            });

        // Add cost item
        await request(app)
            .post(`/api/trips/${trip.id}/costs`)
            .set('Cookie', [authorAuth.cookie])
            .send({
                category: 'stay',
                amount: 600,
                currency: 'EUR',
                costDate: '2026-09-01',
                description: 'Trastevere boutique hotel',
            });
    });

    describe('GET /api/public/trips/:slug', () => {
        it('should fetch public shared itinerary without authentication', async () => {
            const res = await request(app).get(`/api/public/trips/${trip.publicSlug}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.trip.name).toBe('Classical Rome Expedition');
            expect(res.body.data.trip.owner).toBeDefined();
            expect(res.body.data.stops).toHaveLength(1);
            expect(res.body.data.stops[0].activities).toHaveLength(1);
            expect(res.body.data.days).toHaveLength(5);
        });

        it('should return 404 for invalid public slug', async () => {
            const res = await request(app).get('/api/public/trips/non-existent-random-slug-999');

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it('should return 404 if trip is marked private', async () => {
            // Set trip to private
            await request(app)
                .patch(`/api/trips/${trip.id}/visibility`)
                .set('Cookie', [authorAuth.cookie])
                .send({ visibility: 'private' });

            const res = await request(app).get(`/api/public/trips/${trip.publicSlug}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/trips/:tripId/clone', () => {
        it('should clone a public trip into the authenticated user account with full stops, activities, and cost items', async () => {
            const res = await request(app)
                .post(`/api/trips/${trip.id}/clone`)
                .set('Cookie', [clonerAuth.cookie])
                .send({
                    title: 'My Customized Rome Trip',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.trip).toBeDefined();

            const cloned = res.body.data.trip;

            // Cloned trip should have new ID, new owner, draft status, and private visibility
            expect(cloned.id).not.toBe(trip.id);
            expect(cloned.ownerId).toBe(clonerAuth.user.id);
            expect(cloned.name).toBe('My Customized Rome Trip');
            expect(cloned.status).toBe('draft');
            expect(cloned.visibility).toBe('private');
            expect(cloned.publicSlug).not.toBe(trip.publicSlug);

            // Verify stops were duplicated
            expect(cloned.stops).toHaveLength(1);
            expect(cloned.stops[0].id).not.toBe(stop.id);
            expect(cloned.stops[0].tripId).toBe(cloned.id);

            // Verify activities were duplicated
            expect(cloned.activities).toHaveLength(1);
            expect(cloned.activities[0].tripStopId).toBe(cloned.stops[0].id);

            // Verify cost items were duplicated (1 for activity + 1 for hotel stay)
            expect(cloned.costItems).toHaveLength(2);
            expect(cloned.costItems.every((c) => c.tripId === cloned.id)).toBe(true);
        });

        it('should require authentication to clone', async () => {
            const res = await request(app).post(`/api/trips/${trip.id}/clone`).send();

            expect(res.statusCode).toBe(401);
        });
    });
});
