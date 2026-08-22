import * as activityDao from '../../../dao/activity.dao.js';

/**
 * Creates a new activity.
 * @param {object} activityData
 */
export async function createActivity(activityData) {
    return activityDao.createActivity(activityData);
}

/**
 * Inserts a new image link for an activity.
 * @param {object} imageData
 */
export async function createActivityImage(imageData) {
    return activityDao.createActivityImage(imageData);
}

/**
 * Retrieves details of a specific activity.
 * @param {string} id
 */
export async function getActivity(id) {
    return activityDao.getActivityById(id);
}

/**
 * Lists activities matching filter conditions.
 * @param {object} filters
 */
export async function getActivities(filters) {
    return activityDao.listActivities(filters);
}
