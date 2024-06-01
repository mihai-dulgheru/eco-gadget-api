import { Router } from 'express';
import multer from 'multer';
import { recyclingManagerController } from '../controllers';
import { asyncWrapper, authenticate, authorize } from '../middleware';

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
  asyncWrapper(recyclingManagerController.addRecyclingLocation)
);
router.patch(
  '/recycling-locations/multipart-upload',
  upload.single('file'),
  (req, res) => {
    // You can access other HTTP parameters. They are located in the body object.
    console.log('file: ', req.file);
    console.log('body: ', req.body);
    console.log('headers: ', req.headers);
    res.json({ message: 'File uploaded successfully' });
  }
);
router.put(
  '/recycling-locations/:id',
  upload.single('image'),
  asyncWrapper(recyclingManagerController.updateRecyclingLocation)
);
router.delete(
  '/recycling-locations/:id',
  asyncWrapper(recyclingManagerController.deleteRecyclingLocation)
);
router.get('/messages', asyncWrapper(recyclingManagerController.getMessages));

export default router;
