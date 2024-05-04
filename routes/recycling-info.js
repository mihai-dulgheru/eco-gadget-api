import { Router } from 'express';
import { recyclingInfoController } from '../controllers';
import { asyncWrapper } from '../utils';

const router = Router();

router.get('/', asyncWrapper(recyclingInfoController.getRecyclingInfo));

export default router;
