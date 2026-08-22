import axios from 'axios';

const tripApiInstance = axios.create({
    baseURL: '/api/trips',
    withCredentials: true,
});

/**
 * Create a new trip
 * @param {Object} tripData - { name, description, startDate, endDate, budgetAmount, budgetCurrency, coverPhotoUrl, status, visibility }
 */
export async function createTrip(tripData) {
    const response = await tripApiInstance.post('/', tripData);
    return response.data;
}

/**
 * List trips for the current user
 * @param {Object} params - { search, status, page, limit, sortBy, order }
 */
export async function listTrips(params = {}) {
    const response = await tripApiInstance.get('/', { params });
    return response.data;
}

/**
 * Get single fully hydrated trip (with stops, activities, and costItems)
 * @param {string} tripId
 */
export async function getTrip(tripId) {
    const response = await tripApiInstance.get(`/${tripId}`);
    return response.data;
}

/**
 * Update trip basic details
 * @param {string} tripId
 * @param {Object} updates
 */
export async function updateTrip(tripId, updates) {
    const response = await tripApiInstance.patch(`/${tripId}`, updates);
    return response.data;
}

/**
 * Delete a trip
 * @param {string} tripId
 */
export async function deleteTrip(tripId) {
    const response = await tripApiInstance.delete(`/${tripId}`);
    return response.data;
}

/**
 * Update trip lifecycle status (draft, planned, ongoing, completed, cancelled)
 * @param {string} tripId
 * @param {string} status
 */
export async function updateTripStatus(tripId, status) {
    const response = await tripApiInstance.patch(`/${tripId}/status`, { status });
    return response.data;
}

/**
 * Update trip public visibility (private, public)
 * @param {string} tripId
 * @param {'private' | 'public'} visibility
 */
export async function updateTripVisibility(tripId, visibility) {
    const response = await tripApiInstance.patch(`/${tripId}/visibility`, { visibility });
    return response.data;
}

/**
 * Clone/Duplicate an existing trip to the current user
 * @param {string} tripId
 * @param {Object} [data] - { title }
 */
export async function cloneTrip(tripId, data = {}) {
    const response = await tripApiInstance.post(`/${tripId}/clone`, data);
    return response.data;
}
