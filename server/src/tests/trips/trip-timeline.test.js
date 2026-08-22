import 'dotenv/config';
import request from 'supertest';
import app from '../../app.js';
import { createTestUser, createTestCity } from './test-helper.js';

describe('Module 10: Trip Timeline & Calendar Views Integration Tests', () => {
    let auth;
    let otherAuth;
    let trip;
    let city;
    let stop;

    beforeEach(async () => {
        auth = await createTestUser();
        otherAuth = await createTestUser();
        city = await createTestCity({ name: 'Kyoto', country: 'Japan' });

        const tripRes = await request(app).post('/api/trips').set('Cookie', [auth.cookie]).send({
            title: 'Kyoto Spring Itinerary',
            description: 'Experiencing cherry blossoms and traditional temples',
            startDate: '2026-04-01',
            endDate: '2026-04-03',
            totalBudget: 1500,
            currency: 'USD',
        });
        trip = tripRes.body.trip;

        const stopRes = await request(app)
            .post(`/api/trips/${trip.id}/stops`)
            .set('Cookie', [auth.cookie])
            .send({
                cityId: city.id,
                startDate: '2026-04-01',
                endDate: '2026-04-03',
            });
        stop = stopRes.body.stop;

        // Schedule an activity on Day 2
        await request(app)
            .post(`/api/trips/${trip.id}/stops/${stop.id}/activities`)
            .set('Cookie', [auth.cookie])
            .send({
                name: 'Fushimi Inari Early Morning Hike',
                category: 'adventure',
                activityDate: '2026-04-02',
                startTime: '07:00',
                endTime: '09:30',
                cost: 20,
            });

        // Log a cost item on Day 2
        await request(app).post(`/api/trips/${trip.id}/costs`).set('Cookie', [auth.cookie]).send({
            category: 'meal',
            amount: 45,
            currency: 'USD',
            costDate: '2026-04-02',
            description: 'Traditional Kaiseki dinner',
        });
    });

    describe('GET /api/trips/:tripId/timeline', () => {
        it('should generate a full day-by-day chronological timeline with stops, activities, and daily costs', async () => {
            const res = await request(app)
                .get(`/api/trips/${trip.id}/timeline`)
                .set('Cookie', [auth.cookie]);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();

            const { trip: tripData, days, summary } = res.body.data;

            expect(tripData.id).toBe(trip.id);
            expect(tripData.name).toBe('Kyoto Spring Itinerary');

            // 2026-04-01 to 2026-04-03 => 3 days
            expect(days).toHaveLength(3);
            expect(days[0].dayNumber).toBe(1);
            expect(days[0].date).toBe('2026-04-01');
            expect(days[0].stops).toHaveLength(1);
            expect(days[0].activities).toHaveLength(0);

            // Day 2 (2026-04-02) should contain the scheduled activity and logged costs (activity cost + dinner)
            expect(days[1].dayNumber).toBe(2);
            expect(days[1].date).toBe('2026-04-02');
            expect(days[1].activities).toHaveLength(1);
            expect(days[1].activities[0].name).toBe('Fushimi Inari Early Morning Hike');
            expect(days[1].costs).toHaveLength(2);
            expect(days[1].dailyTotalCost).toBe(65); // 20 (activity) + 45 (dinner)

            // Summary validation
            expect(summary.totalDays).toBe(3);
            expect(summary.totalStops).toBe(1);
            expect(summary.totalActivities).toBe(1);
            expect(summary.totalCost).toBe(65);
            expect(summary.budgetAmount).toBe(1500);
            expect(summary.currency).toBe('USD');
        });

        it('should deny timeline access to unauthorized users for private trips', async () => {
            const res = await request(app)
                .get(`/api/trips/${trip.id}/timeline`)
                .set('Cookie', [otherAuth.cookie]);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });

        it('should return 404 for non-existent trip ID', async () => {
            const res = await request(app)
                .get('/api/trips/00000000-0000-0000-0000-000000000000/timeline')
                .set('Cookie', [auth.cookie]);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });
});
