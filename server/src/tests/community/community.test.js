import 'dotenv/config';
import request from 'supertest';
import app from '../../app.js';
import { db, pool } from '../../config/database.config.js';
import redis from '../../config/cache.config.js';
import { users } from '../../db/schema/users.schema.js';
import { trips } from '../../db/schema/trips.schema.js';
import { cities } from '../../db/schema/cities.schema.js';
import { activities } from '../../db/schema/activities.schema.js';
import { tripStops } from '../../db/schema/trip_stops.schema.js';
import {
    communityPosts,
    communityLikes,
    communityComments,
} from '../../db/schema/community_posts.schema.js';
import { eq, and, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { signToken } from '../../modules/auth/utils/jwt.js';

describe('Community Module Integration Tests', () => {
    let user1, user2;
    let cookie1, cookie2;
    let cityA, cityB;
    let activityA, activityB;
    let tripUser1, tripUser2;
    let hashedPassword;

    const testPassword = 'Aman@123';

    async function getOrCreateCity(name, country) {
        const [existing] = await db
            .select()
            .from(cities)
            .where(and(eq(cities.name, name), eq(cities.country, country)));
        if (existing) return existing;

        const [inserted] = await db
            .insert(cities)
            .values({
                name,
                country,
            })
            .returning();
        return inserted;
    }

    async function getOrCreateActivity(cityId, name, activityType, cost, durationMinutes) {
        const [existing] = await db
            .select()
            .from(activities)
            .where(and(eq(activities.cityId, cityId), eq(activities.name, name)));
        if (existing) return existing;

        const [inserted] = await db
            .insert(activities)
            .values({
                cityId,
                name,
                activityType,
                cost,
                durationMinutes,
            })
            .returning();
        return inserted;
    }

    beforeAll(async () => {
        // Hash password once to save CPU time during beforeEach
        hashedPassword = await bcrypt.hash(testPassword, 10);

        // Setup master tables safely without violating unique constraints
        cityA = await getOrCreateCity('Jaipur', 'India');
        cityB = await getOrCreateCity('Paris', 'France');

        activityA = await getOrCreateActivity(
            cityA.id,
            'Amber Fort Sightseeing',
            'Sightseeing',
            '500.00',
            180,
        );

        activityB = await getOrCreateActivity(
            cityB.id,
            'Eiffel Tower Visit',
            'Sightseeing',
            '2000.00',
            120,
        );
    });

    beforeEach(async () => {
        // Delete test user data specifically in reverse dependency order to prevent foreign key/trigger errors
        await db.delete(communityComments);
        await db.delete(communityLikes);
        await db.delete(communityPosts);

        // Find or create User 1
        const [existingU1] = await db
            .select()
            .from(users)
            .where(eq(users.email, 'work.yadavaman@gmail.com'));
        if (existingU1) {
            user1 = existingU1;
        } else {
            [user1] = await db
                .insert(users)
                .values({
                    firstName: 'Aman',
                    lastName: 'Yadav',
                    email: 'work.yadavaman@gmail.com',
                    password: hashedPassword,
                    role: 'user',
                })
                .returning();
        }

        // Find or create User 2
        const [existingU2] = await db
            .select()
            .from(users)
            .where(eq(users.email, 'aryan@example.com'));
        if (existingU2) {
            user2 = existingU2;
        } else {
            [user2] = await db
                .insert(users)
                .values({
                    firstName: 'Aryan',
                    lastName: 'Sharma',
                    email: 'aryan@example.com',
                    password: hashedPassword,
                    role: 'user',
                })
                .returning();
        }

        // Delete existing trips owned by these users specifically to maintain clean state
        const userTrips1 = await db.select().from(trips).where(eq(trips.ownerId, user1.id));
        const userTrips2 = await db.select().from(trips).where(eq(trips.ownerId, user2.id));
        const tripIds = [...userTrips1, ...userTrips2].map((t) => t.id);

        for (const tripId of tripIds) {
            await db.delete(tripStops).where(eq(tripStops.tripId, tripId));
        }
        if (tripIds.length > 0) {
            await db
                .delete(trips)
                .where(or(eq(trips.ownerId, user1.id), eq(trips.ownerId, user2.id)));
        }

        // Generate token and cookies directly without HTTP login request overhead
        const token1 = signToken({ id: user1.id });
        const token2 = signToken({ id: user2.id });
        cookie1 = [`token=${token1}`];
        cookie2 = [`token=${token2}`];

        // Create trip for user 1
        [tripUser1] = await db
            .insert(trips)
            .values({
                ownerId: user1.id,
                name: 'Rajasthan Expedition',
                startDate: '2026-09-01',
                endDate: '2026-09-10',
                status: 'planned',
                visibility: 'private',
            })
            .returning();

        // Create trip stop in Jaipur (cityA) for user 1 trip
        await db.insert(tripStops).values({
            tripId: tripUser1.id,
            cityId: cityA.id,
            startDate: '2026-09-01',
            endDate: '2026-09-05',
            sequenceOrder: 1,
        });

        // Create trip for user 2
        [tripUser2] = await db
            .insert(trips)
            .values({
                ownerId: user2.id,
                name: 'European Getaway',
                startDate: '2026-10-01',
                endDate: '2026-10-15',
                status: 'planned',
                visibility: 'private',
            })
            .returning();
    });

    describe('POST /api/community/posts', () => {
        it('should allow user1 to create a post about user1 trip', async () => {
            const res = await request(app)
                .post('/api/community/posts')
                .set('Cookie', cookie1)
                .send({
                    postType: 'trip',
                    tripId: tripUser1.id,
                    title: 'Fascinating Jaipur Expedition',
                    content: 'Visiting Amber Fort and local bazaars was a highlight.',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.post.title).toBe('Fascinating Jaipur Expedition');
            expect(res.body.data.post.postType).toBe('trip');
            expect(res.body.data.post.trip.id).toBe(tripUser1.id);
            expect(res.body.data.post.author.id).toBe(user1.id);
        });

        it('should block user1 from posting about user2 trip', async () => {
            const res = await request(app)
                .post('/api/community/posts')
                .set('Cookie', cookie1)
                .send({
                    postType: 'trip',
                    tripId: tripUser2.id,
                    title: 'Illegal Post',
                    content: 'Trying to post on another user trip.',
                });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Unauthorized');
        });

        it('should allow any user to post about a global activity', async () => {
            const res = await request(app)
                .post('/api/community/posts')
                .set('Cookie', cookie1)
                .send({
                    postType: 'activity',
                    activityId: activityA.id,
                    title: 'Amber Fort Guide',
                    content: 'Rented an audio guide which was very detailed.',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.post.postType).toBe('activity');
            expect(res.body.data.post.activity.id).toBe(activityA.id);
        });

        it('should fail when both tripId and activityId are provided', async () => {
            const res = await request(app)
                .post('/api/community/posts')
                .set('Cookie', cookie1)
                .send({
                    postType: 'trip',
                    tripId: tripUser1.id,
                    activityId: activityA.id,
                    title: 'Confused Post',
                    content: 'Contains both targets.',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Validation failed');
        });
    });

    describe('GET /api/community/posts', () => {
        let postTrip, postActivity;

        beforeEach(async () => {
            // Seed a trip post
            [postTrip] = await db
                .insert(communityPosts)
                .values({
                    authorId: user1.id,
                    postType: 'trip',
                    tripId: tripUser1.id,
                    title: 'Rajasthan Post',
                    content: 'Exploring Jaipur and local sites.',
                })
                .returning();

            // Seed an activity post
            [postActivity] = await db
                .insert(communityPosts)
                .values({
                    authorId: user2.id,
                    postType: 'activity',
                    activityId: activityB.id,
                    title: 'Eiffel Tower Post',
                    content: 'Breathtaking view of Paris.',
                })
                .returning();
        });

        it('should fetch all community posts for public access', async () => {
            const res = await request(app).get('/api/community/posts');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.items.length).toBe(2);
            expect(res.body.data.pagination.total).toBe(2);
        });

        it('should filter feed by cityId', async () => {
            const res = await request(app).get('/api/community/posts').query({ cityId: cityA.id });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.items.length).toBe(1);
            expect(res.body.data.items[0].id).toBe(postTrip.id);
        });

        it('should search feed by keyword', async () => {
            const res = await request(app).get('/api/community/posts').query({ search: 'eiffel' });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.items.length).toBe(1);
            expect(res.body.data.items[0].id).toBe(postActivity.id);
        });

        it('should group feed by type', async () => {
            const res = await request(app).get('/api/community/posts').query({ groupBy: 'type' });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.grouped).toBeDefined();
            expect(res.body.data.grouped.trips.length).toBe(1);
            expect(res.body.data.grouped.activities.length).toBe(1);
        });
    });

    describe('PATCH /api/community/posts/:postId', () => {
        let post;

        beforeEach(async () => {
            [post] = await db
                .insert(communityPosts)
                .values({
                    authorId: user1.id,
                    postType: 'trip',
                    tripId: tripUser1.id,
                    title: 'Rajasthan Expedition',
                    content: 'Jaipur is beautiful.',
                })
                .returning();
        });

        it('should allow author to update post details', async () => {
            const res = await request(app)
                .patch(`/api/community/posts/${post.id}`)
                .set('Cookie', cookie1)
                .send({
                    title: 'Beautiful Jaipur Visit',
                    content: 'Updated content text here.',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.post.title).toBe('Beautiful Jaipur Visit');
        });

        it('should block non-author from updating post details', async () => {
            const res = await request(app)
                .patch(`/api/community/posts/${post.id}`)
                .set('Cookie', cookie2)
                .send({
                    title: 'Hacked Title',
                });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });

        it('should block updating immutable fields', async () => {
            const res = await request(app)
                .patch(`/api/community/posts/${post.id}`)
                .set('Cookie', cookie1)
                .send({
                    postType: 'activity',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Validation failed');
        });
    });

    describe('DELETE /api/community/posts/:postId', () => {
        let post;

        beforeEach(async () => {
            [post] = await db
                .insert(communityPosts)
                .values({
                    authorId: user1.id,
                    postType: 'trip',
                    tripId: tripUser1.id,
                    title: 'Rajasthan Post',
                    content: 'Content here.',
                })
                .returning();
        });

        it('should allow author to delete post', async () => {
            const res = await request(app)
                .delete(`/api/community/posts/${post.id}`)
                .set('Cookie', cookie1);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);

            // Verify post is deleted from database
            const [checkPost] = await db
                .select()
                .from(communityPosts)
                .where(eq(communityPosts.id, post.id));
            expect(checkPost).toBeUndefined();
        });

        it('should block non-author from deleting post', async () => {
            const res = await request(app)
                .delete(`/api/community/posts/${post.id}`)
                .set('Cookie', cookie2);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    afterAll(async () => {
        try {
            const originalLog = console.log;
            console.log = () => {};
            await pool.end();
            await redis.quit();
            console.log = originalLog;
        } catch (err) {
            console.error('Error closing database/redis connections in test teardown:', err);
        }
    });
});
