import { getHydratedTripById } from '../../dao/trip.dao.js';
import { sendResponse } from '../../utils/response.utlis.js';

/**
 * Helper to generate an array of 'YYYY-MM-DD' dates between start and end date inclusive
 * @param {string} startDate
 * @param {string} endDate
 */
function getDateRange(startDate, endDate) {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    return dates;
}

/**
 * GET /api/trips/:tripId/timeline
 * Synthesizes dynamic day-wise chronological timeline combining stops, activities, and expenses
 */
export async function getTripTimeline(req, res) {
    try {
        const tripId = req.params.tripId;
        const trip = await getHydratedTripById(tripId);

        if (!trip) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Trip not found.',
                success: false,
            });
        }

        const dateRange = getDateRange(trip.startDate, trip.endDate);
        const stops = trip.stops || [];
        const costItems = trip.costItems || [];

        // Flatten all stop activities with stop metadata
        const allActivities = [];
        stops.forEach((stop) => {
            (stop.activities || []).forEach((act) => {
                allActivities.push({
                    ...act,
                    stopId: stop.id,
                    cityName: stop.cityName,
                    country: stop.country,
                });
            });
        });

        let totalActivitiesCost = 0;
        let totalCostItemsSum = 0;

        // Build day-wise structure
        const days = dateRange.map((dateStr, index) => {
            // Stops covering this date
            const currentStops = stops
                .filter((s) => s.startDate <= dateStr && s.endDate >= dateStr)
                .map((s) => ({
                    id: s.id,
                    cityId: s.cityId,
                    cityName: s.cityName,
                    country: s.country,
                    region: s.region,
                    costIndex: s.costIndex,
                    popularity: s.popularity,
                    coverImage: s.coverImage,
                    startDate: s.startDate,
                    endDate: s.endDate,
                    sequenceOrder: s.sequenceOrder,
                }));

            // Activities scheduled for this day
            const dayActivities = allActivities
                .filter((a) => a.activityDate === dateStr)
                .sort((a, b) => {
                    if (a.sequenceOrder !== b.sequenceOrder) {
                        return a.sequenceOrder - b.sequenceOrder;
                    }
                    if (a.startTime && b.startTime) {
                        return a.startTime.localeCompare(b.startTime);
                    }
                    return 0;
                });

            // Cost items logged for this day
            const dayCosts = costItems.filter((c) => c.costDate === dateStr);

            // Calculate daily cost without double counting:
            // 1. Sum all cost items for this date
            const costItemsCost = dayCosts.reduce((sum, c) => sum + parseFloat(c.amount || '0'), 0);

            // 2. Sum activities on this date that do NOT already have a linked cost item in dayCosts
            const linkedActivityIds = new Set(
                dayCosts.filter((c) => c.tripStopActivityId).map((c) => c.tripStopActivityId),
            );
            const unlinkedActivitiesCost = dayActivities
                .filter((a) => !linkedActivityIds.has(a.id))
                .reduce((sum, a) => sum + parseFloat(a.cost || '0'), 0);

            const dailyTotal = parseFloat((costItemsCost + unlinkedActivitiesCost).toFixed(2));
            totalCostItemsSum += dailyTotal;

            return {
                dayNumber: index + 1,
                date: dateStr,
                stops: currentStops,
                activities: dayActivities,
                costs: dayCosts,
                dailyTotalCost: dailyTotal,
            };
        });

        // Add undated costs to total if any
        const undatedCosts = costItems.filter((c) => !c.costDate);
        const undatedCostsSum = undatedCosts.reduce(
            (sum, c) => sum + parseFloat(c.amount || '0'),
            0,
        );

        const totalEstimatedCost = parseFloat((totalCostItemsSum + undatedCostsSum).toFixed(2));

        const summary = {
            totalDays: days.length,
            totalStops: stops.length,
            totalActivities: allActivities.length,
            totalCost: totalEstimatedCost,
            budgetAmount: trip.budgetAmount ? parseFloat(trip.budgetAmount) : null,
            currency: trip.budgetCurrency || 'INR',
        };

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Trip timeline generated successfully.',
            success: true,
            data: {
                trip: {
                    id: trip.id,
                    ownerId: trip.ownerId,
                    name: trip.name,
                    description: trip.description,
                    startDate: trip.startDate,
                    endDate: trip.endDate,
                    coverPhotoUrl: trip.coverPhotoUrl,
                    status: trip.status,
                    visibility: trip.visibility,
                    publicSlug: trip.publicSlug,
                },
                days,
                undatedCosts,
                summary,
            },
        });
    } catch (error) {
        console.error('getTripTimeline error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Internal server error while generating trip timeline.',
            success: false,
        });
    }
}
