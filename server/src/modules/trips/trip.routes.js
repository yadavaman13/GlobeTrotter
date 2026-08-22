import express from 'express';
import { protect } from '../auth/middleware/auth.middleware.js';
import { verifyTripOwner, verifyTripAccess } from './middleware/trip-access.middleware.js';

// Validators
import {
    createTripValidator,
    updateTripValidator,
    tripStatusValidator,
    tripVisibilityValidator,
    createStopValidator,
    updateStopValidator,
    reorderStopsValidator,
    createActivityValidator,
    updateActivityValidator,
    reorderActivitiesValidator,
    createCostValidator,
    updateCostValidator,
} from './trip.validator.js';

// Controllers
import {
    createTrip,
    listTrips,
    getTrip,
    updateTrip,
    deleteTrip,
    updateTripStatus,
    updateTripVisibility,
} from './trip.controller.js';

import {
    createStop,
    listStops,
    getStop,
    updateStop,
    deleteStop,
    reorderStops,
} from './trip-stop.controller.js';

import {
    createActivity,
    listActivities,
    updateActivity,
    deleteActivity,
    reorderActivities,
} from './trip-stop-activity.controller.js';

import {
    createCost,
    listCosts,
    getBudgetSummary,
    updateCost,
    deleteCost,
} from './trip-cost.controller.js';

const router = express.Router();

// Require authentication for all trip management endpoints
router.use(protect);

// ----------------------------------------------------
// MODULE 6: CORE TRIP MANAGEMENT
// ----------------------------------------------------

router.post('/', createTripValidator, createTrip);
router.get('/', listTrips);
router.get('/:tripId', verifyTripAccess, getTrip);
router.patch('/:tripId', verifyTripOwner, updateTripValidator, updateTrip);
router.delete('/:tripId', verifyTripOwner, deleteTrip);
router.patch('/:tripId/status', verifyTripOwner, tripStatusValidator, updateTripStatus);
router.patch('/:tripId/visibility', verifyTripOwner, tripVisibilityValidator, updateTripVisibility);

// ----------------------------------------------------
// MODULE 7: TRIP STOPS / MULTI-CITY ITINERARY
// ----------------------------------------------------

router.post('/:tripId/stops', verifyTripOwner, createStopValidator, createStop);
router.get('/:tripId/stops', verifyTripAccess, listStops);
router.patch('/:tripId/stops/reorder', verifyTripOwner, reorderStopsValidator, reorderStops);
router.get('/:tripId/stops/:stopId', verifyTripAccess, getStop);
router.patch('/:tripId/stops/:stopId', verifyTripOwner, updateStopValidator, updateStop);
router.delete('/:tripId/stops/:stopId', verifyTripOwner, deleteStop);

// ----------------------------------------------------
// MODULE 8: TRIP STOP ACTIVITIES
// ----------------------------------------------------

router.post(
    '/:tripId/stops/:stopId/activities',
    verifyTripOwner,
    createActivityValidator,
    createActivity,
);
router.get('/:tripId/stops/:stopId/activities', verifyTripAccess, listActivities);
router.patch(
    '/:tripId/stops/:stopId/activities/reorder',
    verifyTripOwner,
    reorderActivitiesValidator,
    reorderActivities,
);
router.patch(
    '/:tripId/stops/:stopId/activities/:activityId',
    verifyTripOwner,
    updateActivityValidator,
    updateActivity,
);
router.delete('/:tripId/stops/:stopId/activities/:activityId', verifyTripOwner, deleteActivity);

// ----------------------------------------------------
// MODULE 9: TRIP BUDGET & COST MANAGEMENT
// ----------------------------------------------------

router.post('/:tripId/costs', verifyTripOwner, createCostValidator, createCost);
router.get('/:tripId/costs', verifyTripAccess, listCosts);
router.get('/:tripId/budget', verifyTripAccess, getBudgetSummary);
router.patch('/:tripId/costs/:costId', verifyTripOwner, updateCostValidator, updateCost);
router.delete('/:tripId/costs/:costId', verifyTripOwner, deleteCost);

export default router;
