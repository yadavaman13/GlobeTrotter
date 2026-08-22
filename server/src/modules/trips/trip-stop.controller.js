import {
    createStop as createStopDao,
    getStopsByTripId,
    getStopById,
    updateStop as updateStopDao,
    deleteStop as deleteStopDao,
    reorderStops as reorderStopsDao,
} from '../../dao/stop.dao.js';
import { getTripById } from '../../dao/trip.dao.js';
import { findCityByNameAndCountry, createCity, getCityById } from '../../dao/city.dao.js';
import { createTripCostItem } from '../../dao/expense.dao.js';
import { sendResponse } from '../../utils/response.utlis.js';

/**
 * POST /api/trips/:tripId/stops
 * Add destination stop to trip
 */
export async function createStop(req, res) {
    try {
        const tripId = req.params.tripId;
        const trip = req.trip || (await getTripById(tripId));

        if (!trip) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Trip not found.',
                success: false,
            });
        }

        const {
            cityName,
            country = 'Unknown',
            region = null,
            startDate,
            arrivalDate,
            endDate,
            departureDate,
            sequenceOrder,
            accommodationCost,
            transportCost,
            notes,
        } = req.body;

        let cityId = req.body.cityId;

        // Resolve or create city if only cityName is provided
        if (!cityId && cityName) {
            let city = await findCityByNameAndCountry(cityName, country);
            if (!city) {
                city = await createCity({
                    name: cityName.trim(),
                    country: country.trim(),
                    region: region || null,
                });
            }
            cityId = city.id;
        }

        if (!cityId) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'A valid cityId or cityName is required.',
                success: false,
            });
        }

        // Verify city exists
        const cityObj = await getCityById(cityId);
        if (!cityObj) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Selected city does not exist in catalog.',
                success: false,
            });
        }

        const stopStart = startDate || arrivalDate;
        const stopEnd = endDate || departureDate;

        // Relational date boundary checks:
        // trip.startDate <= stop.arrivalDate <= stop.departureDate <= trip.endDate
        if (new Date(stopStart) < new Date(trip.startDate)) {
            return sendResponse({
                res,
                statusCode: 400,
                message: `Stop arrival date (${stopStart}) cannot be earlier than trip start date (${trip.startDate}).`,
                success: false,
            });
        }

        if (new Date(stopEnd) > new Date(trip.endDate)) {
            return sendResponse({
                res,
                statusCode: 400,
                message: `Stop departure date (${stopEnd}) cannot be later than trip end date (${trip.endDate}).`,
                success: false,
            });
        }

        if (new Date(stopEnd) < new Date(stopStart)) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'Stop departure date must be on or after arrival date.',
                success: false,
            });
        }

        const newStop = await createStopDao({
            tripId,
            cityId,
            startDate: stopStart,
            endDate: stopEnd,
            sequenceOrder: sequenceOrder ? parseInt(sequenceOrder, 10) : undefined,
        });

        // If accommodation cost provided, log initial expense item
        if (accommodationCost && parseFloat(accommodationCost) > 0) {
            await createTripCostItem({
                tripId,
                tripStopId: newStop.id,
                category: 'stay',
                description: `${cityObj.name} - Lodging / Stay`,
                amount: parseFloat(accommodationCost).toString(),
                currency: trip.budgetCurrency || 'INR',
                costDate: stopStart,
            });
        }

        // If transport cost provided, log initial transit expense item
        if (transportCost && parseFloat(transportCost) > 0) {
            await createTripCostItem({
                tripId,
                tripStopId: newStop.id,
                category: 'transport',
                description: `Transit to ${cityObj.name}`,
                amount: parseFloat(transportCost).toString(),
                currency: trip.budgetCurrency || 'INR',
                costDate: stopStart,
            });
        }

        const hydratedStop = await getStopById(newStop.id);

        return sendResponse({
            res,
            statusCode: 201,
            message: 'Stop added to trip itinerary successfully.',
            success: true,
            stop: {
                ...hydratedStop,
                arrivalDate: hydratedStop.startDate,
                departureDate: hydratedStop.endDate,
                notes: notes || null,
            },
        });
    } catch (error) {
        console.error('createStop error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to add stop to itinerary.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * GET /api/trips/:tripId/stops
 * Fetch stops ordered by sequenceOrder
 */
export async function listStops(req, res) {
    try {
        const tripId = req.params.tripId;
        const stops = await getStopsByTripId(tripId);

        const formattedStops = stops.map((s) => ({
            ...s,
            arrivalDate: s.startDate,
            departureDate: s.endDate,
            orderIndex: s.sequenceOrder,
        }));

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Stops fetched successfully.',
            success: true,
            stops: formattedStops,
        });
    } catch (error) {
        console.error('listStops error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to fetch trip stops.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * GET /api/trips/:tripId/stops/:stopId
 * Fetch single stop details
 */
export async function getStop(req, res) {
    try {
        const stopId = req.params.stopId;
        const stop = await getStopById(stopId);

        if (!stop || stop.tripId !== req.params.tripId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Stop not found in this trip.',
                success: false,
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Stop details retrieved successfully.',
            success: true,
            stop: {
                ...stop,
                arrivalDate: stop.startDate,
                departureDate: stop.endDate,
                orderIndex: stop.sequenceOrder,
            },
        });
    } catch (error) {
        console.error('getStop error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to fetch stop details.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * PATCH /api/trips/:tripId/stops/:stopId
 * Update stop dates / notes / expenses
 */
export async function updateStop(req, res) {
    try {
        const { tripId, stopId } = req.params;
        const trip = req.trip || (await getTripById(tripId));
        const currentStop = await getStopById(stopId);

        if (!currentStop || currentStop.tripId !== tripId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Stop not found in this trip.',
                success: false,
            });
        }

        const updates = {};
        const stopStart = req.body.startDate || req.body.arrivalDate || currentStop.startDate;
        const stopEnd = req.body.endDate || req.body.departureDate || currentStop.endDate;

        if (req.body.startDate || req.body.arrivalDate) updates.startDate = stopStart;
        if (req.body.endDate || req.body.departureDate) updates.endDate = stopEnd;
        if (req.body.cityId) updates.cityId = req.body.cityId;

        // Date bounds check
        if (trip) {
            if (new Date(stopStart) < new Date(trip.startDate)) {
                return sendResponse({
                    res,
                    statusCode: 400,
                    message: `Stop arrival date (${stopStart}) cannot be earlier than trip start date (${trip.startDate}).`,
                    success: false,
                });
            }

            if (new Date(stopEnd) > new Date(trip.endDate)) {
                return sendResponse({
                    res,
                    statusCode: 400,
                    message: `Stop departure date (${stopEnd}) cannot be later than trip end date (${trip.endDate}).`,
                    success: false,
                });
            }
        }

        if (new Date(stopEnd) < new Date(stopStart)) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'Stop departure date must be on or after arrival date.',
                success: false,
            });
        }

        const updated = await updateStopDao(stopId, tripId, updates);
        const hydrated = await getStopById(stopId);

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Stop updated successfully.',
            success: true,
            stop: {
                ...hydrated,
                arrivalDate: hydrated.startDate,
                departureDate: hydrated.endDate,
                orderIndex: hydrated.sequenceOrder,
            },
        });
    } catch (error) {
        console.error('updateStop error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to update stop.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * DELETE /api/trips/:tripId/stops/:stopId
 * Delete stop
 */
export async function deleteStop(req, res) {
    try {
        const { tripId, stopId } = req.params;
        const deleted = await deleteStopDao(stopId, tripId);

        if (!deleted) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Stop not found in this trip.',
                success: false,
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Stop removed from itinerary successfully.',
            success: true,
        });
    } catch (error) {
        console.error('deleteStop error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to delete stop.',
            success: false,
            error: error.message,
        });
    }
}

