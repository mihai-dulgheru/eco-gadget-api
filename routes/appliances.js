import { Router } from 'express';
import { applianceController } from '../controllers';
import { asyncWrapper, authenticate, authorize } from '../middleware';

const router = Router();

router.all('*', authenticate, authorize('user'));

router.get('/', asyncWrapper(applianceController.getAppliances));
router.get('/:id', asyncWrapper(applianceController.getApplianceById));
router.post('/', asyncWrapper(applianceController.addAppliance));
router.put('/:id', asyncWrapper(applianceController.updateAppliance));
router.delete('/:id', asyncWrapper(applianceController.deleteAppliance));

export default router;
