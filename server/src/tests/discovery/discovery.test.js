import 'dotenv/config';
import request from 'supertest';
import app from '../../app.js';
import { db } from '../../config/database.config.js';
import { cities } from '../../db/schema/cities.schema.js';
import { activities } from '../../db/schema/activities.schema.js';
import { activityImages } from '../../db/schema/activity_images.schema.js';
import { createCity } from '../../dao/city.dao.js';
import { createActivity, createActivityImage } from '../../dao/activity.dao.js';

describe('Discovery Modules Integration Tests', () => {
    let cityId;
    let activityId;

    beforeAll(async () => {
        // Clean tables
        await db.delete(activityImages);
        await db.delete(activities);
        await db.delete(cities);

        // Seed test data
        const city = await createCity({
            name: 'London',
            country: 'United Kingdom',
            region: 'Europe',
            costIndex: '4.60',
            popularity: '4.95',
        });
        cityId = city.id;

        const act = await createActivity({
            cityId: city.id,
            name: 'London Eye Flight',
            description: 'Scenic flight over London.',
            activityType: 'sightseeing',
            cost: '3000.00',
            durationMinutes: 30,
        });
        activityId = act.id;

        await createActivityImage({
            activityId: act.id,
            imageUrl: 'http://example.com/eye.jpg',
            displayOrder: 1,
        });
    });

    describe('GET /api/cities', () => {
        it('should retrieve a paginated list of cities', async () => {
            const res = await request(app).get('/api/cities');
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.cities).toBeDefined();
            expect(res.body.data.cities.length).toBeGreaterThan(0);
        });

        it('should filter cities by query search', async () => {
            const res = await request(app).get('/api/cities?q=London');
            expect(res.statusCode).toBe(200);
            expect(res.body.data.cities[0].name).toBe('London');
        });

        it('should reject requests with invalid query parameters', async () => {
            const res = await request(app).get('/api/cities?minCostIndex=-1');
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/cities/:cityId', () => {
        it('should retrieve specific city details', async () => {
            const res = await request(app).get(`/api/cities/${cityId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data.city.name).toBe('London');
        });

        it('should return 404 for non-existent city', async () => {
            const fakeUuid = '00000000-0000-0000-0000-000000000000';
            const res = await request(app).get(`/api/cities/${fakeUuid}`);
            expect(res.statusCode).toBe(404);
        });
    });

    describe('GET /api/cities/:cityId/activities', () => {
        it('should retrieve activities for a specific city', async () => {
            const res = await request(app).get(`/api/cities/${cityId}/activities`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.activities.length).toBeGreaterThan(0);
            expect(res.body.data.activities[0].name).toBe('London Eye Flight');
        });
    });

    describe('GET /api/activities', () => {
        it('should retrieve activities with cities and images', async () => {
            const res = await request(app).get('/api/activities');
            expect(res.statusCode).toBe(200);
            expect(res.body.data.activities[0].name).toBe('London Eye Flight');
            expect(res.body.data.activities[0].city.name).toBe('London');
            expect(res.body.data.activities[0].images.length).toBe(1);
        });

        it('should return 400 for negative duration parameters', async () => {
            const res = await request(app).get('/api/activities?minDuration=-5');
            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /api/activities/:activityId', () => {
        it('should retrieve detailed information of an activity', async () => {
            const res = await request(app).get(`/api/activities/${activityId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data.activity.name).toBe('London Eye Flight');
            expect(res.body.data.activity.images[0].imageUrl).toBe('http://example.com/eye.jpg');
        });

        it('should return 404 for non-existent activity', async () => {
            const fakeUuid = '00000000-0000-0000-0000-000000000000';
            const res = await request(app).get(`/api/activities/${fakeUuid}`);
            expect(res.statusCode).toBe(404);
        });
    });
});
