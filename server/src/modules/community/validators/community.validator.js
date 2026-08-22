import { body, query, validationResult } from 'express-validator';
import { sendResponse } from '../../../utils/response.utlis.js';

function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponse({
            res,
            statusCode: 400,
            message: 'Validation failed',
            success: false,
            errors: errors.array(),
        });
    }
    next();
}

export const createPostValidator = [
    body('postType')
        .trim()
        .isIn(['trip', 'activity'])
        .withMessage('postType must be either "trip" or "activity"'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('tripId')
        .optional({ nullable: true, checkFalsy: true })
        .isUUID()
        .withMessage('tripId must be a valid UUID'),
    body('activityId')
        .optional({ nullable: true, checkFalsy: true })
        .isUUID()
        .withMessage('activityId must be a valid UUID'),
    body().custom((value) => {
        if (value.postType === 'trip') {
            if (!value.tripId) {
                throw new Error('tripId is required for postType "trip"');
            }
            if (value.activityId) {
                throw new Error('activityId must be null/absent for postType "trip"');
            }
        }
        if (value.postType === 'activity') {
            if (!value.activityId) {
                throw new Error('activityId is required for postType "activity"');
            }
            if (value.tripId) {
                throw new Error('tripId must be null/absent for postType "activity"');
            }
        }
        return true;
    }),
    validateRequest,
];

export const updatePostValidator = [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
    body('postType').custom((value) => {
        if (value !== undefined) {
            throw new Error('postType is immutable and cannot be updated');
        }
        return true;
    }),
    body('tripId').custom((value) => {
        if (value !== undefined) {
            throw new Error('tripId is immutable and cannot be updated');
        }
        return true;
    }),
    body('activityId').custom((value) => {
        if (value !== undefined) {
            throw new Error('activityId is immutable and cannot be updated');
        }
        return true;
    }),
    validateRequest,
];

export const getPostsValidator = [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be an integer >= 1').toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('limit must be an integer between 1 and 100')
        .toInt(),
    query('type')
        .optional()
        .isIn(['trip', 'activity'])
        .withMessage('type must be either "trip" or "activity"'),
    query('sortBy')
        .optional()
        .isIn(['recent', 'oldest'])
        .withMessage('sortBy must be either "recent" or "oldest"'),
    query('groupBy')
        .optional()
        .isIn(['type', 'trip', 'activity', 'city'])
        .withMessage('groupBy must be "type", "trip", "activity", or "city"'),
    query('cityId').optional().isUUID().withMessage('cityId must be a valid UUID'),
    query('activityId').optional().isUUID().withMessage('activityId must be a valid UUID'),
    validateRequest,
];
