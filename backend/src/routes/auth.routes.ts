import { Router, Request, Response } from "express";
import { RegisterUser } from "../controllers/auth.controller";

const router = Router();

// Register Endpoint
router.post("/register", RegisterUser);

export default router;
