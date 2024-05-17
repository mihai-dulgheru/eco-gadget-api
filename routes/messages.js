import { Router } from 'express';
import { messagesController } from '../controllers';
import { asyncWrapper, authenticate, authorize } from '../middleware';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('recycling_manager'),
  asyncWrapper(messagesController.getMessages)
);
router.get(
  '/:id',
  authenticate,
  authorize('recycling_manager'),
  asyncWrapper(messagesController.getMessageById)
);
router.post('/', asyncWrapper(messagesController.addMessage));
router.put(
  '/:id',
  authenticate,
  authorize('recycling_manager'),
  asyncWrapper(messagesController.updateMessage)
);
router.delete(
  '/:id',
  authenticate,
  authorize('recycling_manager'),
  asyncWrapper(messagesController.deleteMessage)
);

export default router;
