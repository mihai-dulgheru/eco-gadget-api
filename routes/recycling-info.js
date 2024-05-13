import { Router } from 'express';
import { recyclingInfoController } from '../controllers';
import { asyncWrapper, authenticate, authorize } from '../middleware';

const router = Router();

router.get('/', asyncWrapper(recyclingInfoController.getRecyclingInfos));
router.get('/:id', asyncWrapper(recyclingInfoController.getRecyclingInfoById));
router.post(
  '/',
  authenticate,
  authorize('admin'),
  asyncWrapper(recyclingInfoController.addRecyclingInfo)
);
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncWrapper(recyclingInfoController.updateRecyclingInfo)
);
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncWrapper(recyclingInfoController.deleteRecyclingInfo)
);

export default router;
