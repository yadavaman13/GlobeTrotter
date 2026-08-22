import jwt from 'jsonwebtoken';
import envConfig from '../../config/env.config.js';
import { db } from '../../config/database.config.js';
import { users } from '../../db/schema/users.schema.js';
import { cities } from '../../db/schema/cities.schema.js';

const PRECOMPUTED_HASH = '$2a$04$zB4Rlgq0m27fD9xP45F/3OHHkQ2Yp4G6Hn8i0UeZ6lJ5wW3lS4d8q'; // dummy fast hash

export async function createTestUser({
    firstName = 'Explorer',
    lastName = 'One',
    email = `explorer.${Date.now()}.${Math.random().toString(36).substring(7)}@gt-test.com`,
    password = 'Password123!',
    role = 'user',
} = {}) {
    const [user] = await db
        .insert(users)
        .values({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: PRECOMPUTED_HASH,
            role,
            isActive: true,
            emailVerified: true,
        })
        .returning();

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        envConfig.JWT_SECRET,
        { expiresIn: '1d' },
    );

    return { user, token, cookie: `token=${token}` };
}

export async function createTestCity({
    name = 'City',
    country = 'Japan',
    region = 'Asia',
    costIndex = '3.0',
    popularity = '8.5',
} = {}) {
    const uniqueName = `${name}-${Math.random().toString(36).substring(2, 10)}`;
    const [city] = await db
        .insert(cities)
        .values({
            name: uniqueName,
            country,
            region,
            costIndex,
            popularity,
        })
        .returning();
    return city;
}
