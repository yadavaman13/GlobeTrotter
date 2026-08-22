import 'dotenv/config';
import { db, pool } from '../config/database.config.js';
import { users } from '../db/schema/users.schema.js';
import redis from '../config/cache.config.js';

import { like } from 'drizzle-orm';

beforeEach(async () => {
    try {
        await db.delete(users).where(like(users.email, '%@example.com'));
    } catch (err) {
        console.error('Error cleaning up users table before test:', err);
    }
});

afterAll(async () => {
    try {
        const originalLog = console.log;
        console.log = () => {};
        await pool.end();
        await redis.quit();
        await new Promise((resolve) => setTimeout(resolve, 50));
        console.log = originalLog;
    } catch (err) {
        console.error('Error closing database/redis connections in test teardown:', err);
    }
});
