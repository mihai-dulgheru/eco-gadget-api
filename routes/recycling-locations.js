import { Router } from 'express';
import { recyclingLocationsController } from '../controllers';
import { asyncWrapper } from '../utils';

const router = Router();

router.get(
  '/',
  asyncWrapper(recyclingLocationsController.getRecyclingLocations)
);

export default router;
