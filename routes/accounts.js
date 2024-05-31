import { Router } from 'express';
import multer from 'multer';
import { accountsController } from '../controllers';
import { asyncWrapper, authenticate } from '../middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get(
  '/lookup',
  authenticate,
  asyncWrapper(accountsController.getAccountInfo)
);
router.post(
  '/sign-in-with-password',
  asyncWrapper(accountsController.signInWithPassword)
);
router.post(
  '/sign-up',
  upload.single('profilePicture'),
  asyncWrapper(accountsController.signUp)
);

export default router;
