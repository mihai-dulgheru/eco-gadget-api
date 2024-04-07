import { Router } from 'express';
import { tanksController } from '../controllers';
import { asyncWrapper } from '../utils';

const router = Router();

router.get('/', asyncWrapper(tanksController.findAllTanks));
router.get('/:id', asyncWrapper(tanksController.findTankById));
router.post('/', asyncWrapper(tanksController.createTank));
router.put('/:id', asyncWrapper(tanksController.updateTank));
router.delete('/:id', asyncWrapper(tanksController.deleteTank));

export default router;
