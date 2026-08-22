import { db } from '../config/database.config.js';
import { tripStopActivities } from '../db/schema/trip_stop_activities.schema.js';
import { activities } from '../db/schema/activities.schema.js';
import { eq, and, asc, sql, ilike } from 'drizzle-orm';

/**
 * Get highest sequence order for activities in a stop on a particular date
 * @param {string} stopId
 * @param {string} activityDate
 */
export async function getMaxActivitySequenceOrder(stopId, activityDate) {
    const [result] = await db
        .select({ maxOrder: sql`COALESCE(MAX(${tripStopActivities.sequenceOrder}), 0)` })
        .from(tripStopActivities)
        .where(
            and(
                eq(tripStopActivities.tripStopId, stopId),
                eq(tripStopActivities.activityDate, activityDate),
            ),
        );
    return parseInt(result?.maxOrder || '0', 10);
}

/**
 * Find an existing activity in the catalog for this city, or create a new custom one
 * @param {object} param0
 */
export async function findOrCreateActivity({
    cityId,
    name,
    description = '',
    activityType = 'sightseeing',
    cost = 0,
    durationMinutes = 60,
    currency = 'INR',
}) {
    // Check if matching activity exists in city catalog
    const [existing] = await db
        .select()
        .from(activities)
        .where(and(eq(activities.cityId, cityId), ilike(activities.name, name.trim())));

    if (existing) return existing;

    // Create new activity entry
    const [created] = await db
        .insert(activities)
        .values({
            cityId,
            name: name.trim(),
            description,
            activityType,
            cost: cost ? cost.toString() : '0',
            durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : 60,
            currency: currency || 'INR',
        })
        .returning();

    return created;
}

/**
 * Schedule an activity inside a trip stop
 * @param {object} data
 */
export async function createTripStopActivity(data) {
    let sequenceOrder = data.sequenceOrder;
    if (!sequenceOrder || sequenceOrder <= 0) {
        const maxOrder = await getMaxActivitySequenceOrder(data.tripStopId, data.activityDate);
        sequenceOrder = maxOrder + 1;
    }

    const [scheduled] = await db
        .insert(tripStopActivities)
        .values({
            ...data,
            sequenceOrder,
        })
        .returning();
    return scheduled;
}

/**
 * Get all scheduled activities for a stop
 * @param {string} stopId
 */
export async function getActivitiesByStopId(stopId) {
    return db
        .select({
            id: tripStopActivities.id,
            tripStopId: tripStopActivities.tripStopId,
            activityId: tripStopActivities.activityId,
            name: activities.name,
            description: activities.description,
            activityType: activities.activityType,
            cost: activities.cost,
            durationMinutes: activities.durationMinutes,
            currency: activities.currency,
            activityDate: tripStopActivities.activityDate,
            startTime: tripStopActivities.startTime,
            endTime: tripStopActivities.endTime,
            sequenceOrder: tripStopActivities.sequenceOrder,
            notes: tripStopActivities.notes,
            createdAt: tripStopActivities.createdAt,
            updatedAt: tripStopActivities.updatedAt,
        })
        .from(tripStopActivities)
        .leftJoin(activities, eq(tripStopActivities.activityId, activities.id))
        .where(eq(tripStopActivities.tripStopId, stopId))
        .orderBy(
            asc(tripStopActivities.activityDate),
            asc(tripStopActivities.sequenceOrder),
            asc(tripStopActivities.startTime),
        );
}

/**
 * Get single scheduled activity by ID
 * @param {string} id
 */
export async function getActivityById(id) {
    const [activity] = await db
        .select({
            id: tripStopActivities.id,
            tripStopId: tripStopActivities.tripStopId,
            activityId: tripStopActivities.activityId,
            name: activities.name,
            description: activities.description,
            activityType: activities.activityType,
            cost: activities.cost,
            durationMinutes: activities.durationMinutes,
            currency: activities.currency,
            activityDate: tripStopActivities.activityDate,
            startTime: tripStopActivities.startTime,
            endTime: tripStopActivities.endTime,
            sequenceOrder: tripStopActivities.sequenceOrder,
            notes: tripStopActivities.notes,
            createdAt: tripStopActivities.createdAt,
            updatedAt: tripStopActivities.updatedAt,
        })
        .from(tripStopActivities)
        .leftJoin(activities, eq(tripStopActivities.activityId, activities.id))
        .where(eq(tripStopActivities.id, id));
    return activity || null;
}

/**
 * Update scheduled activity in a stop
 * @param {string} id
 * @param {string} stopId
 * @param {object} updates
 */
export async function updateTripStopActivity(id, stopId, updates) {
    const [updated] = await db
        .update(tripStopActivities)
        .set({
            ...updates,
            updatedAt: new Date(),
        })
        .where(and(eq(tripStopActivities.id, id), eq(tripStopActivities.tripStopId, stopId)))
        .returning();
    return updated || null;
}

/**
 * Delete a scheduled activity from a stop
 * @param {string} id
 * @param {string} stopId
 */
export async function deleteTripStopActivity(id, stopId) {
    const [deleted] = await db
        .delete(tripStopActivities)
        .where(and(eq(tripStopActivities.id, id), eq(tripStopActivities.tripStopId, stopId)))
        .returning();
    return deleted || null;
}

/**
 * Batch reorder activities within a stop
 * @param {string} stopId
 * @param {Array<{ id: string, sequenceOrder: number }>} activityOrders
 */
export async function reorderStopActivities(stopId, activityOrders) {
    return db.transaction(async (tx) => {
        // Step 1: Temporarily offset sequence orders
        for (let i = 0; i < activityOrders.length; i++) {
            const item = activityOrders[i];
            await tx
                .update(tripStopActivities)
                .set({ sequenceOrder: 10000 + i + 1, updatedAt: new Date() })
                .where(
                    and(
                        eq(tripStopActivities.id, item.id),
                        eq(tripStopActivities.tripStopId, stopId),
                    ),
                );
        }

        // Step 2: Set final sequence orders
        const results = [];
        for (const item of activityOrders) {
            const [updated] = await tx
                .update(tripStopActivities)
                .set({ sequenceOrder: item.sequenceOrder, updatedAt: new Date() })
                .where(
                    and(
                        eq(tripStopActivities.id, item.id),
                        eq(tripStopActivities.tripStopId, stopId),
                    ),
                )
                .returning();
            if (updated) results.push(updated);
        }
        return results;
    });
}
