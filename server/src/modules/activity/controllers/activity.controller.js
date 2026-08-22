import * as activityService from '../services/activity.service.js';
import { sendResponse } from '../../../utils/response.utlis.js';

/**
 * Retrieves a paginated and filtered list of activities, joining city details and listing associated images.
 */
export async function getActivities(req, res, next) {
    try {
        const {
            cityId,
            activityType,
            minCost,
            maxCost,
            minDuration,
            maxDuration,
            page,
            limit,
            sortBy,
            sortOrder,
            q,
        } = req.query;

        const result = await activityService.getActivities({
            cityId,
            activityType,
            minCost,
            maxCost,
            minDuration,
            maxDuration,
            page,
            limit,
            sortBy,
            sortOrder,
            q,
        });

        return sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'Activities retrieved successfully',
            data: {
                activities: result.activities,
                pagination: {
                    page: page || 1,
                    limit: limit || 10,
                    total: result.total,
                    totalPages: Math.ceil(result.total / (limit || 10)),
                },
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Retrieves detailed info of a specific activity by its ID.
 */
export async function getActivity(req, res, next) {
    try {
        const { activityId } = req.params;
        const activity = await activityService.getActivity(activityId);

        if (!activity) {
            return sendResponse({
                res,
                statusCode: 404,
                success: false,
                message: 'Activity not found',
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'Activity details retrieved successfully',
            data: { activity },
        });
    } catch (error) {
        next(error);
    }
}
