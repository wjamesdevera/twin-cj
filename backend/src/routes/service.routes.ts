import { Router } from "express";
import {
  createCabinHandler,
  deleteAllCabinsHandler,
  deleteCabinHandler,
  deleteSelectedCabinsHandler,
  getAllCabinsHandler,
  getCabinHandler,
  updateCabinHandler,
} from "../controllers/service.controller";
import { upload } from "../middlewares/upload";

const router = Router();

// Cabin Endpoint
router.get("/cabins/:id", getCabinHandler);
router.get("/cabins", getAllCabinsHandler);
router.post("/cabins", upload.single("image"), createCabinHandler);
router.delete("/cabins/:id", deleteCabinHandler);
router.delete("/cabins", deleteAllCabinsHandler);
router.post("/cabins/bulk-delete", deleteSelectedCabinsHandler);
router.put("/cabins/:id", updateCabinHandler);

export default router;
