import { Router } from 'express';
import { recyclingLocationsController } from '../controllers';
import { asyncWrapper } from '../middleware';

const router = Router();

router.get(
  '/',
  asyncWrapper(recyclingLocationsController.getRecyclingLocations)
);
router.get(
  '/search',
  asyncWrapper(recyclingLocationsController.searchRecyclingLocations)
);
router.get(
  '/:id',
  asyncWrapper(recyclingLocationsController.getRecyclingLocationById)
);

export default router;
