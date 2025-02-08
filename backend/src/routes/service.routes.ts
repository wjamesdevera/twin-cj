import { Router } from "express";
import {
  createDayTourHandler,
  getAllDayToursHandler,
  getDayTourByIdHandler,
  deleteDayTourHandler,
} from "../controllers/service.controller";

const router = Router();

router.post("/day-tour/create", createDayTourHandler);
router.get("/day-tours", getAllDayToursHandler);
router.get("/day-tour/:id", getDayTourByIdHandler);
router.delete("/day-tour/delete/:id", deleteDayTourHandler);

export default router;
