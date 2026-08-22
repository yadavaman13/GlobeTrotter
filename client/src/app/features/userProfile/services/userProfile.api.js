import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

/**
 * Fetch authenticated user's trips list with filters/sort/search
 * @param {object} params - query parameters like search, status, sortBy, order, page, limit
 */
export const fetchTrips = async (params = {}) => {
    const response = await api.get('/trips', { params });
    return response.data;
};

/**
 * Fetch authenticated user's aggregated dashboard metrics
 */
export const fetchDashboardData = async () => {
    const response = await api.get('/dashboard');
    return response.data;
};
