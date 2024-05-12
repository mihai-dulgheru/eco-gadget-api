import { Router } from 'express';
import { applianceController } from '../controllers';
import { asyncWrapper } from '../middleware';

const router = Router();

router.get('/', asyncWrapper(applianceController.getAppliances));
router.post('/', asyncWrapper(applianceController.addAppliance));
router.put('/:_id', asyncWrapper(applianceController.updateAppliance));
router.delete('/:_id', asyncWrapper(applianceController.deleteAppliance));

export default router;
