import { Router } from 'express';
import { accountsController } from '../controllers';
import { asyncWrapper } from '../utils';

const router = Router();

router.post('/sign-up', asyncWrapper(accountsController.signUp));
router.post(
  '/sign-in-with-password',
  asyncWrapper(accountsController.signInWithPassword)
);

export default router;
