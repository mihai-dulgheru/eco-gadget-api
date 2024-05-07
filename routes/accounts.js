import { Router } from 'express';
import { accountsController } from '../controllers';
import { asyncWrapper, authenticate } from '../middleware';

const router = Router();

router.get(
  '/lookup',
  authenticate,
  asyncWrapper(accountsController.getAccountInfo)
);
router.post(
  '/sign-in-with-password',
  asyncWrapper(accountsController.signInWithPassword)
);
router.post('/sign-up', asyncWrapper(accountsController.signUp));

export default router;
