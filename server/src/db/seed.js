import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db, pool } from '../config/database.config.js';
import { users } from './schema/users.schema.js';
import { createCity, listCities } from '../dao/city.dao.js';
import { createActivity, createActivityImage } from '../dao/activity.dao.js';

async function seedUsers() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const seedUsers = [
        {
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
            emailVerified: true,
            isActive: true,
            isDeleted: false,
        },
        ...Array.from({ length: 10 }, (_, i) => ({
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            password: hashedPassword,
            role: 'user',
            emailVerified: true,
            isActive: true,
            isDeleted: false,
        })),
    ];

    try {
        const existingUsers = await db.select().from(users).limit(1);
        if (existingUsers.length > 0) {
            console.log('Users table already has records. Skipping user seeding...');
            return;
        }

        await db.insert(users).values(seedUsers).returning();
        console.log(`Seeded ${seedUsers.length} users successfully`);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
}

async function seedDiscoveryData() {
    try {
        const existing = await listCities({ page: 1, limit: 1 });
        if (existing.total > 0) {
            console.log('Cities table already seeded. Skipping discovery seeding...');
            return;
        }

        // Seeding cities
        const paris = await createCity({
            name: 'Paris',
            country: 'France',
            region: 'Europe',
            costIndex: '4.50',
            popularity: '4.90',
        });

        const tokyo = await createCity({
            name: 'Tokyo',
            country: 'Japan',
            region: 'Asia',
            costIndex: '4.20',
            popularity: '4.85',
        });

        const newYork = await createCity({
            name: 'New York',
            country: 'United States',
            region: 'North America',
            costIndex: '4.80',
            popularity: '4.95',
        });

        console.log('Seeded 3 cities successfully');

        // Paris Activities
        const eiffel = await createActivity({
            cityId: paris.id,
            name: 'Eiffel Tower Summit Access',
            description: 'Skip-the-line elevator ticket to the top summit floor.',
            activityType: 'sightseeing',
            cost: '2500.00',
            durationMinutes: 120,
        });
        await createActivityImage({
            activityId: eiffel.id,
            imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
            displayOrder: 1,
        });

        const Louvre = await createActivity({
            cityId: paris.id,
            name: 'Louvre Museum Tour',
            description: "Guided tour of the world's largest art museum.",
            activityType: 'museum',
            cost: '4500.00',
            durationMinutes: 180,
        });
        await createActivityImage({
            activityId: Louvre.id,
            imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee87',
            displayOrder: 1,
        });

        // Tokyo Activities
        const shibuya = await createActivity({
            cityId: tokyo.id,
            name: 'Shibuya Go-Karting Tour',
            description: 'Drive karts through Shibuya Crossing dressed in costumes.',
            activityType: 'adventure',
            cost: '6500.00',
            durationMinutes: 90,
        });
        await createActivityImage({
            activityId: shibuya.id,
            imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
            displayOrder: 1,
        });

        console.log('Seeded activity items successfully');
    } catch (error) {
        console.error('Error seeding discovery data:', error);
    }
}

async function main() {
    await seedUsers();
    await seedDiscoveryData();
    await pool.end();
    process.exit(0);
}

main();
