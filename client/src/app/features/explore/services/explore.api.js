import axios from 'axios';

const cityApiInstance = axios.create({
    baseURL: '/api/cities',
    withCredentials: true,
});

const activityApiInstance = axios.create({
    baseURL: '/api/activities',
    withCredentials: true,
});

/**
 * ---------------------------------------------------------
 * DESTINATION CITIES DISCOVERY
 * ---------------------------------------------------------
 */

/**
 * Search and list destination cities
 * @param {Object} params - { search, q, country, region, minCostIndex, maxCostIndex, page, limit }
 */
export async function searchCities(params = {}) {
    const { search, q, ...rest } = params;
    const queryParams = { ...rest };
    const query = q || search;
    if (query !== undefined && query !== '') {
        queryParams.q = query;
    }
    const response = await cityApiInstance.get('/', { params: queryParams });
    return response.data;
}

/**
 * Get details for a single city
 * @param {string} cityId
 */
export async function getCity(cityId) {
    const response = await cityApiInstance.get(`/${cityId}`);
    return response.data;
}

/**
 * Get curated activities for a city
 * @param {string} cityId
 */
export async function getCityActivities(cityId) {
    const response = await cityApiInstance.get(`/${cityId}/activities`);
    return response.data;
}

/**
 * ---------------------------------------------------------
 * ACTIVITIES CATALOG DISCOVERY
 * ---------------------------------------------------------
 */

/**
 * Search and list activities from catalog
 * @param {Object} params - { search, q, cityId, activityType, minCost, maxCost, page, limit }
 */
export async function searchActivities(params = {}) {
    const { search, q, ...rest } = params;
    const queryParams = { ...rest };
    const query = q || search;
    if (query !== undefined && query !== '') {
        queryParams.q = query;
    }
    const response = await activityApiInstance.get('/', { params: queryParams });
    return response.data;
}

/**
 * Get single activity details
 * @param {string} activityId
 */
export async function getActivity(activityId) {
    const response = await activityApiInstance.get(`/${activityId}`);
    return response.data;
}
