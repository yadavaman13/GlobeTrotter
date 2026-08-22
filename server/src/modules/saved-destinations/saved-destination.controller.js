import {
    saveDestination as saveDestinationDao,
    removeSavedDestination as removeSavedDestinationDao,
    listSavedDestinations as listSavedDestinationsDao,
} from '../../dao/savedDestination.dao.js';
import { getCityById } from '../../dao/city.dao.js';
import { sendResponse } from '../../utils/response.utlis.js';

/**
 * GET /api/saved-destinations
 * List all saved / bookmarked cities for the logged-in user
 */
export async function listSavedDestinations(req, res) {
    try {
        const { search, country, region, page = 1, limit = 20, sortBy, order } = req.query;

        const result = await listSavedDestinationsDao(req.user.id, {
            search,
            country,
            region,
            page,
            limit,
            sortBy,
            order,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Saved destinations fetched successfully.',
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('listSavedDestinations error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Internal server error while fetching saved destinations.',
            success: false,
        });
    }
}

/**
 * POST /api/saved-destinations
 * Bookmark a city for the logged-in user
 */
export async function saveDestination(req, res) {
    try {
        const { cityId } = req.body;

        const city = await getCityById(cityId);
        if (!city) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'City not found in destination catalog.',
                success: false,
            });
        }

        const saved = await saveDestinationDao(req.user.id, cityId);

        return sendResponse({
            res,
            statusCode: 201,
            message: `${city.name} added to your saved destinations.`,
            success: true,
            data: {
                destination: {
                    ...saved,
                    city,
                },
            },
        });
    } catch (error) {
        console.error('saveDestination error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Internal server error while saving destination.',
            success: false,
        });
    }
}

/**
 * DELETE /api/saved-destinations/:cityId
 * Remove a destination bookmark for the logged-in user
 */
export async function removeSavedDestination(req, res) {
    try {
        const { cityId } = req.params;

        if (!cityId) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'City ID parameter is required.',
                success: false,
            });
        }

        const deleted = await removeSavedDestinationDao(req.user.id, cityId);

        if (!deleted) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Destination bookmark not found.',
                success: false,
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Destination removed from saved list.',
            success: true,
            data: {
                removedCityId: cityId,
            },
        });
    } catch (error) {
        console.error('removeSavedDestination error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Internal server error while removing saved destination.',
            success: false,
        });
    }
}
