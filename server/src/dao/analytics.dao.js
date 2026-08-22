import { db } from '../config/database.config.js';
import {
    users,
    trips,
    tripStops,
    tripStopActivities,
    cities,
    activities,
    tripCostItems,
    savedDestinations,
    tripShares,
} from '../db/schema/schema.js';
import { eq, and, sql, count, desc, gte } from 'drizzle-orm';

/**
 * Compute platform analytics on-the-fly across all core entities
 */
export async function getPlatformAnalytics() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // 1. User Metrics
    const [{ totalUsers }] = await db
        .select({ totalUsers: count() })
        .from(users);

    const [{ activeUsers }] = await db
        .select({ activeUsers: count() })
        .from(users)
        .where(and(eq(users.isActive, true), eq(users.isDeleted, false)));

    const [{ deletedUsers }] = await db
        .select({ deletedUsers: count() })
        .from(users)
        .where(eq(users.isDeleted, true));

    const [{ newUsersThisMonth }] = await db
        .select({ newUsersThisMonth: count() })
        .from(users)
        .where(gte(users.createdAt, thirtyDaysAgo));

    const usersByRole = await db
        .select({
            role: users.role,
            count: count(),
        })
        .from(users)
        .groupBy(users.role);

    // 2. Trip Metrics
    const [{ totalTrips }] = await db
        .select({ totalTrips: count() })
        .from(trips);

    const tripsByStatus = await db
        .select({
            status: trips.status,
            count: count(),
        })
        .from(trips)
        .groupBy(trips.status);

    const tripsByVisibility = await db
        .select({
            visibility: trips.visibility,
            count: count(),
        })
        .from(trips)
        .groupBy(trips.visibility);

    const [{ avgDurationDays }] = await db
        .select({
            avgDurationDays: sql`COALESCE(ROUND(AVG((${trips.endDate}::date - ${trips.startDate}::date) + 1), 1), 0)`,
        })
        .from(trips);

    const [{ totalBudgetAmount, avgBudgetAmount }] = await db
        .select({
            totalBudgetAmount: sql`COALESCE(SUM(${trips.budgetAmount}), 0)`,
            avgBudgetAmount: sql`COALESCE(ROUND(AVG(${trips.budgetAmount}), 2), 0)`,
        })
        .from(trips);

    // 3. Stop & Activity Metrics
    const [{ totalStops }] = await db
        .select({ totalStops: count() })
        .from(tripStops);

    const [{ totalScheduledActivities }] = await db
        .select({ totalScheduledActivities: count() })
        .from(tripStopActivities);

    // 4. Catalog Metrics
    const [{ totalCatalogCities }] = await db
        .select({ totalCatalogCities: count() })
        .from(cities);

    const [{ totalCatalogActivities }] = await db
        .select({ totalCatalogActivities: count() })
        .from(activities);

    const popularCities = await db
        .select({
            id: cities.id,
            name: cities.name,
            country: cities.country,
            region: cities.region,
            popularity: cities.popularity,
            costIndex: cities.costIndex,
            visitCount: count(tripStops.id),
        })
        .from(cities)
        .leftJoin(tripStops, eq(tripStops.cityId, cities.id))
        .groupBy(cities.id, cities.name, cities.country, cities.region, cities.popularity, cities.costIndex)
        .orderBy(desc(count(tripStops.id)), desc(cities.popularity))
        .limit(10);

    const popularActivities = await db
        .select({
            id: activities.id,
            name: activities.name,
            activityType: activities.activityType,
            cost: activities.cost,
            currency: activities.currency,
            cityName: cities.name,
            country: cities.country,
            scheduleCount: count(tripStopActivities.id),
        })
        .from(activities)
        .leftJoin(tripStopActivities, eq(tripStopActivities.activityId, activities.id))
        .leftJoin(cities, eq(activities.cityId, cities.id))
        .groupBy(activities.id, activities.name, activities.activityType, activities.cost, activities.currency, cities.name, cities.country)
        .orderBy(desc(count(tripStopActivities.id)))
        .limit(10);

    const activitiesByType = await db
        .select({
            activityType: activities.activityType,
            count: count(),
        })
        .from(activities)
        .groupBy(activities.activityType)
        .orderBy(desc(count()));

    // 5. Cost & Budget Ledger Metrics
    const [{ totalExpenses }] = await db
        .select({
            totalExpenses: sql`COALESCE(SUM(${tripCostItems.amount}), 0)`,
        })
        .from(tripCostItems);

    const expensesByCategory = await db
        .select({
            category: tripCostItems.category,
            totalAmount: sql`COALESCE(SUM(${tripCostItems.amount}), 0)`,
            itemCount: count(),
        })
        .from(tripCostItems)
        .groupBy(tripCostItems.category)
        .orderBy(desc(sql`SUM(${tripCostItems.amount})`));

    // 6. Social & Bookmarks
    const [{ totalSavedDestinations }] = await db
        .select({ totalSavedDestinations: count() })
        .from(savedDestinations);

    const [{ totalTripShares }] = await db
        .select({ totalTripShares: count() })
        .from(tripShares);

    return {
        users: {
            total: Number(totalUsers),
            active: Number(activeUsers),
            deleted: Number(deletedUsers),
            newThisMonth: Number(newUsersThisMonth),
            byRole: usersByRole.reduce((acc, curr) => {
                acc[curr.role] = Number(curr.count);
                return acc;
            }, {}),
        },
        trips: {
            total: Number(totalTrips),
            byStatus: tripsByStatus.reduce((acc, curr) => {
                acc[curr.status] = Number(curr.count);
                return acc;
            }, {}),
            byVisibility: tripsByVisibility.reduce((acc, curr) => {
                acc[curr.visibility] = Number(curr.count);
                return acc;
            }, {}),
            averageDurationDays: parseFloat(avgDurationDays) || 0,
            totalBudgetAmount: parseFloat(totalBudgetAmount) || 0,
            averageBudgetAmount: parseFloat(avgBudgetAmount) || 0,
            totalStops: Number(totalStops),
            totalScheduledActivities: Number(totalScheduledActivities),
            totalShares: Number(totalTripShares),
        },
        catalog: {
            totalCities: Number(totalCatalogCities),
            totalActivities: Number(totalCatalogActivities),
            popularCities: popularCities.map((c) => ({
                id: c.id,
                name: c.name,
                country: c.country,
                region: c.region,
                popularity: c.popularity,
                costIndex: c.costIndex,
                visitCount: Number(c.visitCount),
            })),
            popularActivities: popularActivities.map((a) => ({
                id: a.id,
                name: a.name,
                activityType: a.activityType,
                cost: a.cost,
                currency: a.currency,
                cityName: a.cityName,
                country: a.country,
                scheduleCount: Number(a.scheduleCount),
            })),
            activitiesByType: activitiesByType.map((t) => ({
                type: t.activityType || 'Uncategorized',
                count: Number(t.count),
            })),
        },
        financials: {
            totalExpensesRecorded: parseFloat(totalExpenses) || 0,
            expensesByCategory: expensesByCategory.map((e) => ({
                category: e.category,
                totalAmount: parseFloat(e.totalAmount) || 0,
                itemCount: Number(e.itemCount),
            })),
            totalSavedDestinations: Number(totalSavedDestinations),
        },
    };
}
