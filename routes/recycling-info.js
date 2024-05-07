import { Router } from 'express';
import { recyclingInfoController } from '../controllers';
import { asyncWrapper } from '../middleware';

const router = Router();

router.get('/', asyncWrapper(recyclingInfoController.getRecyclingInfo));

export default router;
