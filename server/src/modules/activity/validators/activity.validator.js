import { query, param, validationResult } from 'express-validator';
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

export const listActivitiesValidator = [
    query('cityId').optional().isUUID().withMessage('cityId must be a valid UUID'),
    query('activityType').optional().trim().escape(),
    query('minCost')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('minCost must be a non-negative number')
        .toFloat(),
    query('maxCost')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('maxCost must be a non-negative number')
        .toFloat(),
    query('minDuration')
        .optional()
        .isInt({ min: 1 })
        .withMessage('minDuration must be a positive integer')
        .toInt(),
    query('maxDuration')
        .optional()
        .isInt({ min: 1 })
        .withMessage('maxDuration must be a positive integer')
        .toInt(),
    query('q').optional().trim().escape(),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('page must be an integer greater than 0')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('limit must be an integer between 1 and 100')
        .toInt(),
    query('sortBy')
        .optional()
        .isIn(['name', 'cost', 'durationMinutes', 'createdAt'])
        .withMessage('Invalid sort field'),
    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc', 'ASC', 'DESC'])
        .withMessage('sortOrder must be asc or desc'),
    validateRequest,
];

export const getActivityValidator = [
    param('activityId').isUUID().withMessage('Invalid activity ID format'),
    validateRequest,
];
