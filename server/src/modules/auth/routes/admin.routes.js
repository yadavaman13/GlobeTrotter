import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { adminUpdateRoleValidator } from '../validators/user.validator.js';

const router = Router();

// Protect all admin routes
router.use(protect);
router.use(restrictTo('admin'));

// Admin User Management Routes
router.get('/users', userController.adminListUsers);
router.post('/users/cleanup', userController.adminCleanupUsers);
router.get('/users/:id', userController.adminGetUserById);
router.patch('/users/:id/role', adminUpdateRoleValidator, userController.adminUpdateRole);
router.delete('/users/:id', userController.adminDeleteUser);

export default router;
