import 'dotenv/config';
import request from 'supertest';
import app from '../../app.js';
import { createTestUser, createTestCity } from './test-helper.js';

describe('Module 7: Trip Stops Integration Tests', () => {
    let auth;
    let otherAuth;
    let trip;
    let city1;
    let city2;

    beforeEach(async () => {
        auth = await createTestUser();
        otherAuth = await createTestUser();
        city1 = await createTestCity({ name: 'Kyoto', country: 'Japan' });
        city2 = await createTestCity({ name: 'Osaka', country: 'Japan' });

        const tripRes = await request(app).post('/api/trips').set('Cookie', [auth.cookie]).send({
            title: 'Japan Tour',
            startDate: '2026-04-01',
            endDate: '2026-04-15',
            totalBudget: 5000,
        });
        trip = tripRes.body.trip;
    });

    describe('POST /api/trips/:tripId/stops', () => {
        it('should add a stop with dates and expenses', async () => {
            const payload = {
                cityId: city1.id,
                startDate: '2026-04-02',
                endDate: '2026-04-06',
                accommodationCost: 500,
                transportCost: 100,
                notes: 'Stay near Gion',
            };

            const res = await request(app)
                .post(`/api/trips/${trip.id}/stops`)
                .set('Cookie', [auth.cookie])
                .send(payload);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.stop.cityId).toBe(city1.id);
            expect(res.body.stop.cityName).toBe(city1.name);
            expect(res.body.stop.sequenceOrder).toBe(1);
        });

        it('should reject stop if arrival date is before trip start date', async () => {
            const res = await request(app)
                .post(`/api/trips/${trip.id}/stops`)
                .set('Cookie', [auth.cookie])
                .send({
                    cityId: city1.id,
                    startDate: '2026-03-25', // before trip.startDate 2026-04-01
                    endDate: '2026-04-05',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('cannot be earlier than trip start date');
        });

        it('should reject stop if departure date is after trip end date', async () => {
            const res = await request(app)
                .post(`/api/trips/${trip.id}/stops`)
                .set('Cookie', [auth.cookie])
                .send({
                    cityId: city1.id,
                    startDate: '2026-04-05',
                    endDate: '2026-04-20', // after trip.endDate 2026-04-15
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('cannot be later than trip end date');
        });
    });

    describe('GET /api/trips/:tripId/stops and Reordering', () => {
        let stop1;
        let stop2;

        beforeEach(async () => {
            const res1 = await request(app)
                .post(`/api/trips/${trip.id}/stops`)
                .set('Cookie', [auth.cookie])
                .send({
                    cityId: city1.id,
                    startDate: '2026-04-02',
                    endDate: '2026-04-06',
                });
            stop1 = res1.body.stop;

            const res2 = await request(app)
                .post(`/api/trips/${trip.id}/stops`)
                .set('Cookie', [auth.cookie])
                .send({
                    cityId: city2.id,
                    startDate: '2026-04-07',
                    endDate: '2026-04-12',
                });
            stop2 = res2.body.stop;
        });

        it('should list stops ordered by sequenceOrder', async () => {
            const res = await request(app)
                .get(`/api/trips/${trip.id}/stops`)
                .set('Cookie', [auth.cookie]);

            expect(res.statusCode).toBe(200);
            expect(res.body.stops.length).toBe(2);
            expect(res.body.stops[0].id).toBe(stop1.id);
            expect(res.body.stops[1].id).toBe(stop2.id);
        });

        it('should get single stop by ID', async () => {
            const res = await request(app)
                .get(`/api/trips/${trip.id}/stops/${stop1.id}`)
                .set('Cookie', [auth.cookie]);

            expect(res.statusCode).toBe(200);
            expect(res.body.stop.id).toBe(stop1.id);
            expect(res.body.stop.cityName).toBe(city1.name);
        });

        it('should update stop dates', async () => {
            const res = await request(app)
                .patch(`/api/trips/${trip.id}/stops/${stop1.id}`)
                .set('Cookie', [auth.cookie])
                .send({
                    startDate: '2026-04-03',
                    endDate: '2026-04-06',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.stop.startDate).toBe('2026-04-03');
        });

        it('should reorder stops sequence', async () => {
            const res = await request(app)
                .patch(`/api/trips/${trip.id}/stops/reorder`)
                .set('Cookie', [auth.cookie])
                .send({
                    stops: [
                        { id: stop2.id, sequenceOrder: 1 },
                        { id: stop1.id, sequenceOrder: 2 },
                    ],
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.stops[0].id).toBe(stop2.id);
            expect(res.body.stops[0].sequenceOrder).toBe(1);
            expect(res.body.stops[1].id).toBe(stop1.id);
            expect(res.body.stops[1].sequenceOrder).toBe(2);
        });

        it('should delete stop', async () => {
            const res = await request(app)
                .delete(`/api/trips/${trip.id}/stops/${stop1.id}`)
                .set('Cookie', [auth.cookie]);

            expect(res.statusCode).toBe(200);

            const listRes = await request(app)
                .get(`/api/trips/${trip.id}/stops`)
                .set('Cookie', [auth.cookie]);

            expect(listRes.body.stops.length).toBe(1);
            expect(listRes.body.stops[0].id).toBe(stop2.id);
        });
    });
});
