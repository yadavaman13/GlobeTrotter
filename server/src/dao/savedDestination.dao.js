import { db } from '../config/database.config.js';
import { savedDestinations } from '../db/schema/saved_destinations.schema.js';
import { cities } from '../db/schema/cities.schema.js';
import { eq, and, desc, asc, sql, ilike, or } from 'drizzle-orm';

/**
 * Save / Bookmark a city for a user
 * @param {string} userId
 * @param {string} cityId
 */
export async function saveDestination(userId, cityId) {
    const [saved] = await db
        .insert(savedDestinations)
        .values({
            userId,
            cityId,
        })
        .onConflictDoNothing()
        .returning();

    if (saved) return saved;

    // If already exists, return current record
    const [existing] = await db
        .select()
        .from(savedDestinations)
        .where(and(eq(savedDestinations.userId, userId), eq(savedDestinations.cityId, cityId)));
    return existing || null;
}

/**
 * Remove a saved destination
 * @param {string} userId
 * @param {string} cityId
 */
export async function removeSavedDestination(userId, cityId) {
    const [deleted] = await db
        .delete(savedDestinations)
        .where(and(eq(savedDestinations.userId, userId), eq(savedDestinations.cityId, cityId)))
        .returning();
    return deleted || null;
}

/**
 * Check if a city is saved by a user
 * @param {string} userId
 * @param {string} cityId
 */
export async function isDestinationSaved(userId, cityId) {
    if (!userId || !cityId) return false;
    const [found] = await db
        .select({ cityId: savedDestinations.cityId })
        .from(savedDestinations)
        .where(and(eq(savedDestinations.userId, userId), eq(savedDestinations.cityId, cityId)))
        .limit(1);
    return !!found;
}

/**
 * List all saved destinations for a user with joined city details and pagination
 * @param {string} userId
 * @param {object} options
 */
export async function listSavedDestinations(
    userId,
    { search, country, region, page = 1, limit = 20, sortBy = 'createdAt', order = 'desc' } = {},
) {
    const conditions = [eq(savedDestinations.userId, userId)];

    if (country) {
        conditions.push(ilike(cities.country, `%${country}%`));
    }
    if (region) {
        conditions.push(ilike(cities.region, `%${region}%`));
    }
    if (search) {
        conditions.push(
            or(ilike(cities.name, `%${search}%`), ilike(cities.country, `%${search}%`)),
        );
    }

    const whereClause = and(...conditions);
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

    // Count
    const [countResult] = await db
        .select({ count: sql`count(*)` })
        .from(savedDestinations)
        .leftJoin(cities, eq(savedDestinations.cityId, cities.id))
        .where(whereClause);
    const total = parseInt(countResult?.count || '0', 10);

    const sortField =
        sortBy === 'name'
            ? cities.name
            : sortBy === 'country'
              ? cities.country
              : savedDestinations.createdAt;
    const sortOrder = order === 'asc' ? asc(sortField) : desc(sortField);

    const data = await db
        .select({
            userId: savedDestinations.userId,
            cityId: savedDestinations.cityId,
            savedAt: savedDestinations.createdAt,
            city: {
                id: cities.id,
                name: cities.name,
                country: cities.country,
                region: cities.region,
                costIndex: cities.costIndex,
                popularity: cities.popularity,
                createdAt: cities.createdAt,
                updatedAt: cities.updatedAt,
            },
        })
        .from(savedDestinations)
        .innerJoin(cities, eq(savedDestinations.cityId, cities.id))
        .where(whereClause)
        .orderBy(sortOrder)
        .limit(parseInt(limit, 10))
        .offset(offset);

    return {
        destinations: data,
        pagination: {
            total,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
        },
    };
}
