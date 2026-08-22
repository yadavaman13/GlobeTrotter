import 'dotenv/config';
import test from 'node:test';
import assert from 'node:assert';
import { createCity } from '../../dao/city.dao.js';
import {
    createActivity,
    createActivityImage,
    getActivityById,
    listActivities,
} from '../../dao/activity.dao.js';
import { db } from '../../config/database.config.js';
import { cities } from '../../db/schema/cities.schema.js';
import { activities } from '../../db/schema/activities.schema.js';
import { activityImages } from '../../db/schema/activity_images.schema.js';
import { trips } from '../../db/schema/trips.schema.js';
import { tripStops } from '../../db/schema/trip_stops.schema.js';
import { tripStopActivities } from '../../db/schema/trip_stop_activities.schema.js';

test('Activity DAO Tests', async (t) => {
    // Clear tables
    await db.delete(tripStopActivities);
    await db.delete(tripStops);
    await db.delete(trips);
    await db.delete(activityImages);
    await db.delete(activities);
    await db.delete(cities);

    let city;

    await t.test('should create and retrieve an activity with city and images', async () => {
        city = await createCity({
            name: 'Rome',
            country: 'Italy',
            region: 'Europe',
            costIndex: '4.30',
            popularity: '4.85',
        });

        const activity = await createActivity({
            cityId: city.id,
            name: 'Colosseum Tour',
            description: 'Guided tour of Rome Colosseum',
            activityType: 'sightseeing',
            cost: '50.00',
            durationMinutes: 120,
        });

        await createActivityImage({
            activityId: activity.id,
            imageUrl: 'http://example.com/colosseum.jpg',
            displayOrder: 1,
        });

        const retrieved = await getActivityById(activity.id);
        assert.ok(retrieved);
        assert.strictEqual(retrieved.name, 'Colosseum Tour');
        assert.strictEqual(retrieved.city.name, 'Rome');
        assert.strictEqual(retrieved.images.length, 1);
        assert.strictEqual(retrieved.images[0].imageUrl, 'http://example.com/colosseum.jpg');
    });

    await t.test('should filter and list activities', async () => {
        // Add another activity
        await createActivity({
            cityId: city.id,
            name: 'Vatican Museums',
            description: 'Tour of Vatican Museums',
            activityType: 'museum',
            cost: '40.00',
            durationMinutes: 180,
        });

        const all = await listActivities({ page: 1, limit: 10 });
        assert.strictEqual(all.total, 2);
        assert.strictEqual(all.activities.length, 2);

        // Filter by activityType
        const filtered = await listActivities({ activityType: 'museum', page: 1, limit: 10 });
        assert.strictEqual(filtered.total, 1);
        assert.strictEqual(filtered.activities[0].name, 'Vatican Museums');

        // Filter by minCost/maxCost
        const costFiltered = await listActivities({ minCost: 45, page: 1, limit: 10 });
        assert.strictEqual(costFiltered.total, 1);
        assert.strictEqual(costFiltered.activities[0].name, 'Colosseum Tour');
    });
});
