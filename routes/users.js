import { Router } from 'express';
import multer from 'multer';
import { usersController } from '../controllers';
import { asyncWrapper, authenticate, authorize } from '../middleware';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.patch(
  '/',
  authenticate,
  authorize('user'),
  upload.single('profilePicture'),
  asyncWrapper(usersController.updateUser)
);
router.delete(
  '/',
  authenticate,
  authorize('user'),
  asyncWrapper(usersController.deleteUser)
);

export default router;
