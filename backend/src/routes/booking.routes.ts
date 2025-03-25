import { Router } from "express";
import { upload } from "../middlewares/upload";
import {
  checkAvailabilityHandler,
  createBookingHandler,
  getBookingHandler,
  getLatestBookingsHandler,
  viewBookingsHandler,
} from "../controllers/booking.controller";
import { getMonthlyBookings } from "../services/booking.service";

const router = Router();

router.post("/", upload.single("file"), createBookingHandler);
router.get("/", getBookingHandler);
router.get("/check-availability", checkAvailabilityHandler);
router.get("/latest-bookings", getLatestBookingsHandler);
router.get("/monthly", getMonthlyBookings);

// Admin Side
router.get("/view-bookings", viewBookingsHandler);

export default router;
