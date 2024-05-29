import { Router } from 'express';
import { recyclingManagerController } from '../controllers';
import { asyncWrapper, authenticate, authorize } from '../middleware';

const router = Router();

router.use(authenticate, authorize('recycling_manager'));

router.get(
  '/statistics',
  asyncWrapper(recyclingManagerController.getStatistics)
);
router.get(
  '/recycling-locations',
  asyncWrapper(recyclingManagerController.getRecyclingLocations)
);
router.get('/messages', asyncWrapper(recyclingManagerController.getMessages));

export default router;
