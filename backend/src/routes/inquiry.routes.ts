import { Router } from "express";
import { sendInquiryHandler } from "../controllers/inquiry.controller";

const router = Router();

router.post("", sendInquiryHandler);

export default router;
