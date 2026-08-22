import { getTripById } from '../../../dao/trip.dao.js';
import { sendResponse } from '../../../utils/response.utlis.js';

/**
 * Middleware to verify that the logged-in user is the owner of the trip
 */
export async function verifyTripOwner(req, res, next) {
    try {
        const tripId = req.params.tripId;
        if (!tripId) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'Trip ID is required.',
                success: false,
            });
        }

        const trip = await getTripById(tripId);
        if (!trip) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Trip not found.',
                success: false,
            });
        }

        if (trip.ownerId !== req.user.id && req.user.role !== 'admin') {
            return sendResponse({
                res,
                statusCode: 403,
                message: 'You do not have permission to modify this trip.',
                success: false,
            });
        }

        req.trip = trip;
        next();
    } catch (error) {
        console.error('verifyTripOwner middleware error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Internal server error while verifying trip ownership.',
            success: false,
        });
    }
}

/**
 * Middleware to verify that the logged-in user can access/view the trip
 */
export async function verifyTripAccess(req, res, next) {
    try {
        const tripId = req.params.tripId;
        if (!tripId) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'Trip ID is required.',
                success: false,
            });
        }

        const trip = await getTripById(tripId);
        if (!trip) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Trip not found.',
                success: false,
            });
        }

        // Allow if user is owner, admin, or trip is public
        if (
            trip.ownerId === req.user.id ||
            trip.visibility === 'public' ||
            req.user.role === 'admin'
        ) {
            req.trip = trip;
            return next();
        }

        return sendResponse({
            res,
            statusCode: 403,
            message: 'You do not have permission to access this trip.',
            success: false,
        });
    } catch (error) {
        console.error('verifyTripAccess middleware error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Internal server error while verifying trip access.',
            success: false,
        });
    }
}
