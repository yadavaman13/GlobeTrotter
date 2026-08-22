import {
    createTripStopActivity,
    findOrCreateActivity,
    getActivitiesByStopId,
    getActivityById,
    updateTripStopActivity,
    deleteTripStopActivity,
    reorderStopActivities,
} from '../../dao/activity.dao.js';
import { getStopById } from '../../dao/stop.dao.js';
import { getTripById } from '../../dao/trip.dao.js';
import { createTripCostItem } from '../../dao/expense.dao.js';
import { sendResponse } from '../../utils/response.utlis.js';

/**
 * POST /api/trips/:tripId/stops/:stopId/activities
 * Schedule an activity inside a trip stop
 */
export async function createActivity(req, res) {
    try {
        const { tripId, stopId } = req.params;
        const stop = await getStopById(stopId);

        if (!stop || stop.tripId !== tripId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Stop not found in this trip.',
                success: false,
            });
        }

        const {
            name,
            title,
            description,
            category,
            activityType,
            activityDate,
            startTime,
            endTime,
            durationMinutes,
            cost,
            notes,
            sequenceOrder,
        } = req.body;

        let activityId = req.body.activityId;

        // Relational date boundary check: stop.startDate <= activityDate <= stop.endDate
        if (
            new Date(activityDate) < new Date(stop.startDate) ||
            new Date(activityDate) > new Date(stop.endDate)
        ) {
            return sendResponse({
                res,
                statusCode: 400,
                message: `Activity date (${activityDate}) must be within stop dates (${stop.startDate} to ${stop.endDate}).`,
                success: false,
            });
        }

        // Time sanity check: startTime < endTime
        if (startTime && endTime && startTime >= endTime) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'Start time must be before end time.',
                success: false,
            });
        }

        // Find or create catalog activity if activityId not provided
        if (!activityId) {
            const activityTitle = name || title || 'Scheduled Activity';
            const cat = category || activityType || 'sightseeing';
            const catalogItem = await findOrCreateActivity({
                cityId: stop.cityId,
                name: activityTitle,
                description: description || '',
                activityType: cat,
                cost: cost || 0,
                durationMinutes: durationMinutes || 60,
            });
            activityId = catalogItem.id;
        }

        const scheduled = await createTripStopActivity({
            tripStopId: stopId,
            activityId,
            activityDate,
            startTime: startTime || null,
            endTime: endTime || null,
            sequenceOrder: sequenceOrder ? parseInt(sequenceOrder, 10) : undefined,
            notes: notes || null,
        });

        // If cost is specified (>0), log expense item for this activity
        if (cost && parseFloat(cost) > 0) {
            const trip = await getTripById(tripId);
            await createTripCostItem({
                tripId,
                tripStopId: stopId,
                tripStopActivityId: scheduled.id,
                category: 'activity',
                description: `${name || title || 'Activity'}: ${activityDate}`,
                amount: parseFloat(cost).toString(),
                currency: trip?.budgetCurrency || 'INR',
                costDate: activityDate,
            });
        }

        const hydrated = await getActivityById(scheduled.id);

        return sendResponse({
            res,
            statusCode: 201,
            message: 'Activity scheduled in stop successfully.',
            success: true,
            activity: hydrated,
        });
    } catch (error) {
        console.error('createActivity error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to schedule activity.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * GET /api/trips/:tripId/stops/:stopId/activities
 * List scheduled activities for a stop
 */
export async function listActivities(req, res) {
    try {
        const { tripId, stopId } = req.params;
        const stop = await getStopById(stopId);

        if (!stop || stop.tripId !== tripId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Stop not found in this trip.',
                success: false,
            });
        }

        const activities = await getActivitiesByStopId(stopId);

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Activities fetched successfully.',
            success: true,
            activities,
        });
    } catch (error) {
        console.error('listActivities error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to fetch activities.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * PATCH /api/trips/:tripId/stops/:stopId/activities/:activityId
 * Update scheduled activity details
 */
export async function updateActivity(req, res) {
    try {
        const { tripId, stopId, activityId } = req.params;
        const stop = await getStopById(stopId);

        if (!stop || stop.tripId !== tripId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Stop not found in this trip.',
                success: false,
            });
        }

        const currentActivity = await getActivityById(activityId);
        if (!currentActivity || currentActivity.tripStopId !== stopId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Activity not found in this stop.',
                success: false,
            });
        }

        const updates = {};
        if (req.body.activityDate) {
            // Validate new date against stop bounds
            if (
                new Date(req.body.activityDate) < new Date(stop.startDate) ||
                new Date(req.body.activityDate) > new Date(stop.endDate)
            ) {
                return sendResponse({
                    res,
                    statusCode: 400,
                    message: `Activity date (${req.body.activityDate}) must be within stop dates (${stop.startDate} to ${stop.endDate}).`,
                    success: false,
                });
            }
            updates.activityDate = req.body.activityDate;
        }

        if (req.body.startTime !== undefined) updates.startTime = req.body.startTime || null;
        if (req.body.endTime !== undefined) updates.endTime = req.body.endTime || null;
        if (req.body.notes !== undefined) updates.notes = req.body.notes;
        if (req.body.sequenceOrder !== undefined)
            updates.sequenceOrder = parseInt(req.body.sequenceOrder, 10);

        // Sanity check times
        const finalStart =
            updates.startTime !== undefined ? updates.startTime : currentActivity.startTime;
        const finalEnd = updates.endTime !== undefined ? updates.endTime : currentActivity.endTime;
        if (finalStart && finalEnd && finalStart >= finalEnd) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'Start time must be before end time.',
                success: false,
            });
        }

        await updateTripStopActivity(activityId, stopId, updates);
        const updated = await getActivityById(activityId);

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Activity updated successfully.',
            success: true,
            activity: updated,
        });
    } catch (error) {
        console.error('updateActivity error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to update activity.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * DELETE /api/trips/:tripId/stops/:stopId/activities/:activityId
 * Remove scheduled activity
 */
export async function deleteActivity(req, res) {
    try {
        const { tripId, stopId, activityId } = req.params;
        const stop = await getStopById(stopId);

        if (!stop || stop.tripId !== tripId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Stop not found in this trip.',
                success: false,
            });
        }

        const deleted = await deleteTripStopActivity(activityId, stopId);
        if (!deleted) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Activity not found in this stop.',
                success: false,
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Activity removed from stop successfully.',
            success: true,
        });
    } catch (error) {
        console.error('deleteActivity error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to delete activity.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * PATCH /api/trips/:tripId/stops/:stopId/activities/reorder
 * Reorder activities in a stop
 */
export async function reorderActivities(req, res) {
    try {
        const { tripId, stopId } = req.params;
        const stop = await getStopById(stopId);

        if (!stop || stop.tripId !== tripId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Stop not found in this trip.',
                success: false,
            });
        }

        const { activities, activityIds } = req.body;
        let activityOrders = [];

        if (Array.isArray(activities)) {
            activityOrders = activities.map((item, idx) => ({
                id: item.id,
                sequenceOrder:
                    item.sequenceOrder !== undefined ? parseInt(item.sequenceOrder, 10) : idx + 1,
            }));
        } else if (Array.isArray(activityIds)) {
            activityOrders = activityIds.map((id, idx) => ({
                id,
                sequenceOrder: idx + 1,
            }));
        }

        if (activityOrders.length === 0) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'No activities provided to reorder.',
                success: false,
            });
        }

        await reorderStopActivities(stopId, activityOrders);
        const updatedActivities = await getActivitiesByStopId(stopId);

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Activities reordered successfully.',
            success: true,
            activities: updatedActivities,
        });
    } catch (error) {
        console.error('reorderActivities error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to reorder activities.',
            success: false,
            error: error.message,
        });
    }
}
