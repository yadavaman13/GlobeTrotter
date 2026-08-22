import 'dotenv/config';
import request from 'supertest';
import app from '../../app.js';
import { createTestUser } from './test-helper.js';

describe('Module 11: Trip Sharing & Collaboration Integration Tests', () => {
    let ownerAuth;
    let friendAuth;
    let strangerAuth;
    let trip;

    beforeEach(async () => {
        ownerAuth = await createTestUser({ email: `owner.${Date.now()}@example.com` });
        friendAuth = await createTestUser({ email: `friend.${Date.now()}@example.com` });
        strangerAuth = await createTestUser({ email: `stranger.${Date.now()}@example.com` });

        const tripRes = await request(app)
            .post('/api/trips')
            .set('Cookie', [ownerAuth.cookie])
            .send({
                title: 'Collaborative Swiss Alps Trip',
                startDate: '2026-07-01',
                endDate: '2026-07-10',
                visibility: 'private',
            });
        trip = tripRes.body.trip;
    });

    describe('POST /api/trips/:tripId/shares', () => {
        it('should allow trip owner to share trip with another user by email', async () => {
            const res = await request(app)
                .post(`/api/trips/${trip.id}/shares`)
                .set('Cookie', [ownerAuth.cookie])
                .send({
                    email: friendAuth.user.email,
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.share).toBeDefined();
            expect(res.body.data.share.sharedWithUser.id).toBe(friendAuth.user.id);
        });

        it('should allow shared user to access private trip details', async () => {
            // 1. Share with friend
            await request(app)
                .post(`/api/trips/${trip.id}/shares`)
                .set('Cookie', [ownerAuth.cookie])
                .send({
                    userId: friendAuth.user.id,
                });

            // 2. Friend accesses private trip
            const res = await request(app)
                .get(`/api/trips/${trip.id}`)
                .set('Cookie', [friendAuth.cookie]);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.trip.id).toBe(trip.id);
        });

        it('should prevent user from sharing trip with themselves', async () => {
            const res = await request(app)
                .post(`/api/trips/${trip.id}/shares`)
                .set('Cookie', [ownerAuth.cookie])
                .send({
                    email: ownerAuth.user.email,
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('cannot share a trip with yourself');
        });

        it('should reject non-owners from sharing the trip', async () => {
            const res = await request(app)
                .post(`/api/trips/${trip.id}/shares`)
                .set('Cookie', [strangerAuth.cookie])
                .send({
                    email: friendAuth.user.email,
                });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/trips/:tripId/shares', () => {
        it('should list all shared collaborators for the trip', async () => {
            // Share with friend
            await request(app)
                .post(`/api/trips/${trip.id}/shares`)
                .set('Cookie', [ownerAuth.cookie])
                .send({
                    userId: friendAuth.user.id,
                });

            const res = await request(app)
                .get(`/api/trips/${trip.id}/shares`)
                .set('Cookie', [ownerAuth.cookie]);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.shares).toHaveLength(1);
            expect(res.body.data.shares[0].sharedWithUserId).toBe(friendAuth.user.id);
        });
    });

    describe('DELETE /api/trips/:tripId/shares/:userId', () => {
        it('should revoke sharing access for a collaborator', async () => {
            // 1. Share
            await request(app)
                .post(`/api/trips/${trip.id}/shares`)
                .set('Cookie', [ownerAuth.cookie])
                .send({
                    userId: friendAuth.user.id,
                });

            // 2. Revoke
            const revokeRes = await request(app)
                .delete(`/api/trips/${trip.id}/shares/${friendAuth.user.id}`)
                .set('Cookie', [ownerAuth.cookie]);

            expect(revokeRes.statusCode).toBe(200);
            expect(revokeRes.body.success).toBe(true);

            // 3. Friend should no longer have access
            const accessRes = await request(app)
                .get(`/api/trips/${trip.id}`)
                .set('Cookie', [friendAuth.cookie]);

            expect(accessRes.statusCode).toBe(403);
        });
    });
});
