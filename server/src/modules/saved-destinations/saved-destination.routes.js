import express from 'express';
import { protect } from '../auth/middleware/auth.middleware.js';
import {
    listSavedDestinations,
    saveDestination,
    removeSavedDestination,
} from './saved-destination.controller.js';
import { saveDestinationValidator } from './saved-destination.validator.js';

const router = express.Router();

// Require authentication for all bookmark endpoints
router.use(protect);

router.get('/', listSavedDestinations);
router.post('/', saveDestinationValidator, saveDestination);
router.delete('/:cityId', removeSavedDestination);

export default router;
