import express from 'express';
import { getPublicTrip } from './public-trip.controller.js';

const router = express.Router();

// Publicly accessible shared itinerary endpoint (no auth required)
router.get('/trips/:slug', getPublicTrip);

export default router;
