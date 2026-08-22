import { Router } from 'express';
import { getDashboard } from '../controllers/dashboard.controller.js';
import { protect } from '../../auth/middleware/auth.middleware.js';

const router = Router();

// Secure dashboard route
router.get('/', protect, getDashboard);

export default router;
