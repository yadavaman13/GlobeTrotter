import { db } from '../config/database.config.js';
import { trips } from '../db/schema/trips.schema.js';
import { tripStops } from '../db/schema/trip_stops.schema.js';
import { tripStopActivities } from '../db/schema/trip_stop_activities.schema.js';
import { tripCostItems } from '../db/schema/trip_cost_items.schema.js';
import { cities } from '../db/schema/cities.schema.js';
import { activities } from '../db/schema/activities.schema.js';
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
