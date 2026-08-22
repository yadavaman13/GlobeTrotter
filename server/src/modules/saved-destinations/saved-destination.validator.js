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

export const saveDestinationValidator = [
    body('cityId')
        .notEmpty()
        .withMessage('City ID is required.')
        .isUUID()
        .withMessage('City ID must be a valid UUID.'),
    validateRequest,
];
