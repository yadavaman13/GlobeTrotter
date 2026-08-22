import { db } from '../config/database.config.js';
import { cities } from '../db/schema/cities.schema.js';
import { eq, and, sql, ilike, gte, lte, desc, asc } from 'drizzle-orm';

/**
 * Inserts a new city record.
 * @param {object} cityData - { name, country, region, costIndex, popularity }
 * @returns {Promise<object>} New city record
 */
export async function createCity(cityData) {
    const [newCity] = await db.insert(cities).values(cityData).returning();
    return newCity;
}

/**
 * Fetches a city by its UUID.
 * @param {string} id - City ID (UUID)
 * @returns {Promise<object|null>} The city record or null if not found
 */
export async function getCityById(id) {
    const [city] = await db.select().from(cities).where(eq(cities.id, id));
    return city || null;
}

/**
 * Find city by exact name and country (case-insensitive)
 * @param {string} name
 * @param {string} country
 * @returns {Promise<object|null>}
 */
export async function findCityByNameAndCountry(name, country) {
    const [city] = await db
        .select()
        .from(cities)
        .where(and(ilike(cities.name, name.trim()), ilike(cities.country, country.trim())));
    return city || null;
}

/**
 * Search cities with optional filters
 * @param {object} params
 */
export async function searchCities({ query, country, region, limit = 20, offset = 0 } = {}) {
    const conditions = [];

    if (query) {
        conditions.push(
            sql`(${cities.name} ILIKE ${`%${query}%`} OR ${cities.country} ILIKE ${`%${query}%`})`,
        );
    }

    if (country) {
        conditions.push(ilike(cities.country, `%${country}%`));
    }

    if (region) {
        conditions.push(ilike(cities.region, `%${region}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    return db.select().from(cities).where(whereClause).limit(limit).offset(offset);
}

/**
 * Lists cities with pagination, sorting, search, and numeric filters.
 * @param {object} options
 * @returns {Promise<{ cities: Array, total: number }>} List of city records and total count matching filters
 */
export async function listCities({
    q,
    country,
    region,
    minCostIndex,
    maxCostIndex,
    minPopularity,
    maxPopularity,
    page = 1,
    limit = 10,
    sortBy = 'popularity',
    sortOrder = 'desc',
}) {
    const filters = [];

    if (q) {
        filters.push(
            sql`(${ilike(cities.name, `%${q}%`)} OR ${ilike(cities.country, `%${q}%`)} OR ${ilike(cities.region, `%${q}%`)})`,
        );
    }
    if (country) {
        filters.push(ilike(cities.country, `%${country}%`));
    }
    if (region) {
        filters.push(ilike(cities.region, `%${region}%`));
    }
    if (minCostIndex !== undefined && minCostIndex !== null) {
        filters.push(gte(cities.costIndex, minCostIndex.toString()));
    }
    if (maxCostIndex !== undefined && maxCostIndex !== null) {
        filters.push(lte(cities.costIndex, maxCostIndex.toString()));
    }
    if (minPopularity !== undefined && minPopularity !== null) {
        filters.push(gte(cities.popularity, minPopularity.toString()));
    }
    if (maxPopularity !== undefined && maxPopularity !== null) {
        filters.push(lte(cities.popularity, maxPopularity.toString()));
    }

    const offset = (page - 1) * limit;
    const orderColumn = cities[sortBy] || cities.popularity;
    const sorting = sortOrder.toLowerCase() === 'asc' ? asc(orderColumn) : desc(orderColumn);

    const items = await db
        .select()
        .from(cities)
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(sorting)
        .limit(limit)
        .offset(offset);

    const [countResult] = await db
        .select({ count: sql`count(*)` })
        .from(cities)
        .where(filters.length > 0 ? and(...filters) : undefined);

    return {
        cities: items,
        total: parseInt(countResult?.count || '0', 10),
    };
}
