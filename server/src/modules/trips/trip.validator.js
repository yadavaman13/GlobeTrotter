import { body, param, query, validationResult } from 'express-validator';

/**
 * Standard validation result handler
 */
export function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed.',
            success: false,
            errors: errors.array(),
        });
    }
    next();
}

// ----------------------------------------------------
// TRIP VALIDATORS
// ----------------------------------------------------

export const createTripValidator = [
    body('name').optional().trim().notEmpty().withMessage('Trip name cannot be empty.'),
    body('title').optional().trim().notEmpty().withMessage('Trip title cannot be empty.'),
    body().custom((value, { req }) => {
        if (!req.body.name && !req.body.title) {
            throw new Error('Trip name or title is required.');
        }
        return true;
    }),
    body('startDate')
        .trim()
        .notEmpty()
        .withMessage('Start date is required.')
        .isISO8601()
        .withMessage('Start date must be a valid ISO date (YYYY-MM-DD).'),
    body('endDate')
        .trim()
        .notEmpty()
        .withMessage('End date is required.')
        .isISO8601()
        .withMessage('End date must be a valid ISO date (YYYY-MM-DD).')
        .custom((value, { req }) => {
            if (new Date(value) < new Date(req.body.startDate)) {
                throw new Error('End date must be on or after start date.');
            }
            return true;
        }),
    body('budgetAmount')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Budget amount must be a positive number.'),
    body('totalBudget')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Total budget must be a positive number.'),
    validateRequest,
];

export const updateTripValidator = [
    body('name').optional().trim().notEmpty().withMessage('Trip name cannot be empty.'),
    body('title').optional().trim().notEmpty().withMessage('Trip title cannot be empty.'),
    body('startDate')
        .optional()
        .trim()
        .isISO8601()
        .withMessage('Start date must be a valid ISO date.'),
    body('endDate')
        .optional()
        .trim()
        .isISO8601()
        .withMessage('End date must be a valid ISO date.')
        .custom((value, { req }) => {
            if (req.body.startDate && new Date(value) < new Date(req.body.startDate)) {
                throw new Error('End date must be on or after start date.');
            }
            return true;
        }),
    body('budgetAmount')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Budget amount must be a positive number.'),
    body('totalBudget')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Total budget must be a positive number.'),
    validateRequest,
];

export const tripStatusValidator = [
    body('status')
        .trim()
        .notEmpty()
        .withMessage('Status is required.')
        .isIn(['draft', 'planned', 'ongoing', 'completed', 'cancelled'])
        .withMessage('Status must be one of: draft, planned, ongoing, completed, cancelled.'),
    validateRequest,
];

export const tripVisibilityValidator = [
    body('visibility')
        .trim()
        .notEmpty()
        .withMessage('Visibility is required.')
        .isIn(['private', 'public'])
        .withMessage('Visibility must be either private or public.'),
    validateRequest,
];

// ----------------------------------------------------
// STOP VALIDATORS
// ----------------------------------------------------

export const createStopValidator = [
    body('cityId').optional().isUUID().withMessage('City ID must be a valid UUID.'),
    body('cityName').optional().trim().notEmpty().withMessage('City name cannot be empty.'),
    body().custom((value, { req }) => {
        if (!req.body.cityId && !req.body.cityName) {
            throw new Error('Either cityId or cityName is required.');
        }
        return true;
    }),
    body('startDate')
        .optional()
        .trim()
        .isISO8601()
        .withMessage('Start date must be a valid ISO date.'),
    body('arrivalDate')
        .optional()
        .trim()
        .isISO8601()
        .withMessage('Arrival date must be a valid ISO date.'),
    body('endDate').optional().trim().isISO8601().withMessage('End date must be a valid ISO date.'),
    body('departureDate')
        .optional()
        .trim()
        .isISO8601()
        .withMessage('Departure date must be a valid ISO date.'),
    body().custom((value, { req }) => {
        const start = req.body.startDate || req.body.arrivalDate;
        const end = req.body.endDate || req.body.departureDate;
        if (!start) throw new Error('Start date / arrival date is required.');
        if (!end) throw new Error('End date / departure date is required.');
        if (new Date(end) < new Date(start)) {
            throw new Error('Departure date must be on or after arrival date.');
        }
        return true;
    }),
    body('accommodationCost')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Accommodation cost must be a positive number.'),
    body('transportCost')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Transport cost must be a positive number.'),
    validateRequest,
];

