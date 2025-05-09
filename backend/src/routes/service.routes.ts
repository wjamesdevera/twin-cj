import { Router } from "express";
import {
  createCabinHandler,
  createDayTourHandler,
  deleteCabinHandler,
  deleteDayTourHandler,
  deleteSelectedCabinsHandler,
  deleteSelectedDayToursHandler,
  getAllCabinsHandler,
  getAllDayToursHandler,
  getCabinByIdHandler,
  getDayTourByIdHandler,
  updateCabinHandler,
  updateDayTourHandler,
} from "../controllers/service.controller";
import { upload } from "../middlewares/upload";

const router = Router();

// Cabin Endpoint
router.get("/cabins/:id", getCabinByIdHandler);
router.get("/cabins", getAllCabinsHandler);
router.post("/cabins", upload.single("file"), createCabinHandler);
router.put("/cabins/:id", upload.single("file"), updateCabinHandler);
router.delete("/cabins/:id", deleteCabinHandler);
router.delete("/cabins", deleteSelectedCabinsHandler);
// Day Tour End point
router.post("/day-tours", upload.single("file"), createDayTourHandler);
router.get("/day-tours", getAllDayToursHandler);
router.get("/day-tours/:id", getDayTourByIdHandler);
router.put("/day-tours/:id", upload.single("file"), updateDayTourHandler);
router.delete("/day-tours/:id", deleteDayTourHandler);
router.delete("/day-tours/", deleteSelectedDayToursHandler);

export default router;
