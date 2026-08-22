import { getPublicHydratedTripBySlug } from '../../dao/trip.dao.js';
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
 * GET /api/public/trips/:slug
 * Retrieve public read-only shared trip by slug with full stops, activities, and timeline
 */
export async function getPublicTrip(req, res) {
    try {
        const slug = req.params.slug;
        if (!slug) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'Trip slug is required.',
                success: false,
            });
        }

        const trip = await getPublicHydratedTripBySlug(slug);

        if (!trip) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Public trip not found or is set to private.',
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

        // Synthesize day-wise schedule
        const days = dateRange.map((dateStr, index) => {
            const currentStops = stops.filter(
                (s) => s.startDate <= dateStr && s.endDate >= dateStr,
            );
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

            return {
                dayNumber: index + 1,
                date: dateStr,
                stops: currentStops,
                activities: dayActivities,
            };
        });

        const summary = {
            totalDays: days.length,
            totalStops: stops.length,
            totalActivities: allActivities.length,
            budgetAmount: trip.budgetAmount ? parseFloat(trip.budgetAmount) : null,
            currency: trip.budgetCurrency || 'INR',
        };

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Public itinerary fetched successfully.',
            success: true,
            data: {
                trip: {
                    id: trip.id,
                    name: trip.name,
                    description: trip.description,
                    startDate: trip.startDate,
                    endDate: trip.endDate,
                    coverPhotoUrl: trip.coverPhotoUrl,
                    status: trip.status,
                    visibility: trip.visibility,
                    publicSlug: trip.publicSlug,
                    createdAt: trip.createdAt,
                    updatedAt: trip.updatedAt,
                    owner: trip.owner,
                },
                stops,
                days,
                summary,
            },
        });
    } catch (error) {
        console.error('getPublicTrip error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Internal server error while fetching public trip.',
            success: false,
        });
    }
}
