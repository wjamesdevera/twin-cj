import { Router } from "express";
import { createCabinHandler, deleteAdditionalFeeHandler, deleteAllCabinsHandler, deleteCabinHandler, deleteSelectedCabinsHandler, getAllAdditionalFeesHandler, getAllCabinsHandler, getCabinHandler, updateCabinHandler } from "../controllers/service.controller";

const router = Router();

// Cabin Endpoint
router.get("/cabins/:id", getCabinHandler);
router.get("/cabins", getAllCabinsHandler);
router.post("/cabins", createCabinHandler);
router.delete("/cabins/:id", deleteCabinHandler);
router.delete("/cabins", deleteAllCabinsHandler);
router.post("/cabins/bulk-delete", deleteSelectedCabinsHandler);
router.put("/cabins/:id", updateCabinHandler);

// Additional Fee Endpoint
router.get("/additional-fees", getAllAdditionalFeesHandler);
router.delete("/additional-fees/:type", deleteAdditionalFeeHandler);

export default router;