export const updateStopValidator = [
    body('startDate')
        .optional()
        .trim()
        .isISO8601()
        .withMessage('Start date must be a valid ISO date.'),
    body('arrivalDate')
        .optional()
        .trim()
        .isISO8601()
        .withMessage('Arrival date must be a valid ISO date.'),
    body('endDate').optional().trim().isISO8601().withMessage('End date must be a valid ISO date.'),
    body('departureDate')
        .optional()
        .trim()
        .isISO8601()
        .withMessage('Departure date must be a valid ISO date.'),
    body('accommodationCost')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Accommodation cost must be a positive number.'),
    body('transportCost')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Transport cost must be a positive number.'),
    validateRequest,
];

export const reorderStopsValidator = [
    body().custom((value, { req }) => {
        if (!Array.isArray(req.body.stops) && !Array.isArray(req.body.stopIds)) {
            throw new Error('Either stops array or stopIds array is required.');
        }
        return true;
    }),
    validateRequest,
];

// ----------------------------------------------------
// ACTIVITY VALIDATORS
// ----------------------------------------------------

export const createActivityValidator = [
    body('activityDate')
        .trim()
        .notEmpty()
        .withMessage('Activity date is required.')
        .isISO8601()
        .withMessage('Activity date must be a valid ISO date.'),
    body('activityId').optional().isUUID().withMessage('Activity ID must be a valid UUID.'),
    body('name').optional().trim().notEmpty().withMessage('Activity name cannot be empty.'),
    body('title').optional().trim().notEmpty().withMessage('Activity title cannot be empty.'),
    body().custom((value, { req }) => {
        if (!req.body.activityId && !req.body.name && !req.body.title) {
            throw new Error('Either activityId or name/title is required.');
        }
        return true;
    }),
    body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be a positive number.'),
    body('durationMinutes')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Duration minutes must be a positive integer.'),
    validateRequest,
];

export const updateActivityValidator = [
    body('activityDate')
        .optional()
        .trim()
        .isISO8601()
        .withMessage('Activity date must be a valid ISO date.'),
    body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be a positive number.'),
    body('durationMinutes')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Duration minutes must be a positive integer.'),
    validateRequest,
];

export const reorderActivitiesValidator = [
    body().custom((value, { req }) => {
        if (!Array.isArray(req.body.activities) && !Array.isArray(req.body.activityIds)) {
            throw new Error('Either activities array or activityIds array is required.');
        }
        return true;
    }),
    validateRequest,
];

// ----------------------------------------------------
// COST / EXPENSE VALIDATORS
// ----------------------------------------------------

export const createCostValidator = [
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required.')
        .toLowerCase()
        .custom((val) => {
            // Map common aliases
            const normalized =
                val === 'accommodation'
                    ? 'stay'
                    : val === 'food'
                      ? 'meal'
                      : val === 'activities'
                        ? 'activity'
                        : val;
            if (!['transport', 'stay', 'activity', 'meal'].includes(normalized)) {
                throw new Error(
                    'Category must be one of: transport, stay, activity, meal (or accommodation, food).',
                );
            }
            return true;
        }),
    body('amount')
        .notEmpty()
        .withMessage('Amount is required.')
        .isFloat({ min: 0 })
        .withMessage('Amount must be a positive number.'),
    body('costDate')
        .optional()
        .trim()
        .isISO8601()
        .withMessage('Cost date must be a valid ISO date.'),
    validateRequest,
];

export const updateCostValidator = [
    body('category')
        .optional()
        .trim()
        .toLowerCase()
        .custom((val) => {
            const normalized =
                val === 'accommodation'
                    ? 'stay'
                    : val === 'food'
                      ? 'meal'
                      : val === 'activities'
                        ? 'activity'
                        : val;
            if (!['transport', 'stay', 'activity', 'meal'].includes(normalized)) {
                throw new Error('Category must be one of: transport, stay, activity, meal.');
            }
            return true;
        }),
    body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number.'),
    body('costDate')
        .optional()
        .trim()
        .isISO8601()
        .withMessage('Cost date must be a valid ISO date.'),
    validateRequest,
];
