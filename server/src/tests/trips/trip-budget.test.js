import 'dotenv/config';
import request from 'supertest';
import app from '../../app.js';
import { createTestUser } from './test-helper.js';

describe('Module 9: Trip Budget & Cost Management Integration Tests', () => {
    let auth;
    let trip;

    beforeEach(async () => {
        auth = await createTestUser();

        const tripRes = await request(app).post('/api/trips').set('Cookie', [auth.cookie]).send({
            title: 'Euro Summer Trip',
            startDate: '2026-07-01',
            endDate: '2026-07-10', // 10 days
            totalBudget: 2000,
            currency: 'EUR',
        });
        trip = tripRes.body.trip;
    });

    describe('POST /api/trips/:tripId/costs', () => {
        it('should log a manual expense item with category', async () => {
            const payload = {
                category: 'meal',
                amount: 75.5,
                currency: 'EUR',
                description: 'Dinner at Parisian Bistro',
                costDate: '2026-07-02',
            };

            const res = await request(app)
                .post(`/api/trips/${trip.id}/costs`)
                .set('Cookie', [auth.cookie])
                .send(payload);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.cost.category).toBe('meal');
            expect(res.body.cost.amount).toBe('75.50');
            expect(res.body.cost.costDate).toBe('2026-07-02');
        });

        it('should accept category aliases such as accommodation and dining', async () => {
            const res = await request(app)
                .post(`/api/trips/${trip.id}/costs`)
                .set('Cookie', [auth.cookie])
                .send({
                    category: 'accommodation',
                    amount: 300,
                    description: 'Hotel stay',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.cost.category).toBe('stay');
        });
    });

    describe('GET /api/trips/:tripId/budget and Calculations', () => {
        beforeEach(async () => {
            // Log several expenses across categories
            await request(app)
                .post(`/api/trips/${trip.id}/costs`)
                .set('Cookie', [auth.cookie])
                .send({ category: 'stay', amount: 800, costDate: '2026-07-01' });

            await request(app)
                .post(`/api/trips/${trip.id}/costs`)
                .set('Cookie', [auth.cookie])
                .send({ category: 'transport', amount: 400, costDate: '2026-07-01' });

            await request(app)
                .post(`/api/trips/${trip.id}/costs`)
                .set('Cookie', [auth.cookie])
                .send({ category: 'activity', amount: 200, costDate: '2026-07-03' });

            await request(app)
                .post(`/api/trips/${trip.id}/costs`)
                .set('Cookie', [auth.cookie])
                .send({ category: 'meal', amount: 100, costDate: '2026-07-03' });
        });

        it('should calculate accurate dynamic budget rollup and category distributions', async () => {
            const res = await request(app)
                .get(`/api/trips/${trip.id}/budget`)
                .set('Cookie', [auth.cookie]);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);

            const b = res.body.budget;
            expect(b.totalBudget).toBe(2000);
            expect(b.totalEstimatedCost).toBe(1500);
            expect(b.remainingBudget).toBe(500);
            expect(b.isOverBudget).toBe(false);
            expect(b.tripDays).toBe(10);
            expect(b.averageCostPerDay).toBe(150);
            expect(b.dailyBudgetLimit).toBe(200);

            expect(b.categoryBreakdown.accommodation).toBe(800);
            expect(b.categoryBreakdown.transport).toBe(400);
            expect(b.categoryBreakdown.activities).toBe(200);
            expect(b.categoryBreakdown.food).toBe(100);

            // 2026-07-01 total is 1200, which exceeds dailyBudgetLimit 200
            expect(b.overBudgetDays.length).toBeGreaterThan(0);
            expect(b.overBudgetDays[0].date).toBe('2026-07-01');
            expect(b.overBudgetDays[0].totalCost).toBe(1200);
        });

        it('should list costs with category filter', async () => {
            const res = await request(app)
                .get(`/api/trips/${trip.id}/costs?category=stay`)
                .set('Cookie', [auth.cookie]);

            expect(res.statusCode).toBe(200);
            expect(res.body.costs.length).toBe(1);
            expect(res.body.costs[0].category).toBe('stay');
        });
    });

    describe('PATCH and DELETE /api/trips/:tripId/costs/:costId', () => {
        let costId;

        beforeEach(async () => {
            const res = await request(app)
                .post(`/api/trips/${trip.id}/costs`)
                .set('Cookie', [auth.cookie])
                .send({
                    category: 'transport',
                    amount: 50,
                    description: 'Train ticket',
                });
            costId = res.body.cost.id;
        });

        it('should update cost entry amount and description', async () => {
            const res = await request(app)
                .patch(`/api/trips/${trip.id}/costs/${costId}`)
                .set('Cookie', [auth.cookie])
                .send({
                    amount: 65.0,
                    description: 'First class train ticket',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.cost.amount).toBe('65.00');
            expect(res.body.cost.description).toBe('First class train ticket');
        });

        it('should delete cost entry', async () => {
            const res = await request(app)
                .delete(`/api/trips/${trip.id}/costs/${costId}`)
                .set('Cookie', [auth.cookie]);

            expect(res.statusCode).toBe(200);

            const listRes = await request(app)
                .get(`/api/trips/${trip.id}/costs`)
                .set('Cookie', [auth.cookie]);

            expect(listRes.body.costs.length).toBe(0);
        });
    });
});
