import { Router } from "express";
import {
  getFeedbackHandler,
  sendFeedbackHandler,
  updateFeedbackHandler,
} from "../controllers/feedback.controller";

const router = Router();

router.get("", getFeedbackHandler);
router.post("", sendFeedbackHandler);
router.patch("/:id", updateFeedbackHandler);

export default router;
