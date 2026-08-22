import { db } from '../config/database.config.js';
import { cities } from '../db/schema/cities.schema.js';
import { eq, and, ilike, sql } from 'drizzle-orm';

/**
 * Find city by primary key
 * @param {string} id
 */
export async function getCityById(id) {
    const [city] = await db.select().from(cities).where(eq(cities.id, id));
    return city || null;
}

/**
 * Find city by exact name and country (case-insensitive)
 * @param {string} name
 * @param {string} country
 */
export async function findCityByNameAndCountry(name, country) {
    const [city] = await db
        .select()
        .from(cities)
        .where(and(ilike(cities.name, name.trim()), ilike(cities.country, country.trim())));
    return city || null;
}

/**
 * Create a new city in the catalog
 * @param {object} cityData
 */
export async function createCity(cityData) {
    const [city] = await db.insert(cities).values(cityData).returning();
    return city;
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
