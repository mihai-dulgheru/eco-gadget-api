import { Router } from 'express';
import multer from 'multer';
import { usersController } from '../controllers';
import { asyncWrapper, authenticate, authorize } from '../middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.all('*', authenticate, authorize('user'));

router.delete('/', asyncWrapper(usersController.deleteUser));
router.get('/ai-settings', asyncWrapper(usersController.getAISettings));
router.get('/personal-info', asyncWrapper(usersController.getPersonalInfo));
router.patch(
  '/',
  upload.single('profilePicture'),
  asyncWrapper(usersController.updateUser)
);
router.put('/ai-settings', asyncWrapper(usersController.updateAISettings));
router.put('/name', asyncWrapper(usersController.updateName));
router.put('/phone', asyncWrapper(usersController.updatePhone));

export default router;
