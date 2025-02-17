import { Router, Request, Response } from "express";
import {
  changePasswordHandler,
  forgotPasswordHandler,
  loginHandler,
  logoutHandler,
  passwordResetHandler,
  refreshHandler,
  registerHandler,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Register Endpoint
router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/refresh", refreshHandler);
router.get("/logout", logoutHandler);
router.post("/password/forgot", forgotPasswordHandler);
router.post("/password/reset", passwordResetHandler);
router.post("/password/change", authenticate, changePasswordHandler);

export default router;
