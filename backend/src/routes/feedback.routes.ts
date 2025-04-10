import { Router } from "express";
import {
  getFeedbackHandler,
  sendFeedbackHandler,
} from "../controllers/feedback.controller";

const router = Router();

router.get("", getFeedbackHandler);
router.post("", sendFeedbackHandler);

export default router;
