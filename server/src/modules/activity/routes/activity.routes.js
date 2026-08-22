import { Router } from 'express';
import * as activityController from '../controllers/activity.controller.js';
import { listActivitiesValidator, getActivityValidator } from '../validators/activity.validator.js';

const router = Router();

router.get('/', listActivitiesValidator, activityController.getActivities);
router.get('/:activityId', getActivityValidator, activityController.getActivity);

export default router;
