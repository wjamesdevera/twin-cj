import { Router } from "express";
import { getCabinsHandler } from "../controllers/service.controller";

const router = Router();

// Content Endpoint
router.get("/cabins", getCabinsHandler);

export default router;
