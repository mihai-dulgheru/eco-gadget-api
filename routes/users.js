import { Router } from 'express';
import multer from 'multer';
import { usersController } from '../controllers';
import { asyncWrapper, authenticate, authorize } from '../middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.all('*', authenticate, authorize('user'));

router.delete('/', asyncWrapper(usersController.deleteUser));
router.get('/personal-info', asyncWrapper(usersController.getPersonalInfo));
router.patch(
  '/',
  upload.single('profilePicture'),
  asyncWrapper(usersController.updateUser)
);
router.put('/name', asyncWrapper(usersController.updateName));

export default router;
