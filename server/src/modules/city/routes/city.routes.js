import { Router } from 'express';
import * as cityController from '../controllers/city.controller.js';
import { listCitiesValidator, getCityValidator } from '../validators/city.validator.js';

const router = Router();

router.get('/', listCitiesValidator, cityController.getCities);
router.get('/:cityId', getCityValidator, cityController.getCity);
router.get('/:cityId/activities', getCityValidator, cityController.getCityActivities);

export default router;
