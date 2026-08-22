import {
    createTrip as createTripDao,
    getTripById,
    listUserTrips,
    updateTrip as updateTripDao,
    deleteTrip as deleteTripDao,
    getHydratedTripById,
    updateTripStatus as updateTripStatusDao,
    updateTripVisibility as updateTripVisibilityDao,
    cloneTripTransaction,
} from '../../dao/trip.dao.js';
import { sendResponse } from '../../utils/response.utlis.js';

/**
 * Valid state machine transitions
 */
const VALID_TRANSITIONS = {
    draft: ['planned', 'cancelled'],
    planned: ['ongoing', 'cancelled', 'draft'],
    ongoing: ['completed', 'cancelled'],
    completed: [],
    cancelled: ['draft', 'planned'],
};

/**
 * POST /api/trips
 * Create a new trip
 */
export async function createTrip(req, res) {
    try {
        const {
            name,
            title,
            description,
            startDate,
            endDate,
            budgetAmount,
            totalBudget,
            budgetCurrency,
            currency,
            coverPhotoUrl,
            coverImageUrl,
            status,
            visibility,
        } = req.body;

        const tripName = name || title;
        const budget =
            budgetAmount !== undefined
                ? budgetAmount
                : totalBudget !== undefined
                  ? totalBudget
                  : null;
        const tripCurrency = budgetCurrency || currency || 'INR';
        const coverImage = coverPhotoUrl || coverImageUrl || null;

        const newTrip = await createTripDao({
            ownerId: req.user.id,
            name: tripName,
            description: description || null,
            startDate,
            endDate,
            budgetAmount: budget ? budget.toString() : null,
            budgetCurrency: tripCurrency,
            coverPhotoUrl: coverImage,
            status: status || 'draft',
            visibility: visibility || 'private',
        });

        return sendResponse({
            res,
            statusCode: 201,
            message: 'Trip created successfully.',
            success: true,
            trip: {
                ...newTrip,
                title: newTrip.name,
                totalBudget: newTrip.budgetAmount ? parseFloat(newTrip.budgetAmount) : null,
                currency: newTrip.budgetCurrency,
            },
        });
    } catch (error) {
        console.error('createTrip error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to create trip.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * GET /api/trips
 * List user's trips with search, status filters, and pagination
 */
export async function listTrips(req, res) {
    try {
        const { search, q, status, page, limit, sortBy, order } = req.query;

        const result = await listUserTrips(req.user.id, {
            search: search || q,
            status,
            page,
            limit,
            sortBy,
            order,
        });

        // Add client friendly field aliases
        const formattedTrips = result.trips.map((t) => ({
            ...t,
            title: t.name,
            totalBudget: t.budgetAmount ? parseFloat(t.budgetAmount) : null,
            currency: t.budgetCurrency,
        }));

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Trips fetched successfully.',
            success: true,
            trips: formattedTrips,
            pagination: result.pagination,
        });
    } catch (error) {
        console.error('listTrips error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to fetch trips.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * GET /api/trips/:tripId
 * Retrieve single hydrated trip
 */
export async function getTrip(req, res) {
    try {
        const tripId = req.params.tripId;
        const hydrated = await getHydratedTripById(tripId);

        if (!hydrated) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Trip not found.',
                success: false,
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Trip details retrieved successfully.',
            success: true,
            trip: {
                ...hydrated,
                title: hydrated.name,
                totalBudget: hydrated.budgetAmount ? parseFloat(hydrated.budgetAmount) : null,
                currency: hydrated.budgetCurrency,
            },
        });
    } catch (error) {
        console.error('getTrip error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to retrieve trip details.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * PATCH /api/trips/:tripId
 * Update trip details & budget
 */
export async function updateTrip(req, res) {
    try {
        const tripId = req.params.tripId;
        const currentTrip = req.trip || (await getTripById(tripId));

        if (!currentTrip) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Trip not found.',
                success: false,
            });
        }

        const updates = {};
        if (req.body.name || req.body.title) updates.name = req.body.name || req.body.title;
        if (req.body.description !== undefined) updates.description = req.body.description;
        if (req.body.startDate) updates.startDate = req.body.startDate;
        if (req.body.endDate) updates.endDate = req.body.endDate;

        if (req.body.budgetAmount !== undefined) {
            updates.budgetAmount = req.body.budgetAmount ? req.body.budgetAmount.toString() : null;
        } else if (req.body.totalBudget !== undefined) {
            updates.budgetAmount = req.body.totalBudget ? req.body.totalBudget.toString() : null;
        }

        if (req.body.budgetCurrency || req.body.currency) {
            updates.budgetCurrency = req.body.budgetCurrency || req.body.currency;
        }
        if (req.body.coverPhotoUrl || req.body.coverImageUrl) {
            updates.coverPhotoUrl = req.body.coverPhotoUrl || req.body.coverImageUrl;
        }

        // Validate resulting start and end date ordering
        const finalStart = new Date(updates.startDate || currentTrip.startDate);
        const finalEnd = new Date(updates.endDate || currentTrip.endDate);
        if (finalEnd < finalStart) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'End date must be on or after start date.',
                success: false,
            });
        }

        const updated = await updateTripDao(tripId, req.user.id, updates);

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Trip updated successfully.',
            success: true,
            trip: {
                ...updated,
                title: updated.name,
                totalBudget: updated.budgetAmount ? parseFloat(updated.budgetAmount) : null,
                currency: updated.budgetCurrency,
            },
        });
    } catch (error) {
        console.error('updateTrip error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to update trip.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * DELETE /api/trips/:tripId
 * Cascade delete trip
 */
export async function deleteTrip(req, res) {
    try {
        const tripId = req.params.tripId;
        const deleted = await deleteTripDao(tripId, req.user.id);

        if (!deleted) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Trip not found.',
                success: false,
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Trip and associated itinerary deleted successfully.',
            success: true,
        });
    } catch (error) {
        console.error('deleteTrip error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to delete trip.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * PATCH /api/trips/:tripId/status
 * State machine transition
 */
export async function updateTripStatus(req, res) {
    try {
        const tripId = req.params.tripId;
        const currentTrip = req.trip || (await getTripById(tripId));
        const newStatus = req.body.status;

        if (currentTrip.status === newStatus) {
            return sendResponse({
                res,
                statusCode: 200,
                message: `Trip is already in ${newStatus} status.`,
                success: true,
                trip: currentTrip,
            });
        }

        const allowedNext = VALID_TRANSITIONS[currentTrip.status] || [];
        if (!allowedNext.includes(newStatus)) {
            return sendResponse({
                res,
                statusCode: 400,
                message: `Invalid status transition from '${currentTrip.status}' to '${newStatus}'. Allowed: ${allowedNext.join(', ') || 'none'}.`,
                success: false,
            });
        }

        const updated = await updateTripStatusDao(tripId, req.user.id, newStatus);

        return sendResponse({
            res,
            statusCode: 200,
            message: `Trip status updated to ${newStatus}.`,
            success: true,
            trip: updated,
        });
    } catch (error) {
        console.error('updateTripStatus error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to update trip status.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * PATCH /api/trips/:tripId/visibility
 * Toggle public/private sharing
 */
export async function updateTripVisibility(req, res) {
    try {
        const tripId = req.params.tripId;
        const { visibility } = req.body;

        const updated = await updateTripVisibilityDao(tripId, req.user.id, visibility);
        if (!updated) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Trip not found.',
                success: false,
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: `Trip visibility set to ${visibility}.`,
            success: true,
            trip: updated,
        });
    } catch (error) {
        console.error('updateTripVisibility error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to update trip visibility.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * POST /api/trips/:tripId/clone
 * Clone/Copy an existing trip into a new draft itinerary under the authenticated user
 */
export async function cloneTrip(req, res) {
    try {
        const tripId = req.params.tripId;
        const customTitle = req.body?.name || req.body?.title;

        const cloned = await cloneTripTransaction(tripId, req.user.id, customTitle);

        return sendResponse({
            res,
            statusCode: 201,
            message: 'Trip cloned successfully.',
            success: true,
            data: {
                trip: cloned,
            },
        });
    } catch (error) {
        console.error('cloneTrip error:', error);
        const statusCode = error.message === 'Source trip not found.' ? 404 : 500;
        return sendResponse({
            res,
            statusCode,
            message: error.message || 'Internal server error while cloning trip.',
            success: false,
        });
    }
}
