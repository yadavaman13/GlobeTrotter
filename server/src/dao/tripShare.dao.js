import { db } from '../config/database.config.js';
import { tripShares } from '../db/schema/trip_shares.schema.js';
import { users } from '../db/schema/users.schema.js';
import { trips } from '../db/schema/trips.schema.js';
import { eq, and, desc } from 'drizzle-orm';

/**
 * Create a new trip share record
 * @param {string} tripId
 * @param {string} sharedWithUserId
 * @param {string} createdBy
 */
export async function createTripShare(tripId, sharedWithUserId, createdBy) {
    const [share] = await db
        .insert(tripShares)
        .values({
            tripId,
            sharedWithUserId,
            createdBy,
        })
        .onConflictDoNothing()
        .returning();
    return share || null;
}

/**
 * List all users with whom a trip is shared
 * @param {string} tripId
 */
export async function listTripShares(tripId) {
    const shares = await db
        .select({
            id: tripShares.id,
            tripId: tripShares.tripId,
            sharedWithUserId: tripShares.sharedWithUserId,
            createdBy: tripShares.createdBy,
            createdAt: tripShares.createdAt,
            user: {
                id: users.id,
                email: users.email,
                firstName: users.firstName,
                lastName: users.lastName,
                profileImage: users.profileImage,
            },
        })
        .from(tripShares)
        .leftJoin(users, eq(tripShares.sharedWithUserId, users.id))
        .where(eq(tripShares.tripId, tripId))
        .orderBy(desc(tripShares.createdAt));

    return shares;
}

/**
 * Delete a trip share by tripId and target user
 * @param {string} tripId
 * @param {string} sharedWithUserId
 */
export async function deleteTripShare(tripId, sharedWithUserId) {
    const [deleted] = await db
        .delete(tripShares)
        .where(
            and(eq(tripShares.tripId, tripId), eq(tripShares.sharedWithUserId, sharedWithUserId)),
        )
        .returning();
    return deleted || null;
}

/**
 * Check if a trip is shared with a specific user
 * @param {string} tripId
 * @param {string} userId
 */
export async function isTripSharedWithUser(tripId, userId) {
    if (!tripId || !userId) return false;
    const [share] = await db
        .select({ id: tripShares.id })
        .from(tripShares)
        .where(and(eq(tripShares.tripId, tripId), eq(tripShares.sharedWithUserId, userId)))
        .limit(1);
    return !!share;
}

/**
 * List trips shared with a user
 * @param {string} userId
 */
export async function listSharedTripsForUser(userId) {
    const sharedTrips = await db
        .select({
            shareId: tripShares.id,
            sharedAt: tripShares.createdAt,
            trip: trips,
            owner: {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
            },
        })
        .from(tripShares)
        .innerJoin(trips, eq(tripShares.tripId, trips.id))
        .leftJoin(users, eq(trips.ownerId, users.id))
        .where(eq(tripShares.sharedWithUserId, userId))
        .orderBy(desc(tripShares.createdAt));

    return sharedTrips;
}
