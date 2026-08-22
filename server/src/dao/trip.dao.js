import { db } from '../config/database.config.js';
import { trips } from '../db/schema/trips.schema.js';
import { tripStops } from '../db/schema/trip_stops.schema.js';
import { tripStopActivities } from '../db/schema/trip_stop_activities.schema.js';
import { tripCostItems } from '../db/schema/trip_cost_items.schema.js';
import { cities } from '../db/schema/cities.schema.js';
import { activities } from '../db/schema/activities.schema.js';
import { users } from '../db/schema/users.schema.js';
import { eq, and, or, ilike, desc, asc, sql, inArray } from 'drizzle-orm';
import crypto from 'crypto';

/**
 * Helper to generate unique public slug for trips
 */
export function generatePublicSlug(name = 'trip') {
    const cleanName = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
        .slice(0, 30);
    const randomHex = crypto.randomBytes(4).toString('hex');
    return `${cleanName || 'trip'}-${randomHex}`;
}

/**
 * Create a new trip record
 * @param {object} tripData
 */
export async function createTrip(tripData) {
    const slug = tripData.publicSlug || generatePublicSlug(tripData.name);
    const [trip] = await db
        .insert(trips)
        .values({
            ...tripData,
            publicSlug: slug,
        })
        .returning();
    return trip;
}

/**
 * Get trip by primary key ID
 * @param {string} id
 */
export async function getTripById(id) {
    const [trip] = await db.select().from(trips).where(eq(trips.id, id));
    return trip || null;
}

/**
 * List trips for a specific user with filtering and pagination
 * @param {string} ownerId
 * @param {object} options
 */
export async function listUserTrips(
    ownerId,
    { search, status, page = 1, limit = 20, sortBy = 'createdAt', order = 'desc' } = {},
) {
    const conditions = [eq(trips.ownerId, ownerId)];

    if (status) {
        conditions.push(eq(trips.status, status));
    }

    if (search) {
        conditions.push(
            or(ilike(trips.name, `%${search}%`), ilike(trips.description, `%${search}%`)),
        );
    }

    const whereClause = and(...conditions);
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const sortField = trips[sortBy] || trips.createdAt;
    const sortOrder = order === 'asc' ? asc(sortField) : desc(sortField);

    // Get total count
    const [countResult] = await db
        .select({ count: sql`count(*)` })
        .from(trips)
        .where(whereClause);
    const total = parseInt(countResult?.count || '0', 10);

    const data = await db
        .select()
        .from(trips)
        .where(whereClause)
        .orderBy(sortOrder)
        .limit(parseInt(limit, 10))
        .offset(offset);

    return {
        trips: data,
        pagination: {
            total,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
        },
    };
}

/**
 * Update trip record
 * @param {string} id
 * @param {string} ownerId
 * @param {object} updates
 */
export async function updateTrip(id, ownerId, updates) {
    const [updated] = await db
        .update(trips)
        .set({
            ...updates,
            updatedAt: new Date(),
        })
        .where(and(eq(trips.id, id), eq(trips.ownerId, ownerId)))
        .returning();
    return updated || null;
}

/**
 * Delete a trip record and all associated cascades
 * @param {string} id
 * @param {string} ownerId
 */
export async function deleteTrip(id, ownerId) {
    const [deleted] = await db
        .delete(trips)
        .where(and(eq(trips.id, id), eq(trips.ownerId, ownerId)))
        .returning();
    return deleted || null;
}

/**
 * Update trip lifecycle status
 * @param {string} id
 * @param {string} ownerId
 * @param {string} status
 */
export async function updateTripStatus(id, ownerId, status) {
    return updateTrip(id, ownerId, { status });
}

/**
 * Update trip public visibility
 * @param {string} id
 * @param {string} ownerId
 * @param {'private' | 'public'} visibility
 */
export async function updateTripVisibility(id, ownerId, visibility) {
    const trip = await getTripById(id);
    if (!trip) return null;

    let publicSlug = trip.publicSlug;
    if (visibility === 'public' && !publicSlug) {
        publicSlug = generatePublicSlug(trip.name);
    }

    return updateTrip(id, ownerId, {
        visibility,
        ...(publicSlug ? { publicSlug } : {}),
    });
}

/**
 * Fetch public trip by unique share slug
 * @param {string} slug
 */
export async function getTripByPublicSlug(slug) {
    const [trip] = await db
        .select()
        .from(trips)
        .where(and(eq(trips.publicSlug, slug), eq(trips.visibility, 'public')));
    return trip || null;
}

