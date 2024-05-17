import { Router } from 'express';
import { recyclingLocationsController } from '../controllers';
import { asyncWrapper, authenticate, authorize } from '../middleware';

const router = Router();

router.get(
  '/',
  asyncWrapper(recyclingLocationsController.getRecyclingLocations)
);
router.get(
  '/:id',
  asyncWrapper(recyclingLocationsController.getRecyclingLocationById)
);
router.post(
  '/',
  authenticate,
  authorize('recycling_manager'),
  asyncWrapper(recyclingLocationsController.addRecyclingLocation)
);
router.put(
  '/:id',
  authenticate,
  authorize('recycling_manager'),
  asyncWrapper(recyclingLocationsController.updateRecyclingLocation)
);
router.delete(
  '/:id',
  authenticate,
  authorize('recycling_manager'),
  asyncWrapper(recyclingLocationsController.deleteRecyclingLocation)
);

export default router;
