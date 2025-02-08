import { Router } from "express";
import { createCabinHandler, deleteAllCabinsHandler, deleteCabinHandler, getAllCabinsHandler, getCabinHandler, updateCabinHandler } from "../controllers/service.controller";

const router = Router();

// Content Endpoint
router.get("/cabins/:id", getCabinHandler);
router.get("/cabins", getAllCabinsHandler);
router.post("/cabins", createCabinHandler);
router.delete("/cabins/:id", deleteCabinHandler);
router.delete("/cabins", deleteAllCabinsHandler);
router.put("/cabins/:id", updateCabinHandler);

export default router;
