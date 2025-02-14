import { Router } from 'express';
import multer from 'multer';
import {
  createDayTourHandler,
  getAllDayToursHandler,
  getDayTourByIdHandler,
  deleteDayTourHandler,
  updateDayTourHandler,
} from '../controllers/service.controller';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/day-tour', upload.single('image'), createDayTourHandler);
router.get('/day-tours', getAllDayToursHandler);
router.get('/day-tour/:id', getDayTourByIdHandler);
router.patch('/day-tour/:id', upload.single('image'), updateDayTourHandler);
router.delete('/day-tour/:id', deleteDayTourHandler);

export default router;
