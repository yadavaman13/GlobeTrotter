import * as adminDao from '../dao/admin.dao.js';
import { cleanupExpiredDeletedUsers } from '../modules/auth/services/cleanup.service.js';
import { sendResponse } from '../utils/response.utlis.js';
import redis from '../config/cache.config.js';

/**
 * List all users with pagination, search, and filtering (Admin only)
 * GET /api/admin/users
 */
export async function adminListUsers(req, res, next) {
    try {
        const {
            page = 1,
            limit = 20,
            search = '',
            role,
            isActive,
            isDeleted,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query;

        const result = await adminDao.getAdminUsersList({
            page,
            limit,
            search,
            role,
            isActive,
            isDeleted,
            sortBy,
            sortOrder,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Users retrieved successfully',
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get detailed user record by ID with travel engagement summary (Admin only)
 * GET /api/admin/users/:userId
 */
export async function adminGetUserById(req, res, next) {
    try {
        const { userId, id } = req.params;
        const targetId = userId || id;

        const user = await adminDao.getAdminUserDetails(targetId);
        if (!user) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'User not found',
                success: false,
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'User details retrieved successfully',
            success: true,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update user status and flags (Admin only)
 * PATCH /api/admin/users/:userId/status
 */
export async function adminUpdateUserStatus(req, res, next) {
    try {
        const { userId, id } = req.params;
        const targetId = userId || id;
        const { isActive, isDeleted, role } = req.body;

        // Prevent admin from deactivating, deleting, or demoting their own account
        if (targetId === req.user.id && (isActive === false || isDeleted === true || role === 'user')) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'Admins cannot deactivate, delete, or demote their own account.',
                success: false,
            });
        }

        const updatedUser = await adminDao.updateAdminUserStatus(targetId, {
            isActive,
            isDeleted,
            role,
        });

        if (!updatedUser) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'User not found',
                success: false,
            });
        }

        // Invalidate Redis user cache
        const cacheKey = `user:${targetId}`;
        try {
            await redis.del(cacheKey);
        } catch (cacheError) {
            console.error('Redis cache delete error in adminUpdateUserStatus:', cacheError);
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'User status updated successfully',
            success: true,
            data: {
                user: {
                    id: updatedUser.id,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    isActive: updatedUser.isActive,
                    isDeleted: updatedUser.isDeleted,
                    deletedAt: updatedUser.deletedAt,
                    emailVerified: updatedUser.emailVerified,
                    createdAt: updatedUser.createdAt,
                    updatedAt: updatedUser.updatedAt,
                },
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Permanently cleanup expired soft-deleted users (Admin only)
 * POST /api/admin/users/cleanup
 */
export async function adminCleanupUsers(req, res, next) {
    try {
        const deletedUsers = await cleanupExpiredDeletedUsers();
        return sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: `${deletedUsers.length} expired deleted users permanently cleaned up.`,
            deletedUsers: deletedUsers.map((user) => ({
                id: user.id,
                email: user.email,
                deletedAt: user.deletedAt,
                recoveryExpiresAt: user.recoveryExpiresAt,
            })),
        });
    } catch (error) {
        next(error);
    }
}
