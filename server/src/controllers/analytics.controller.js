import * as analyticsDao from '../dao/analytics.dao.js';
import { sendResponse } from '../utils/response.utlis.js';

/**
 * Get comprehensive platform analytics across all business domains (Admin only)
 * GET /api/admin/analytics
 */
export async function getAdminAnalytics(req, res, next) {
    try {
        const { timeframe = '30d' } = req.query;
        const analytics = await analyticsDao.getPlatformAnalytics(timeframe);

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Analytics retrieved successfully',
            success: true,
            data: {
                analytics,
            },
        });
    } catch (error) {
        next(error);
    }
}

