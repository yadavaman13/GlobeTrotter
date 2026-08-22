import { db } from '../config/database.config.js';
import { tripStops } from '../db/schema/trip_stops.schema.js';
import { cities } from '../db/schema/cities.schema.js';
import { eq, and, asc, sql } from 'drizzle-orm';

/**
 * Get highest sequence order for stops within a trip
 * @param {string} tripId
 */
export async function getMaxStopSequenceOrder(tripId) {
    const [result] = await db
        .select({ maxOrder: sql`COALESCE(MAX(${tripStops.sequenceOrder}), 0)` })
        .from(tripStops)
        .where(eq(tripStops.tripId, tripId));
    return parseInt(result?.maxOrder || '0', 10);
}

/**
 * Create a new destination stop
 * @param {object} stopData
 */
export async function createStop(stopData) {
    let sequenceOrder = stopData.sequenceOrder;
    if (!sequenceOrder || sequenceOrder <= 0) {
        const maxOrder = await getMaxStopSequenceOrder(stopData.tripId);
        sequenceOrder = maxOrder + 1;
    }

    const [stop] = await db
        .insert(tripStops)
        .values({
            ...stopData,
            sequenceOrder,
        })
        .returning();
    return stop;
}

/**
 * Fetch all stops for a trip ordered by sequenceOrder
 * @param {string} tripId
 */
export async function getStopsByTripId(tripId) {
    return db
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
}

/**
 * Fetch a single stop by ID with joined city info
 * @param {string} id
 */
export async function getStopById(id) {
    const [stop] = await db
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
        .where(eq(tripStops.id, id));
    return stop || null;
}

/**
 * Update stop details
 * @param {string} id
 * @param {string} tripId
 * @param {object} updates
 */
export async function updateStop(id, tripId, updates) {
    const [updated] = await db
        .update(tripStops)
        .set({
            ...updates,
            updatedAt: new Date(),
        })
        .where(and(eq(tripStops.id, id), eq(tripStops.tripId, tripId)))
        .returning();
    return updated || null;
}

/**
 * Delete a stop
 * @param {string} id
 * @param {string} tripId
 */
export async function deleteStop(id, tripId) {
    const [deleted] = await db
        .delete(tripStops)
        .where(and(eq(tripStops.id, id), eq(tripStops.tripId, tripId)))
        .returning();
    return deleted || null;
}

/**
 * Batch reorder stops in a transaction
 * @param {string} tripId
 * @param {Array<{ id: string, sequenceOrder: number }>} stopOrders
 */
export async function reorderStops(tripId, stopOrders) {
    return db.transaction(async (tx) => {
        // Step 1: Temporarily offset sequence orders to prevent unique constraint conflict
        for (let i = 0; i < stopOrders.length; i++) {
            const item = stopOrders[i];
            await tx
                .update(tripStops)
                .set({ sequenceOrder: 10000 + i + 1, updatedAt: new Date() })
                .where(and(eq(tripStops.id, item.id), eq(tripStops.tripId, tripId)));
        }

        // Step 2: Set final sequence orders
        const results = [];
        for (const item of stopOrders) {
            const [updated] = await tx
                .update(tripStops)
                .set({ sequenceOrder: item.sequenceOrder, updatedAt: new Date() })
                .where(and(eq(tripStops.id, item.id), eq(tripStops.tripId, tripId)))
                .returning();
            if (updated) results.push(updated);
        }
        return results;
    });
}
