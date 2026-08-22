import { Router } from 'express';
import * as adminController from '../../../controllers/admin.controller.js';
import * as analyticsController from '../../../controllers/analytics.controller.js';
import * as userController from '../controllers/user.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { adminUpdateRoleValidator, adminUpdateStatusValidator } from '../validators/user.validator.js';

const router = Router();

// Protect all admin routes
router.use(protect);
router.use(restrictTo('admin'));

// Admin User Management Routes (Section 17)
router.get('/users', adminController.adminListUsers);
router.get('/users/:userId', adminController.adminGetUserById);
router.patch('/users/:userId/status', adminUpdateStatusValidator, adminController.adminUpdateUserStatus);
router.post('/users/cleanup', adminController.adminCleanupUsers);
router.patch('/users/:id/role', adminUpdateRoleValidator, userController.adminUpdateRole);
router.delete('/users/:id', userController.adminDeleteUser);

// Admin Analytics Route (Section 17)
router.get('/analytics', analyticsController.getAdminAnalytics);

export default router;

