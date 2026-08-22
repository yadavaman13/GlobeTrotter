import axios from 'axios';

const publicApiInstance = axios.create({
    baseURL: '/api/public',
    withCredentials: true,
});

const tripApiInstance = axios.create({
    baseURL: '/api/trips',
    withCredentials: true,
});

/**
 * ---------------------------------------------------------
 * PUBLIC TRIP & SHARING
 * ---------------------------------------------------------
 */

/**
 * Retrieve public hydrated itinerary by unique slug (No auth required)
 * @param {string} slug
 */
export async function getPublicTrip(slug) {
    const response = await publicApiInstance.get(`/trips/${slug}`);
    return response.data;
}

/**
 * Share trip with a collaborator via email
 * @param {string} tripId
 * @param {Object} shareData - { email, permissionLevel }
 */
export async function shareTrip(tripId, shareData) {
    const response = await tripApiInstance.post(`/${tripId}/shares`, shareData);
    return response.data;
}

/**
 * List collaborators for a trip
 * @param {string} tripId
 */
export async function listTripShares(tripId) {
    const response = await tripApiInstance.get(`/${tripId}/shares`);
    return response.data;
}

/**
 * Revoke collaboration access for a user
 * @param {string} tripId
 * @param {string} userId
 */
export async function revokeTripShare(tripId, userId) {
    const response = await tripApiInstance.delete(`/${tripId}/shares/${userId}`);
    return response.data;
}
