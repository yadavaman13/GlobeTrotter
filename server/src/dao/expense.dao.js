import { db } from '../config/database.config.js';
import { tripCostItems } from '../db/schema/trip_cost_items.schema.js';
import { trips } from '../db/schema/trips.schema.js';
import { eq, and, asc, desc, sql } from 'drizzle-orm';

/**
 * Log a new expense/cost entry
 * @param {object} costData
 */
export async function createTripCostItem(costData) {
    const [item] = await db.insert(tripCostItems).values(costData).returning();
    return item;
}

/**
 * List cost items for a trip with optional filters
 * @param {string} tripId
 * @param {object} filters
 */
export async function getTripCostItemsByTripId(tripId, { category, tripStopId, costDate } = {}) {
    const conditions = [eq(tripCostItems.tripId, tripId)];

    if (category) {
        conditions.push(eq(tripCostItems.category, category));
    }

    if (tripStopId) {
        conditions.push(eq(tripCostItems.tripStopId, tripStopId));
    }

    if (costDate) {
        conditions.push(eq(tripCostItems.costDate, costDate));
    }

    return db
        .select()
        .from(tripCostItems)
        .where(and(...conditions))
        .orderBy(asc(tripCostItems.costDate), desc(tripCostItems.createdAt));
}

/**
 * Get a single cost item by ID
 * @param {string} id
 * @param {string} tripId
 */
export async function getTripCostItemById(id, tripId) {
    const conditions = [eq(tripCostItems.id, id)];
    if (tripId) {
        conditions.push(eq(tripCostItems.tripId, tripId));
    }

    const [item] = await db
        .select()
        .from(tripCostItems)
        .where(and(...conditions));
    return item || null;
}

/**
 * Update a cost item
 * @param {string} id
 * @param {string} tripId
 * @param {object} updates
 */
export async function updateTripCostItem(id, tripId, updates) {
    const [updated] = await db
        .update(tripCostItems)
        .set({
            ...updates,
            updatedAt: new Date(),
        })
        .where(and(eq(tripCostItems.id, id), eq(tripCostItems.tripId, tripId)))
        .returning();
    return updated || null;
}

/**
 * Delete a cost item
 * @param {string} id
 * @param {string} tripId
 */
export async function deleteTripCostItem(id, tripId) {
    const [deleted] = await db
        .delete(tripCostItems)
        .where(and(eq(tripCostItems.id, id), eq(tripCostItems.tripId, tripId)))
        .returning();
    return deleted || null;
}

/**
 * Compute dynamic budget rollup and category distributions
 * @param {string} tripId
 */
export async function calculateTripBudgetSummary(tripId) {
    // 1. Fetch trip budget info
    const [trip] = await db
        .select({
            budgetAmount: trips.budgetAmount,
            budgetCurrency: trips.budgetCurrency,
            startDate: trips.startDate,
            endDate: trips.endDate,
        })
        .from(trips)
        .where(eq(trips.id, tripId));

    if (!trip) return null;

    const totalBudget = parseFloat(trip.budgetAmount || '0');
    const currency = trip.budgetCurrency || 'INR';

    // 2. Fetch all expenses
    const items = await db.select().from(tripCostItems).where(eq(tripCostItems.tripId, tripId));

    let totalEstimatedCost = 0;
    const categoryBreakdown = {
        transport: 0,
        stay: 0,
        activity: 0,
        meal: 0,
        other: 0,
    };

    const dailySpendMap = {};

    for (const item of items) {
        const amt = parseFloat(item.amount || '0');
        totalEstimatedCost += amt;

        const cat = item.category?.toLowerCase() || 'other';
        if (categoryBreakdown[cat] !== undefined) {
            categoryBreakdown[cat] += amt;
        } else {
            categoryBreakdown.other += amt;
        }

        const dateKey = item.costDate || 'Unscheduled';
        if (!dailySpendMap[dateKey]) {
            dailySpendMap[dateKey] = {
                date: dateKey,
                totalCost: 0,
                itemCount: 0,
            };
        }
        dailySpendMap[dateKey].totalCost += amt;
        dailySpendMap[dateKey].itemCount += 1;
    }

    // Format category breakdown with aliases for convenience
    const formattedCategories = {
        accommodation: parseFloat(categoryBreakdown.stay.toFixed(2)),
        transport: parseFloat(categoryBreakdown.transport.toFixed(2)),
        activities: parseFloat(categoryBreakdown.activity.toFixed(2)),
        food: parseFloat(categoryBreakdown.meal.toFixed(2)),
        other: parseFloat(categoryBreakdown.other.toFixed(2)),
    };

    // Calculate duration in days
    let tripDays = 1;
    if (trip.startDate && trip.endDate) {
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        const diffTime = Math.abs(end - start);
        tripDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
    }

    const averageCostPerDay = parseFloat((totalEstimatedCost / tripDays).toFixed(2));
    const dailyBudgetLimit = totalBudget > 0 ? parseFloat((totalBudget / tripDays).toFixed(2)) : 0;
    const remainingBudget = parseFloat((totalBudget - totalEstimatedCost).toFixed(2));
    const isOverBudget = totalBudget > 0 && totalEstimatedCost > totalBudget;

    // Identify over-budget days
    const dailySpend = Object.values(dailySpendMap).map((d) => ({
        ...d,
        totalCost: parseFloat(d.totalCost.toFixed(2)),
    }));

    const overBudgetDays = dailySpend
        .filter(
            (d) =>
                d.date !== 'Unscheduled' && dailyBudgetLimit > 0 && d.totalCost > dailyBudgetLimit,
        )
        .map((d) => ({
            date: d.date,
            totalCost: d.totalCost,
            excess: parseFloat((d.totalCost - dailyBudgetLimit).toFixed(2)),
            dailyBudgetLimit,
        }));

    return {
        totalBudget,
        totalEstimatedCost: parseFloat(totalEstimatedCost.toFixed(2)),
        remainingBudget,
        currency,
        isOverBudget,
        tripDays,
        averageCostPerDay,
        dailyBudgetLimit,
        categoryBreakdown: formattedCategories,
        dailySpend,
        overBudgetDays,
    };
}
