import { db } from '../config/database.config.js';
import { trips } from '../db/schema/trips.schema.js';
import { tripStops } from '../db/schema/trip_stops.schema.js';
import { tripStopActivities } from '../db/schema/trip_stop_activities.schema.js';
import { tripCostItems } from '../db/schema/trip_cost_items.schema.js';
import { cities } from '../db/schema/cities.schema.js';
import { activities } from '../db/schema/activities.schema.js';
import { savedDestinations } from '../db/schema/saved_destinations.schema.js';
import { eq, and, gte, desc, asc, sql } from 'drizzle-orm';

/**
 * Aggregates all dashboard data for a given user.
 * @param {string} userId - User UUID
 * @returns {Promise<object>} Dashboard metrics
 */
export async function getDashboardData(userId) {
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Upcoming trips (startDate >= today)
    const upcomingTripsPromise = db
        .select()
        .from(trips)
        .where(and(eq(trips.ownerId, userId), gte(trips.startDate, todayStr)))
        .orderBy(asc(trips.startDate))
        .limit(5);

    // 2. Recent trips (ordered by updatedAt desc)
    const recentTripsPromise = db
        .select()
        .from(trips)
        .where(eq(trips.ownerId, userId))
        .orderBy(desc(trips.updatedAt))
        .limit(5);

    // 3. Popular cities (based on tripStops counts, falling back to city popularity index)
    const popularCitiesPromise = db
        .select({
            id: cities.id,
            name: cities.name,
            country: cities.country,
            region: cities.region,
            costIndex: cities.costIndex,
            popularity: cities.popularity,
            stopCount: sql`count(${tripStops.id})::int`,
        })
        .from(cities)
        .leftJoin(tripStops, eq(cities.id, tripStops.cityId))
        .groupBy(cities.id)
        .orderBy(desc(sql`count(${tripStops.id})`), desc(cities.popularity))
        .limit(5);

    // 4. Recommended activities (based on scheduled activity counts in plans)
    const recommendedActivitiesPromise = db
        .select({
            id: activities.id,
            cityId: activities.cityId,
            name: activities.name,
            description: activities.description,
            activityType: activities.activityType,
            cost: activities.cost,
            durationMinutes: activities.durationMinutes,
            currency: activities.currency,
            cityName: cities.name,
            countryName: cities.country,
            bookingCount: sql`count(${tripStopActivities.id})::int`,
        })
        .from(activities)
        .leftJoin(tripStopActivities, eq(activities.id, tripStopActivities.activityId))
        .leftJoin(cities, eq(activities.cityId, cities.id))
        .groupBy(activities.id, cities.id)
        .orderBy(desc(sql`count(${tripStopActivities.id})`), desc(activities.createdAt))
        .limit(5);

    // 5. Saved destinations for the user
    const savedDestinationsPromise = db
        .select({
            id: cities.id,
            name: cities.name,
            country: cities.country,
            region: cities.region,
            costIndex: cities.costIndex,
            popularity: cities.popularity,
            savedAt: savedDestinations.createdAt,
        })
        .from(savedDestinations)
        .innerJoin(cities, eq(savedDestinations.cityId, cities.id))
        .where(eq(savedDestinations.userId, userId))
        .orderBy(desc(savedDestinations.createdAt))
        .limit(5);

    // 6. Budget Highlights - Sum of budget amount across all user's trips
    const budgetSumPromise = db
        .select({
            totalBudget: sql`coalesce(sum(${trips.budgetAmount}), 0)::numeric`,
        })
        .from(trips)
        .where(eq(trips.ownerId, userId));

    // 7. Expense Category Breakdown for all user's trips
    const expenseBreakdownPromise = db
        .select({
            category: tripCostItems.category,
            totalAmount: sql`coalesce(sum(${tripCostItems.amount}), 0)::numeric`,
        })
        .from(tripCostItems)
        .innerJoin(trips, eq(tripCostItems.tripId, trips.id))
        .where(eq(trips.ownerId, userId))
        .groupBy(tripCostItems.category);

    // Execute all queries in parallel
    const [
        upcomingTrips,
        recentTrips,
        popularCities,
        recommendedActivities,
        savedDestinationsList,
        budgetResult,
        expenseCategoryRows,
    ] = await Promise.all([
        upcomingTripsPromise,
        recentTripsPromise,
        popularCitiesPromise,
        recommendedActivitiesPromise,
        savedDestinationsPromise,
        budgetSumPromise,
        expenseBreakdownPromise,
    ]);

    // Format budget highlights
    const totalExpenses = expenseCategoryRows.reduce(
        (acc, row) => acc + parseFloat(row.totalAmount),
        0,
    );
    const categoryBreakdown = {
        transport: 0,
        stay: 0,
        activity: 0,
        meal: 0,
    };
    expenseCategoryRows.forEach((row) => {
        categoryBreakdown[row.category] = parseFloat(row.totalAmount);
    });

    const budgetHighlights = {
        totalBudget: parseFloat(budgetResult[0]?.totalBudget || 0),
        totalExpenses,
        currency: 'INR',
        categoryBreakdown,
    };

    return {
        upcomingTrips,
        recentTrips,
        popularCities,
        recommendedActivities,
        savedDestinations: savedDestinationsList,
        budgetHighlights,
    };
}
