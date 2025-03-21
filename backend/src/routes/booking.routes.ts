import { Router } from "express";
import { upload } from "../middlewares/upload";
import {
  // checkAvailabilityHandler,
  createBookingHandler,
  getBookingHandler,
  getBookingStatusHandler,
  reuploadPaymentImageHandler,
} from "../controllers/booking.controller";

const router = Router();

router.get("/", getBookingHandler);
router.post("/", upload.single("file"), createBookingHandler);
// router.post("/check-availability", checkAvailabilityHandler);
router.get("/status/:referenceCode", getBookingStatusHandler);
router.put("/status/:referenceCode", upload.single("file"), reuploadPaymentImageHandler);

export default router;
