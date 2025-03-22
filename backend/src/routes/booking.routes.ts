import { Router } from "express";
import { upload } from "../middlewares/upload";
import {
  checkAvailabilityHandler,
  createBookingHandler,
  getBookingHandler,
  getLatestBookingsHandler,
} from "../controllers/booking.controller";

const router = Router();

router.post("/", upload.single("file"), createBookingHandler);
router.get("/", getBookingHandler);
router.get("/check-availability", checkAvailabilityHandler);
router.get("/latest-bookings", getLatestBookingsHandler);

export default router;
