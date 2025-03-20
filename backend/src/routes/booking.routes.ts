import { Router } from "express";
import { upload } from "../middlewares/upload";
import {
  // checkAvailabilityHandler,
  createBookingHandler,
  getBookingHandler,
  getBookingStatusHandler,
} from "../controllers/booking.controller";

const router = Router();

router.get("/", getBookingHandler);
router.post("/", upload.single("file"), createBookingHandler);
// router.post("/check-availability", checkAvailabilityHandler);
router.get("/status/:referenceCode", getBookingStatusHandler);

export default router;
