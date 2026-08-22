import axios from 'axios';

const tripApiInstance = axios.create({
    baseURL: '/api/trips',
    withCredentials: true,
});

/**
 * ---------------------------------------------------------
 * BUDGET & COST MANAGEMENT
 * ---------------------------------------------------------
 */

/**
 * Get comprehensive budget summary including category rollup, daily spend, and over-budget status
 * @param {string} tripId
 */
export async function getBudgetSummary(tripId) {
    const response = await tripApiInstance.get(`/${tripId}/budget`);
    return response.data;
}

/**
 * List cost items recorded for a trip
 * @param {string} tripId
 * @param {Object} [params] - { category, tripStopId, costDate }
 */
export async function listCosts(tripId, params = {}) {
    const response = await tripApiInstance.get(`/${tripId}/costs`, { params });
    return response.data;
}

/**
 * Log a new expense/cost item
 * @param {string} tripId
 * @param {Object} costData - { category, amount, currency, costDate, description, tripStopId, tripStopActivityId }
 */
export async function createCost(tripId, costData) {
    const response = await tripApiInstance.post(`/${tripId}/costs`, costData);
    return response.data;
}

/**
 * Update an existing expense item
 * @param {string} tripId
 * @param {string} costId
 * @param {Object} updates
 */
export async function updateCost(tripId, costId, updates) {
    const response = await tripApiInstance.patch(`/${tripId}/costs/${costId}`, updates);
    return response.data;
}

/**
 * Delete an expense item
 * @param {string} tripId
 * @param {string} costId
 */
export async function deleteCost(tripId, costId) {
    const response = await tripApiInstance.delete(`/${tripId}/costs/${costId}`);
    return response.data;
}
