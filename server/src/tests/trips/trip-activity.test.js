import 'dotenv/config';
import request from 'supertest';
import app from '../../app.js';
import { createTestUser, createTestCity } from './test-helper.js';

describe('Module 8: Trip Stop Activities Integration Tests', () => {
    let auth;
    let trip;
    let city;
    let stop;

    beforeEach(async () => {
        auth = await createTestUser();
        city = await createTestCity({ name: 'Tokyo', country: 'Japan' });

        const tripRes = await request(app).post('/api/trips').set('Cookie', [auth.cookie]).send({
            title: 'Japan Journey',
            startDate: '2026-04-01',
            endDate: '2026-04-10',
        });
        trip = tripRes.body.trip;

        const stopRes = await request(app)
            .post(`/api/trips/${trip.id}/stops`)
            .set('Cookie', [auth.cookie])
            .send({
                cityId: city.id,
                startDate: '2026-04-02',
                endDate: '2026-04-06',
            });
        stop = stopRes.body.stop;
    });

    describe('POST /api/trips/:tripId/stops/:stopId/activities', () => {
        it('should schedule an activity within stop dates', async () => {
            const payload = {
                name: 'Tokyo Skytree Visit',
                category: 'sightseeing',
                activityDate: '2026-04-03',
                startTime: '10:00',
                endTime: '12:00',
                cost: 25,
                notes: 'Book online in advance',
            };

            const res = await request(app)
                .post(`/api/trips/${trip.id}/stops/${stop.id}/activities`)
                .set('Cookie', [auth.cookie])
                .send(payload);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.activity.name).toBe('Tokyo Skytree Visit');
            expect(res.body.activity.activityDate).toBe('2026-04-03');
            expect(res.body.activity.sequenceOrder).toBe(1);
        });

        it('should reject activity if activityDate is outside stop dates', async () => {
            const res = await request(app)
                .post(`/api/trips/${trip.id}/stops/${stop.id}/activities`)
                .set('Cookie', [auth.cookie])
                .send({
                    name: 'Out of bounds activity',
                    activityDate: '2026-04-08', // Stop is 2026-04-02 to 2026-04-06
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('must be within stop dates');
        });

        it('should reject activity if startTime >= endTime', async () => {
            const res = await request(app)
                .post(`/api/trips/${trip.id}/stops/${stop.id}/activities`)
                .set('Cookie', [auth.cookie])
                .send({
                    name: 'Time error activity',
                    activityDate: '2026-04-03',
                    startTime: '14:00',
                    endTime: '11:00',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Start time must be before end time');
        });
    });

    describe('GET, PATCH, DELETE, and Reorder Activities', () => {
        let act1;
        let act2;

        beforeEach(async () => {
            const res1 = await request(app)
                .post(`/api/trips/${trip.id}/stops/${stop.id}/activities`)
                .set('Cookie', [auth.cookie])
                .send({
                    name: 'Morning Shrine Walk',
                    activityDate: '2026-04-04',
                    startTime: '08:00',
                    endTime: '09:30',
                });
            act1 = res1.body.activity;

            const res2 = await request(app)
                .post(`/api/trips/${trip.id}/stops/${stop.id}/activities`)
                .set('Cookie', [auth.cookie])
                .send({
                    name: 'Ramen Tasting Tour',
                    activityDate: '2026-04-04',
                    startTime: '12:00',
                    endTime: '13:30',
                });
            act2 = res2.body.activity;
        });

        it('should list activities for a stop', async () => {
            const res = await request(app)
                .get(`/api/trips/${trip.id}/stops/${stop.id}/activities`)
                .set('Cookie', [auth.cookie]);

            expect(res.statusCode).toBe(200);
            expect(res.body.activities.length).toBe(2);
        });

        it('should update scheduled activity notes and time', async () => {
            const res = await request(app)
                .patch(`/api/trips/${trip.id}/stops/${stop.id}/activities/${act1.id}`)
                .set('Cookie', [auth.cookie])
                .send({
                    notes: 'Bring a camera',
                    startTime: '08:30',
                    endTime: '10:00',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.activity.notes).toBe('Bring a camera');
        });

        it('should reorder activities within stop', async () => {
            const res = await request(app)
                .patch(`/api/trips/${trip.id}/stops/${stop.id}/activities/reorder`)
                .set('Cookie', [auth.cookie])
                .send({
                    activities: [
                        { id: act2.id, sequenceOrder: 1 },
                        { id: act1.id, sequenceOrder: 2 },
                    ],
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.activities[0].id).toBe(act2.id);
            expect(res.body.activities[0].sequenceOrder).toBe(1);
        });

        it('should delete scheduled activity', async () => {
            const res = await request(app)
                .delete(`/api/trips/${trip.id}/stops/${stop.id}/activities/${act1.id}`)
                .set('Cookie', [auth.cookie]);

            expect(res.statusCode).toBe(200);

            const listRes = await request(app)
                .get(`/api/trips/${trip.id}/stops/${stop.id}/activities`)
                .set('Cookie', [auth.cookie]);

            expect(listRes.body.activities.length).toBe(1);
            expect(listRes.body.activities[0].id).toBe(act2.id);
        });
    });
});
