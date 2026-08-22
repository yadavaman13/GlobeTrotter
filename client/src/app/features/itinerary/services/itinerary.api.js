import axios from 'axios';

const tripApiInstance = axios.create({
    baseURL: '/api/trips',
    withCredentials: true,
});

/**
 * ---------------------------------------------------------
 * STOPS MANAGEMENT
 * ---------------------------------------------------------
 */

/**
 * Create a new stop in a trip
 * @param {string} tripId
 * @param {Object} stopData - { cityId, startDate, endDate, sequenceOrder }
 */
export async function createStop(tripId, stopData) {
    const response = await tripApiInstance.post(`/${tripId}/stops`, stopData);
    return response.data;
}

/**
 * List all stops in a trip
 * @param {string} tripId
 */
export async function listStops(tripId) {
    const response = await tripApiInstance.get(`/${tripId}/stops`);
    return response.data;
}

/**
 * Get details for a single stop
 * @param {string} tripId
 * @param {string} stopId
 */
export async function getStop(tripId, stopId) {
    const response = await tripApiInstance.get(`/${tripId}/stops/${stopId}`);
    return response.data;
}

/**
 * Update stop dates or details
 * @param {string} tripId
 * @param {string} stopId
 * @param {Object} updates
 */
export async function updateStop(tripId, stopId, updates) {
    const response = await tripApiInstance.patch(`/${tripId}/stops/${stopId}`, updates);
    return response.data;
}

/**
 * Delete a stop from a trip
 * @param {string} tripId
 * @param {string} stopId
 */
export async function deleteStop(tripId, stopId) {
    const response = await tripApiInstance.delete(`/${tripId}/stops/${stopId}`);
    return response.data;
}

/**
 * Reorder stops sequence
 * @param {string} tripId
 * @param {Array<{ id: string, sequenceOrder: number }>} stopOrders
 */
export async function reorderStops(tripId, stopOrders) {
    const response = await tripApiInstance.patch(`/${tripId}/stops/reorder`, { stopOrders });
    return response.data;
}

/**
 * ---------------------------------------------------------
 * STOP ACTIVITIES MANAGEMENT
 * ---------------------------------------------------------
 */

/**
 * Link or create an activity for a stop
 * @param {string} tripId
 * @param {string} stopId
 * @param {Object} activityData - { activityId, activityDate, startTime, endTime, sequenceOrder, notes }
 */
export async function createActivity(tripId, stopId, activityData) {
    const response = await tripApiInstance.post(
        `/${tripId}/stops/${stopId}/activities`,
        activityData,
    );
    return response.data;
}

/**
 * List activities for a stop
 * @param {string} tripId
 * @param {string} stopId
 */
export async function listActivities(tripId, stopId) {
    const response = await tripApiInstance.get(`/${tripId}/stops/${stopId}/activities`);
    return response.data;
}

/**
 * Update an activity linked to a stop
 * @param {string} tripId
 * @param {string} stopId
 * @param {string} activityId
 * @param {Object} updates
 */
export async function updateActivity(tripId, stopId, activityId, updates) {
    const response = await tripApiInstance.patch(
        `/${tripId}/stops/${stopId}/activities/${activityId}`,
        updates,
    );
    return response.data;
}

/**
 * Delete an activity from a stop
 * @param {string} tripId
 * @param {string} stopId
 * @param {string} activityId
 */
export async function deleteActivity(tripId, stopId, activityId) {
    const response = await tripApiInstance.delete(
        `/${tripId}/stops/${stopId}/activities/${activityId}`,
    );
    return response.data;
}

/**
 * Reorder activities sequence inside a stop
 * @param {string} tripId
 * @param {string} stopId
 * @param {Array<{ id: string, sequenceOrder: number }>} activityOrders
 */
export async function reorderActivities(tripId, stopId, activityOrders) {
    const response = await tripApiInstance.patch(`/${tripId}/stops/${stopId}/activities/reorder`, {
        activityOrders,
    });
    return response.data;
}

/**
 * ---------------------------------------------------------
 * TIMELINE SYNTHESIS
 * ---------------------------------------------------------
 */

/**
 * Get synthesized day-by-day chronological timeline
 * @param {string} tripId
 */
export async function getTripTimeline(tripId) {
    const response = await tripApiInstance.get(`/${tripId}/timeline`);
    return response.data;
}
