import { Router } from 'express';
import multer from 'multer';
import { usersController } from '../controllers';
import { asyncWrapper, authenticate, authorize } from '../middleware';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.all('*', authenticate, authorize('user'));

router.patch(
  '/',
  upload.single('profilePicture'),
  asyncWrapper(usersController.updateUser)
);
router.delete('/', asyncWrapper(usersController.deleteUser));

export default router;
