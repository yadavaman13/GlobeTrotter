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
