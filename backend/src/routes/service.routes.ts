import { Router } from 'express';
import {
  createDayTourHandler,
  getAllDayToursHandler,
  getDayTourByIdHandler,
  deleteDayTourHandler,
  updateDayTourHandler,
} from '../controllers/service.controller';

const router = Router();

router.post('/day-tour', createDayTourHandler);
router.get('/day-tours', getAllDayToursHandler);
router.get('/day-tour/:id', getDayTourByIdHandler);
router.patch('/day-tour/:id', updateDayTourHandler);
router.delete('/day-tour/:id', deleteDayTourHandler);

export default router;
