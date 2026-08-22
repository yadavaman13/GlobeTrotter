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

export const listCitiesValidator = [
    query('q').optional().trim().escape(),
    query('country').optional().trim().escape(),
    query('region').optional().trim().escape(),
    query('minCostIndex')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('minCostIndex must be a non-negative number')
        .toFloat(),
    query('maxCostIndex')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('maxCostIndex must be a non-negative number')
        .toFloat(),
    query('minPopularity')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('minPopularity must be a non-negative number')
        .toFloat(),
    query('maxPopularity')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('maxPopularity must be a non-negative number')
        .toFloat(),
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
        .isIn(['name', 'country', 'region', 'costIndex', 'popularity', 'createdAt'])
        .withMessage('Invalid sort field'),
    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc', 'ASC', 'DESC'])
        .withMessage('sortOrder must be asc or desc'),
    validateRequest,
];

export const getCityValidator = [
    param('cityId').isUUID().withMessage('Invalid city ID format'),
    validateRequest,
];
