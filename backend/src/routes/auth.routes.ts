import { Router, Request, Response } from "express";
import {
  forgotPasswordHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
} from "../controllers/auth.controller";

const router = Router();

// Register Endpoint
router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/refresh", refreshHandler);
router.get("/logout", logoutHandler);
router.post("/password/forgot", forgotPasswordHandler);

export default router;
