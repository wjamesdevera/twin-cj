import { Router } from "express";
import { upload } from "../middlewares/upload";
import { createBookingHandler } from "../controllers/booking.controller";

const router = Router();

router.post("/", upload.single("proofOfPayment"), createBookingHandler);

export default router;
