import * as communityService from '../services/community.service.js';
import { sendResponse } from '../../../utils/response.utlis.js';

/**
 * Create a new community post
 */
export async function createPost(req, res, next) {
    try {
        const authorId = req.user.id;
        const post = await communityService.createPost(authorId, req.body);
        return sendResponse({
            res,
            statusCode: 201,
            message: 'Community post created successfully',
            success: true,
            data: { post },
        });
    } catch (error) {
        if (error.message.includes('Unauthorized') || error.message.includes('own this trip')) {
            return sendResponse({
                res,
                statusCode: 403,
                message: error.message,
                success: false,
            });
        }
        if (error.message.includes('not found')) {
            return sendResponse({
                res,
                statusCode: 404,
                message: error.message,
                success: false,
            });
        }
        next(error);
    }
}

/**
 * Retrieve the community post feed (with pagination, filtering, search, sorting, grouping)
 */
export async function getPosts(req, res, next) {
    try {
        const filters = {
            search: req.query.search,
            type: req.query.type,
            cityId: req.query.cityId,
            activityId: req.query.activityId,
            sortBy: req.query.sortBy,
            page: req.query.page,
            limit: req.query.limit,
        };

        const result = await communityService.getPosts(filters);

        // Handle client-side grouping format if groupBy is requested
        const { groupBy } = req.query;
        if (groupBy === 'type') {
            const grouped = {
                trips: result.items.filter((item) => item.postType === 'trip'),
                activities: result.items.filter((item) => item.postType === 'activity'),
            };
            return sendResponse({
                res,
                statusCode: 200,
                message: 'Community feed retrieved successfully (grouped by type)',
                success: true,
                data: {
                    grouped,
                    pagination: result.pagination,
                },
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Community feed retrieved successfully',
            success: true,
            data: {
                items: result.items,
                pagination: result.pagination,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Retrieve a specific community post by its ID
 */
export async function getPostById(req, res, next) {
    try {
        const { postId } = req.params;
        const post = await communityService.getPostById(postId);
        if (!post) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Community post not found',
                success: false,
            });
        }
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Community post retrieved successfully',
            success: true,
            data: { post },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update a community post's content or title
 */
export async function updatePost(req, res, next) {
    try {
        const { postId } = req.params;
        const userId = req.user.id;
        const updatedPost = await communityService.updatePost(postId, userId, req.body);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Community post updated successfully',
            success: true,
            data: { post: updatedPost },
        });
    } catch (error) {
        if (error.message.includes('not found')) {
            return sendResponse({
                res,
                statusCode: 404,
                message: error.message,
                success: false,
            });
        }
        if (error.message.includes('Unauthorized')) {
            return sendResponse({
                res,
                statusCode: 403,
                message: error.message,
                success: false,
            });
        }
        next(error);
    }
}

/**
 * Delete a community post
 */
export async function deletePost(req, res, next) {
    try {
        const { postId } = req.params;
        const userId = req.user.id;
        await communityService.deletePost(postId, userId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Community post deleted successfully',
            success: true,
        });
    } catch (error) {
        if (error.message.includes('not found')) {
            return sendResponse({
                res,
                statusCode: 404,
                message: error.message,
                success: false,
            });
        }
        if (error.message.includes('Unauthorized')) {
            return sendResponse({
                res,
                statusCode: 403,
                message: error.message,
                success: false,
            });
        }
        next(error);
    }
}

/**
 * Toggle like status on a post
 */
export async function toggleLikePost(req, res, next) {
    try {
        const { postId } = req.params;
        const userId = req.user.id;
        const result = await communityService.toggleLikePost(postId, userId);
        return sendResponse({
            res,
            statusCode: 200,
            message: result.isLiked ? 'Post liked' : 'Post unliked',
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Add a comment to a post
 */
export async function addComment(req, res, next) {
    try {
        const { postId } = req.params;
        const authorId = req.user.id;
        const { content } = req.body;
        if (!content || !content.trim()) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'Comment content is required',
                success: false,
            });
        }
        const comment = await communityService.addComment(postId, authorId, content.trim());
        return sendResponse({
            res,
            statusCode: 201,
            message: 'Comment added successfully',
            success: true,
            data: { comment },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get comments for a post
 */
export async function getComments(req, res, next) {
    try {
        const { postId } = req.params;
        const comments = await communityService.getComments(postId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Comments retrieved successfully',
            success: true,
            data: { comments },
        });
    } catch (error) {
        next(error);
    }
}
