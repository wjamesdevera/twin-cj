import { Router } from "express";
import { sendFeedbackHandler } from "../controllers/feedback.controller";

const router = Router();

router.post("", sendFeedbackHandler);

export default router;
