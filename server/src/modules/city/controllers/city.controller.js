import * as cityService from '../services/city.service.js';
import * as activityService from '../../activity/services/activity.service.js';
import { sendResponse } from '../../../utils/response.utlis.js';

/**
 * Retrieves a paginated and filtered list of cities.
 */
export async function getCities(req, res, next) {
    try {
        const {
            q,
            country,
            region,
            minCostIndex,
            maxCostIndex,
            minPopularity,
            maxPopularity,
            page,
            limit,
            sortBy,
            sortOrder,
        } = req.query;

        const result = await cityService.getCities({
            q,
            country,
            region,
            minCostIndex,
            maxCostIndex,
            minPopularity,
            maxPopularity,
            page,
            limit,
            sortBy,
            sortOrder,
        });

        return sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'Cities retrieved successfully',
            data: {
                cities: result.cities,
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
 * Retrieves detailed information about a single city.
 */
export async function getCity(req, res, next) {
    try {
        const { cityId } = req.params;
        const city = await cityService.getCity(cityId);

        if (!city) {
            return sendResponse({
                res,
                statusCode: 404,
                success: false,
                message: 'City not found',
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'City details retrieved successfully',
            data: { city },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Helper endpoint to retrieve activities matching a specific city ID.
 */
export async function getCityActivities(req, res, next) {
    try {
        const { cityId } = req.params;
        const city = await cityService.getCity(cityId);

        if (!city) {
            return sendResponse({
                res,
                statusCode: 404,
                success: false,
                message: 'City not found',
            });
        }

        const { page, limit } = req.query;
        const result = await activityService.getActivities({
            cityId,
            page,
            limit,
        });

        return sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'City activities retrieved successfully',
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
