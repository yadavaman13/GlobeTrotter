import { db } from '../config/database.config.js';
import { activities } from '../db/schema/activities.schema.js';
import { activityImages } from '../db/schema/activity_images.schema.js';
import { cities } from '../db/schema/cities.schema.js';
import { eq, and, gte, lte, inArray, ilike, desc, asc, sql } from 'drizzle-orm';

/**
 * Creates a new activity.
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
