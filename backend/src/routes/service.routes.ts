import { Router } from "express";
import { createCabinHandler, getCabinsHandler } from "../controllers/service.controller";

const router = Router();

// Content Endpoint
router.get("/cabins", getCabinsHandler);
router.post("/cabins", createCabinHandler);

export default router;
