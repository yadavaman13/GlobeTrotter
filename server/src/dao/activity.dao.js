import { db } from '../config/database.config.js';
import { activities } from '../db/schema/activities.schema.js';
import { activityImages } from '../db/schema/activity_images.schema.js';
import { cities } from '../db/schema/cities.schema.js';
import { tripStopActivities } from '../db/schema/trip_stop_activities.schema.js';
import { eq, and, gte, lte, inArray, ilike, desc, asc, sql } from 'drizzle-orm';

/**
 * Creates a new catalog activity.
 * @param {object} activityData
 * @returns {Promise<object>} Created activity
 */
export async function createActivity(activityData) {
    const [newActivity] = await db.insert(activities).values(activityData).returning();
    return newActivity;
}

/**
 * Inserts a new image link for an activity.
 * @param {object} imageData
 * @returns {Promise<object>} Created activity image
 */
export async function createActivityImage(imageData) {
    const [newImage] = await db.insert(activityImages).values(imageData).returning();
    return newImage;
}

/**
 * Fetches detailed activity profile by ID, joined with city details and images list.
 * @param {string} id - Activity ID (UUID)
 * @returns {Promise<object|null>} Detailed activity record or null if not found
 */
export async function getActivityById(id) {
    const [result] = await db
        .select({
            id: activities.id,
            name: activities.name,
            description: activities.description,
            activityType: activities.activityType,
            cost: activities.cost,
            durationMinutes: activities.durationMinutes,
            currency: activities.currency,
            createdAt: activities.createdAt,
            updatedAt: activities.updatedAt,
            city: {
                id: cities.id,
                name: cities.name,
                country: cities.country,
                region: cities.region,
                costIndex: cities.costIndex,
                popularity: cities.popularity,
            },
        })
        .from(activities)
        .innerJoin(cities, eq(activities.cityId, cities.id))
        .where(eq(activities.id, id));

    if (!result) return null;

    const images = await db
        .select({
            id: activityImages.id,
            imageUrl: activityImages.imageUrl,
            displayOrder: activityImages.displayOrder,
        })
        .from(activityImages)
        .where(eq(activityImages.activityId, id))
        .orderBy(asc(activityImages.displayOrder));

    return {
        ...result,
        images,
    };
}

/**
 * Lists activities matching various filters with pagination and sorting.
 * Also retrieves and nests associated images list.
 * @param {object} filters
 * @returns {Promise<{ activities: Array, total: number }>} List of activities and total count matching filters
 */
export async function listActivities({
    cityId,
    activityType,
    minCost,
    maxCost,
    minDuration,
    maxDuration,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    q,
}) {
    const filters = [];

    if (cityId) {
        filters.push(eq(activities.cityId, cityId));
    }
    if (activityType) {
        filters.push(ilike(activities.activityType, `%${activityType}%`));
    }
    if (minCost !== undefined && minCost !== null) {
        filters.push(gte(activities.cost, minCost.toString()));
    }
    if (maxCost !== undefined && maxCost !== null) {
        filters.push(lte(activities.cost, maxCost.toString()));
    }
    if (minDuration !== undefined && minDuration !== null) {
        filters.push(gte(activities.durationMinutes, minDuration));
    }
    if (maxDuration !== undefined && maxDuration !== null) {
        filters.push(lte(activities.durationMinutes, maxDuration));
    }
    if (q) {
        filters.push(
            sql`(${ilike(activities.name, `%${q}%`)} OR ${ilike(activities.description, `%${q}%`)})`,
        );
    }

    const offset = (page - 1) * limit;
    const orderColumn = activities[sortBy] || activities.createdAt;
    const sorting = sortOrder.toLowerCase() === 'asc' ? asc(orderColumn) : desc(orderColumn);

    const items = await db
        .select({
            id: activities.id,
            name: activities.name,
            description: activities.description,
            activityType: activities.activityType,
            cost: activities.cost,
            durationMinutes: activities.durationMinutes,
            currency: activities.currency,
            createdAt: activities.createdAt,
            updatedAt: activities.updatedAt,
            city: {
                id: cities.id,
                name: cities.name,
                country: cities.country,
                region: cities.region,
                costIndex: cities.costIndex,
                popularity: cities.popularity,
            },
        })
        .from(activities)
        .innerJoin(cities, eq(activities.cityId, cities.id))
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(sorting)
        .limit(limit)
        .offset(offset);

    const [countResult] = await db
        .select({ count: sql`count(*)` })
        .from(activities)
        .where(filters.length > 0 ? and(...filters) : undefined);

    const total = parseInt(countResult?.count || '0', 10);

    if (items.length === 0) {
        return { activities: [], total };
    }

    const activityIds = items.map((item) => item.id);
    const allImages = await db
        .select({
            id: activityImages.id,
            activityId: activityImages.activityId,
            imageUrl: activityImages.imageUrl,
            displayOrder: activityImages.displayOrder,
        })
        .from(activityImages)
        .where(inArray(activityImages.activityId, activityIds))
        .orderBy(asc(activityImages.displayOrder));

    const activitiesWithImages = items.map((activity) => {
        const images = allImages
            .filter((img) => img.activityId === activity.id)
            .map(({ id, imageUrl, displayOrder }) => ({ id, imageUrl, displayOrder }));
        return {
            ...activity,
            images,
        };
    });

    return {
        activities: activitiesWithImages,
        total,
    };
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
 * Get single scheduled activity by tripStopActivity ID
 * @param {string} id
 */
export async function getTripStopActivityById(id) {
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
