import { Router } from "express";
import {
  createDayTourHandler,
  getAllDayToursHandler,
  getDayTourByIdHandler,
  deleteDayTourHandler,
  updateDayTourHandler,
} from "../controllers/service.controller";

const router = Router();

router.post("/day-tour/create", createDayTourHandler);
router.get("/day-tours", getAllDayToursHandler);
router.get("/day-tour/:id", getDayTourByIdHandler);
router.patch("/day-tour/update/:id", updateDayTourHandler);
router.delete("/day-tour/delete/:id", deleteDayTourHandler);

export default router;
