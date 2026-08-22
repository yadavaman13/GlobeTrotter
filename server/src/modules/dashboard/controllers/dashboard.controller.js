import { getDashboardData } from '../../../dao/dashboard.dao.js';
import { sendResponse } from '../../../utils/response.utlis.js';

/**
 * GET /api/dashboard
 * Aggregates all dashboard metrics for the authenticated user.
 */
export async function getDashboard(req, res, next) {
    try {
        const userId = req.user.id;
        const dashboardData = await getDashboardData(userId);

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Dashboard data retrieved successfully',
            success: true,
            data: dashboardData,
        });
    } catch (error) {
        next(error);
    }
}
