import { Router } from 'express';
import multer from 'multer';
import { recyclingManagerController } from '../controllers';
import {
  asyncWrapper,
  authenticate,
  authorize,
  convertFormDataToJson,
} from '../middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate, authorize('recycling_manager'));

router.get(
  '/statistics',
  asyncWrapper(recyclingManagerController.getStatistics)
);
router.get(
  '/recycling-locations',
  asyncWrapper(recyclingManagerController.getRecyclingLocations)
);
router.get(
  '/recycling-locations/:id',
  asyncWrapper(recyclingManagerController.getRecyclingLocationById)
);
router.post(
  '/recycling-locations',
  upload.single('image'),
  convertFormDataToJson,
  asyncWrapper(recyclingManagerController.addRecyclingLocation)
);
router.put(
  '/recycling-locations/:id',
  upload.single('image'),
  convertFormDataToJson,
  asyncWrapper(recyclingManagerController.updateRecyclingLocation)
);
router.delete(
  '/recycling-locations/:id',
  asyncWrapper(recyclingManagerController.deleteRecyclingLocation)
);
router.get('/messages', asyncWrapper(recyclingManagerController.getMessages));
router.post(
  '/messages/:messageId/mark-as-read',
  asyncWrapper(recyclingManagerController.markMessageAsRead)
);
router.post(
  '/messages/:messageId/response',
  asyncWrapper(recyclingManagerController.respondToMessage)
);

export default router;
