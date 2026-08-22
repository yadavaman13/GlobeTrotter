import {
    createTripShare,
    listTripShares as listTripSharesDao,
    deleteTripShare,
} from '../../dao/tripShare.dao.js';
import { getUserByEmail, getUserById } from '../../dao/user.dao.js';
import { getTripById } from '../../dao/trip.dao.js';
import { sendResponse } from '../../utils/response.utlis.js';

/**
 * POST /api/trips/:tripId/shares
 * Share a trip with another registered traveler
 */
export async function shareTrip(req, res) {
    try {
        const tripId = req.params.tripId;
        const trip = req.trip || (await getTripById(tripId));

        if (!trip) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Trip not found.',
                success: false,
            });
        }

        const { email, userId, sharedWithUserId } = req.body;
        let targetUser = null;

        if (email) {
            targetUser = await getUserByEmail(email.toLowerCase().trim());
        } else if (userId || sharedWithUserId) {
            targetUser = await getUserById(userId || sharedWithUserId);
        }

        if (!targetUser) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Target traveler user not found.',
                success: false,
            });
        }

        // Prevent self-sharing
        if (targetUser.id === req.user.id || targetUser.id === trip.ownerId) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'You cannot share a trip with yourself.',
                success: false,
            });
        }

        const share = await createTripShare(tripId, targetUser.id, req.user.id);

        return sendResponse({
            res,
            statusCode: 201,
            message: `Trip successfully shared with ${targetUser.firstName || targetUser.email}.`,
            success: true,
            data: {
                share: {
                    id: share?.id,
                    tripId,
                    sharedWithUser: {
                        id: targetUser.id,
                        email: targetUser.email,
                        firstName: targetUser.firstName,
                        lastName: targetUser.lastName,
                        profileImage: targetUser.profileImage,
                    },
                    createdAt: share?.createdAt || new Date(),
                },
            },
        });
    } catch (error) {
        console.error('shareTrip error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Internal server error while sharing trip.',
            success: false,
        });
    }
}

/**
 * GET /api/trips/:tripId/shares
 * List all users with whom the trip is shared
 */
export async function listTripShares(req, res) {
    try {
        const tripId = req.params.tripId;
        const shares = await listTripSharesDao(tripId);

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Trip collaborators fetched successfully.',
            success: true,
            data: {
                shares,
                count: shares.length,
            },
        });
    } catch (error) {
        console.error('listTripShares error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Internal server error while fetching trip shares.',
            success: false,
        });
    }
}

/**
 * DELETE /api/trips/:tripId/shares/:userId
 * Revoke sharing permissions for a specific collaborator
 */
export async function revokeTripShare(req, res) {
    try {
        const { tripId, userId } = req.params;

        if (!userId) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'User ID is required to revoke sharing.',
                success: false,
            });
        }

        const deleted = await deleteTripShare(tripId, userId);

        if (!deleted) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Trip share record not found for this user.',
                success: false,
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Trip share access revoked successfully.',
            success: true,
            data: {
                revokedUserId: userId,
            },
        });
    } catch (error) {
        console.error('revokeTripShare error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Internal server error while revoking trip share.',
            success: false,
        });
    }
}
