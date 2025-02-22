import { Router } from "express";
import { createCabinHandler, deleteAllCabinsHandler, deleteCabinHandler, deleteSelectedCabinsHandler, getAllCabinsHandler, getCabinHandler, updateCabinHandler } from "../controllers/service.controller";

const router = Router();

// Cabin Endpoint
router.get("/cabins/:id", getCabinHandler);
router.get("/cabins", getAllCabinsHandler);
router.post("/cabins", createCabinHandler);
router.delete("/cabins/:id", deleteCabinHandler);
router.delete("/cabins", deleteAllCabinsHandler);
router.post("/cabins/bulk-delete", deleteSelectedCabinsHandler);
router.put("/cabins/:id", updateCabinHandler);

export default router;