/**
 * PATCH /api/trips/:tripId/stops/reorder
 * Batch update sequence order for stops
 */
export async function reorderStops(req, res) {
    try {
        const tripId = req.params.tripId;
        const { stops, stopIds } = req.body;

        let stopOrders = [];
        if (Array.isArray(stops)) {
            stopOrders = stops.map((item, idx) => ({
                id: item.id,
                sequenceOrder:
                    item.sequenceOrder !== undefined
                        ? parseInt(item.sequenceOrder, 10)
                        : item.orderIndex !== undefined
                          ? parseInt(item.orderIndex, 10)
                          : idx + 1,
            }));
        } else if (Array.isArray(stopIds)) {
            stopOrders = stopIds.map((id, idx) => ({
                id,
                sequenceOrder: idx + 1,
            }));
        }

        if (stopOrders.length === 0) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'No stops provided to reorder.',
                success: false,
            });
        }

        await reorderStopsDao(tripId, stopOrders);
        const updatedStops = await getStopsByTripId(tripId);

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Stops sequence reordered successfully.',
            success: true,
            stops: updatedStops.map((s) => ({
                ...s,
                arrivalDate: s.startDate,
                departureDate: s.endDate,
                orderIndex: s.sequenceOrder,
            })),
        });
    } catch (error) {
        console.error('reorderStops error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            message: 'Failed to reorder stops.',
            success: false,
            error: error.message,
        });
    }
}
