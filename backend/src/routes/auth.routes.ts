import { Router, Request, Response } from "express";
import { registerHandler } from "../controllers/auth.controller";

const router = Router();

// Register Endpoint
router.post("/register", registerHandler);

export default router;
