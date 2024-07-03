import { Router } from 'express';
import multer from 'multer';
import { adminController } from '../controllers';
import {
  asyncWrapper,
  authenticate,
  authorize,
  convertFormDataToJson,
} from '../middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate, authorize('admin'));

// User routes
router.get('/users', asyncWrapper(adminController.getUsers));
router.get('/users/:id', asyncWrapper(adminController.getUserById));
router.post('/users', asyncWrapper(adminController.addUser));
router.put('/users/:id', asyncWrapper(adminController.updateUser));
router.delete('/users/:id', asyncWrapper(adminController.deleteUser));

// Recycling Manager routes
router.get(
  '/recycling-managers',
  asyncWrapper(adminController.getRecyclingManagers)
);
router.get(
  '/recycling-managers/:id',
  asyncWrapper(adminController.getRecyclingManagerById)
);
router.post(
  '/recycling-managers',
  asyncWrapper(adminController.addRecyclingManager)
);
router.put(
  '/recycling-managers/:id',
  asyncWrapper(adminController.updateRecyclingManager)
);
router.delete(
  '/recycling-managers/:id',
  asyncWrapper(adminController.deleteRecyclingManager)
);

// Recycling Info routes
router.get('/recycling-info', asyncWrapper(adminController.getRecyclingInfos));
router.get(
  '/recycling-info/:id',
  asyncWrapper(adminController.getRecyclingInfoById)
);
router.post(
  '/recycling-info',
  upload.single('picture'),
  convertFormDataToJson,
  asyncWrapper(adminController.addRecyclingInfo)
);
router.put(
  '/recycling-info/:id',
  upload.single('picture'),
  convertFormDataToJson,
  asyncWrapper(adminController.updateRecyclingInfo)
);
router.delete(
  '/recycling-info/:id',
  asyncWrapper(adminController.deleteRecyclingInfo)
);

export default router;
