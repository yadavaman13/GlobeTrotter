import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

/**
 * Fetch list of cities with filters (region, query, etc.)
 */
export async function getCities(params = {}) {
    const response = await api.get('/cities', {
        params: {
            limit: 10,
            sortBy: 'popularity',
            sortOrder: 'desc',
            ...params,
        },
    });
    return response.data;
}

/**
 * Fetch authenticated user's trips
 */
export async function getTrips(params = {}) {
    const response = await api.get('/trips', {
        params: {
            limit: 10,
            sortBy: 'startDate',
            order: 'asc',
            ...params,
        },
    });
    return response.data;
}

/**
 * Fetch list of activities with filters (activityType, cityId, q, etc.)
 */
export async function getActivities(params = {}) {
    const response = await api.get('/activities', {
        params: {
            limit: 10,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            ...params,
        },
    });
    return response.data;
}

/**
 * Fetch specific activity details by ID
 */
export async function getActivityById(activityId) {
    const response = await api.get(`/activities/${activityId}`);
    return response.data;
}

/**
 * Fetch user's saved destinations
 */
export async function getSavedDestinations() {
    const response = await api.get('/saved-destinations');
    return response.data;
}

/**
 * Save / Bookmark a destination city
 */
export async function saveDestination(cityId) {
    const response = await api.post('/saved-destinations', { cityId });
    return response.data;
}

/**
 * Remove a bookmarked destination city
 */
export async function removeSavedDestination(cityId) {
    const response = await api.delete(`/saved-destinations/${cityId}`);
    return response.data;
}
