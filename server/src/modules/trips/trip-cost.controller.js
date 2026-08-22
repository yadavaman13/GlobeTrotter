import {
    createTripCostItem,
    getTripCostItemsByTripId,
    getTripCostItemById,
    updateTripCostItem,
    deleteTripCostItem,
    calculateTripBudgetSummary,
} from '../../dao/expense.dao.js';
import { getTripById } from '../../dao/trip.dao.js';
import { sendResponse } from '../../utils/response.utlis.js';

/**
 * Normalize category name from possible aliases
 * @param {string} category
 */
function normalizeCategory(category) {
    if (!category) return 'stay';
    const cat = category.toLowerCase();
    if (cat === 'accommodation' || cat === 'lodging') return 'stay';
    if (cat === 'food' || cat === 'dining') return 'meal';
    if (cat === 'activities' || cat === 'experience') return 'activity';
    if (cat === 'transit') return 'transport';
    return cat;
}

/**
 * POST /api/trips/:tripId/costs
 * Log a manual/incidental expense entry
 */
export async function createCost(req, res) {
    try {
        const tripId = req.params.tripId;
        const trip = req.trip || (await getTripById(tripId));

        if (!trip) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Trip not found.',
                success: false,
            });
        }

        const {
            category,
            amount,
            currency,
            description,
            costDate,
            expenseDate,
            tripStopId,
            tripStopActivityId,
        } = req.body;

        const normalizedCat = normalizeCategory(category);
        const expenseCurrency = currency || trip.budgetCurrency || 'INR';
        const dateVal = costDate || expenseDate || null;

        const item = await createTripCostItem({
            tripId,
            tripStopId: tripStopId || null,
            tripStopActivityId: tripStopActivityId || null,
            category: normalizedCat,
            description: description || null,
            amount: parseFloat(amount).toString(),
            currency: expenseCurrency,
            costDate: dateVal,
        });

        return sendResponse({
            res,
            statusCode: 201,
            message: 'Expense entry logged successfully.',
            success: true,
            cost: item,
        });
    } catch (error) {
        console.error('createCost error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to log expense.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * GET /api/trips/:tripId/costs
 * List recorded expense items for a trip
 */
export async function listCosts(req, res) {
    try {
        const tripId = req.params.tripId;
        const { category, tripStopId, costDate } = req.query;

        const items = await getTripCostItemsByTripId(tripId, {
            category: category ? normalizeCategory(category) : undefined,
            tripStopId,
            costDate,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Expenses fetched successfully.',
            success: true,
            costs: items,
        });
    } catch (error) {
        console.error('listCosts error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to fetch expenses.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * GET /api/trips/:tripId/budget
 * Calculate dynamic budget breakdown and category rollups
 */
export async function getBudgetSummary(req, res) {
    try {
        const tripId = req.params.tripId;
        const summary = await calculateTripBudgetSummary(tripId);

        if (!summary) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Trip not found.',
                success: false,
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Trip budget summary calculated successfully.',
            success: true,
            budget: summary,
        });
    } catch (error) {
        console.error('getBudgetSummary error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to calculate budget summary.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * PATCH /api/trips/:tripId/costs/:costId
 * Update an expense item
 */
export async function updateCost(req, res) {
    try {
        const { tripId, costId } = req.params;
        const currentItem = await getTripCostItemById(costId, tripId);

        if (!currentItem) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Expense entry not found in this trip.',
                success: false,
            });
        }

        const updates = {};
        if (req.body.category) updates.category = normalizeCategory(req.body.category);
        if (req.body.amount !== undefined) updates.amount = parseFloat(req.body.amount).toString();
        if (req.body.description !== undefined) updates.description = req.body.description;
        if (req.body.currency) updates.currency = req.body.currency;
        if (req.body.costDate !== undefined) updates.costDate = req.body.costDate || null;
        if (req.body.expenseDate !== undefined) updates.costDate = req.body.expenseDate || null;
        if (req.body.tripStopId !== undefined) updates.tripStopId = req.body.tripStopId || null;
        if (req.body.tripStopActivityId !== undefined)
            updates.tripStopActivityId = req.body.tripStopActivityId || null;

        const updated = await updateTripCostItem(costId, tripId, updates);

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Expense entry updated successfully.',
            success: true,
            cost: updated,
        });
    } catch (error) {
        console.error('updateCost error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to update expense entry.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * DELETE /api/trips/:tripId/costs/:costId
 * Delete an expense item
 */
export async function deleteCost(req, res) {
    try {
        const { tripId, costId } = req.params;
        const deleted = await deleteTripCostItem(costId, tripId);

        if (!deleted) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Expense entry not found in this trip.',
                success: false,
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Expense entry removed successfully.',
            success: true,
        });
    } catch (error) {
        console.error('deleteCost error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to delete expense entry.',
            success: false,
            error: error.message,
        });
    }
}
