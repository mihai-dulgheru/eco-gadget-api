import { Router } from 'express';
import { applianceController } from '../controllers';
import { asyncWrapper, authenticate, authorize } from '../middleware';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('user'),
  asyncWrapper(applianceController.getAppliances)
);
router.get(
  '/:id',
  authenticate,
  authorize('user'),
  asyncWrapper(applianceController.getApplianceById)
);
router.post(
  '/',
  authenticate,
  authorize('user'),
  asyncWrapper(applianceController.addAppliance)
);
router.put(
  '/:id',
  authenticate,
  authorize('user'),
  asyncWrapper(applianceController.updateAppliance)
);
router.delete(
  '/:id',
  authenticate,
  authorize('user'),
  asyncWrapper(applianceController.deleteAppliance)
);

export default router;