/**
 * Retrieve fully hydrated trip with stops, stop activities, and cost items
 * @param {string} tripId
 */
export async function getHydratedTripById(tripId) {
    const trip = await getTripById(tripId);
    if (!trip) return null;

    // Fetch stops joined with cities
    const stopsList = await db
        .select({
            id: tripStops.id,
            tripId: tripStops.tripId,
            cityId: tripStops.cityId,
            cityName: cities.name,
            country: cities.country,
            region: cities.region,
            costIndex: cities.costIndex,
            popularity: cities.popularity,
            startDate: tripStops.startDate,
            endDate: tripStops.endDate,
            sequenceOrder: tripStops.sequenceOrder,
            createdAt: tripStops.createdAt,
            updatedAt: tripStops.updatedAt,
        })
        .from(tripStops)
        .leftJoin(cities, eq(tripStops.cityId, cities.id))
        .where(eq(tripStops.tripId, tripId))
        .orderBy(asc(tripStops.sequenceOrder));

    // Fetch activities for all stops
    const stopIds = stopsList.map((s) => s.id);
    let activitiesList = [];
    if (stopIds.length > 0) {
        activitiesList = await db
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
            .where(inArray(tripStopActivities.tripStopId, stopIds))
            .orderBy(
                asc(tripStopActivities.activityDate),
                asc(tripStopActivities.sequenceOrder),
                asc(tripStopActivities.startTime),
            );
    }

    // Attach activities to corresponding stops
    const stopsWithActivities = stopsList.map((stop) => {
        const stopActivities = activitiesList.filter((a) => a.tripStopId === stop.id);
        return {
            ...stop,
            activities: stopActivities,
        };
    });

    // Fetch all cost items for trip
    const costItems = await db
        .select()
        .from(tripCostItems)
        .where(eq(tripCostItems.tripId, tripId))
        .orderBy(asc(tripCostItems.costDate), desc(tripCostItems.createdAt));

    return {
        ...trip,
        stops: stopsWithActivities,
        costItems,
    };
}

/**
 * Fetch hydrated public trip by share slug including public owner details
 * @param {string} slug
 */
export async function getPublicHydratedTripBySlug(slug) {
    const [trip] = await db
        .select({
            id: trips.id,
            ownerId: trips.ownerId,
            name: trips.name,
            description: trips.description,
            startDate: trips.startDate,
            endDate: trips.endDate,
            coverPhotoUrl: trips.coverPhotoUrl,
            budgetAmount: trips.budgetAmount,
            budgetCurrency: trips.budgetCurrency,
            status: trips.status,
            visibility: trips.visibility,
            publicSlug: trips.publicSlug,
            createdAt: trips.createdAt,
            updatedAt: trips.updatedAt,
            owner: {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                profileImage: users.profileImage,
            },
        })
        .from(trips)
        .leftJoin(users, eq(trips.ownerId, users.id))
        .where(and(eq(trips.publicSlug, slug), eq(trips.visibility, 'public')));

    if (!trip) return null;

    // Fetch stops joined with cities
    const stopsList = await db
        .select({
            id: tripStops.id,
            tripId: tripStops.tripId,
            cityId: tripStops.cityId,
            cityName: cities.name,
            country: cities.country,
            region: cities.region,
            costIndex: cities.costIndex,
            popularity: cities.popularity,
            startDate: tripStops.startDate,
            endDate: tripStops.endDate,
            sequenceOrder: tripStops.sequenceOrder,
            createdAt: tripStops.createdAt,
            updatedAt: tripStops.updatedAt,
        })
        .from(tripStops)
        .leftJoin(cities, eq(tripStops.cityId, cities.id))
        .where(eq(tripStops.tripId, trip.id))
        .orderBy(asc(tripStops.sequenceOrder));

    const stopIds = stopsList.map((s) => s.id);
    let activitiesList = [];
    if (stopIds.length > 0) {
        activitiesList = await db
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
            })
            .from(tripStopActivities)
            .leftJoin(activities, eq(tripStopActivities.activityId, activities.id))
            .where(inArray(tripStopActivities.tripStopId, stopIds))
            .orderBy(
                asc(tripStopActivities.activityDate),
                asc(tripStopActivities.sequenceOrder),
                asc(tripStopActivities.startTime),
            );
    }

    const stopsWithActivities = stopsList.map((stop) => {
        const stopActivities = activitiesList.filter((a) => a.tripStopId === stop.id);
        return {
            ...stop,
            activities: stopActivities,
        };
    });

    const costItems = await db
        .select()
        .from(tripCostItems)
        .where(eq(tripCostItems.tripId, trip.id))
        .orderBy(asc(tripCostItems.costDate), desc(tripCostItems.createdAt));

    return {
        ...trip,
        stops: stopsWithActivities,
        costItems,
    };
}

