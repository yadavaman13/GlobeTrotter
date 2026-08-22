import 'dotenv/config';
import test from 'node:test';
import assert from 'node:assert';
import { createCity, getCityById, listCities } from '../../dao/city.dao.js';
import { db } from '../../config/database.config.js';
import { cities } from '../../db/schema/cities.schema.js';

test('City DAO Tests', async (t) => {
    // Clear cities table before run
    await db.delete(cities);

    await t.test('should create and retrieve a city', async () => {
        const newCity = await createCity({
            name: 'Paris',
            country: 'France',
            region: 'Europe',
            costIndex: '4.50',
            popularity: '5.00',
        });
        assert.ok(newCity.id);
        const retrieved = await getCityById(newCity.id);
        assert.strictEqual(retrieved.name, 'Paris');
        assert.strictEqual(retrieved.country, 'France');
    });

    await t.test('should filter and list cities', async () => {
        // Seed another city
        await createCity({
            name: 'Tokyo',
            country: 'Japan',
            region: 'Asia',
            costIndex: '4.20',
            popularity: '4.80',
        });

        const all = await listCities({ page: 1, limit: 10 });
        assert.strictEqual(all.total, 2);
        assert.strictEqual(all.cities.length, 2);

        // Filter by query 'Paris'
        const filtered = await listCities({ q: 'Paris', page: 1, limit: 10 });
        assert.strictEqual(filtered.total, 1);
        assert.strictEqual(filtered.cities[0].name, 'Paris');

        // Filter by cost index range
        const costFiltered = await listCities({ minCostIndex: 4.4, page: 1, limit: 10 });
        assert.strictEqual(costFiltered.total, 1);
        assert.strictEqual(costFiltered.cities[0].name, 'Paris');
    });
});