/**
 * Atomically duplicate a trip, its stops, activities, and cost items under a new owner
 * @param {string} sourceTripId
 * @param {string} targetOwnerId
 * @param {string} [customTitle]
 */
export async function cloneTripTransaction(sourceTripId, targetOwnerId, customTitle) {
    return await db.transaction(async (tx) => {
        // 1. Fetch source trip
        const [sourceTrip] = await tx.select().from(trips).where(eq(trips.id, sourceTripId));

        if (!sourceTrip) {
            throw new Error('Source trip not found.');
        }

        const newName = customTitle || `Copy of ${sourceTrip.name}`;
        const newSlug = generatePublicSlug(newName);

        // 2. Insert new cloned trip master
        const [clonedTrip] = await tx
            .insert(trips)
            .values({
                ownerId: targetOwnerId,
                name: newName,
                description: sourceTrip.description,
                startDate: sourceTrip.startDate,
                endDate: sourceTrip.endDate,
                coverPhotoUrl: sourceTrip.coverPhotoUrl,
                budgetAmount: sourceTrip.budgetAmount,
                budgetCurrency: sourceTrip.budgetCurrency,
                status: 'draft',
                visibility: 'private',
                publicSlug: newSlug,
            })
            .returning();

        // 3. Fetch source stops
        const sourceStops = await tx
            .select()
            .from(tripStops)
            .where(eq(tripStops.tripId, sourceTripId))
            .orderBy(asc(tripStops.sequenceOrder));

        const stopIdMap = new Map(); // oldStopId -> newStopId
        const newStops = [];

        for (const stop of sourceStops) {
            const [clonedStop] = await tx
                .insert(tripStops)
                .values({
                    tripId: clonedTrip.id,
                    cityId: stop.cityId,
                    startDate: stop.startDate,
                    endDate: stop.endDate,
                    sequenceOrder: stop.sequenceOrder,
                })
                .returning();

            stopIdMap.set(stop.id, clonedStop.id);
            newStops.push(clonedStop);
        }

        // 4. Fetch source stop activities
        const activityIdMap = new Map(); // oldStopActivityId -> newStopActivityId
        const newActivities = [];

        if (sourceStops.length > 0) {
            const sourceStopIds = sourceStops.map((s) => s.id);
            const sourceActivities = await tx
                .select()
                .from(tripStopActivities)
                .where(inArray(tripStopActivities.tripStopId, sourceStopIds))
                .orderBy(asc(tripStopActivities.sequenceOrder));

            for (const act of sourceActivities) {
                const newStopId = stopIdMap.get(act.tripStopId);
                if (newStopId) {
                    const [clonedActivity] = await tx
                        .insert(tripStopActivities)
                        .values({
                            tripStopId: newStopId,
                            activityId: act.activityId,
                            activityDate: act.activityDate,
                            startTime: act.startTime,
                            endTime: act.endTime,
                            sequenceOrder: act.sequenceOrder,
                            notes: act.notes,
                        })
                        .returning();

                    activityIdMap.set(act.id, clonedActivity.id);
                    newActivities.push(clonedActivity);
                }
            }
        }

        // 5. Fetch source cost items
        const sourceCosts = await tx
            .select()
            .from(tripCostItems)
            .where(eq(tripCostItems.tripId, sourceTripId));

        const newCosts = [];
        for (const cost of sourceCosts) {
            const mappedStopId = cost.tripStopId ? stopIdMap.get(cost.tripStopId) || null : null;
            const mappedActivityId = cost.tripStopActivityId
                ? activityIdMap.get(cost.tripStopActivityId) || null
                : null;

            const [clonedCost] = await tx
                .insert(tripCostItems)
                .values({
                    tripId: clonedTrip.id,
                    tripStopId: mappedStopId,
                    tripStopActivityId: mappedActivityId,
                    category: cost.category,
                    description: cost.description,
                    amount: cost.amount,
                    currency: cost.currency,
                    costDate: cost.costDate,
                })
                .returning();

            newCosts.push(clonedCost);
        }

        return {
            ...clonedTrip,
            stops: newStops,
            activities: newActivities,
            costItems: newCosts,
        };
    });
}
