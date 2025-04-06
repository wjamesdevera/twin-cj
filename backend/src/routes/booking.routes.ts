import { Router } from "express";
import { upload } from "../middlewares/upload";
import {
  checkAvailabilityHandler,
  createBookingHandler,
  getBookingHandler,
  getLatestBookingsHandler,
  getMonthlyBookingsHandler,
  getYearlyBookingsHandler,
  viewBookingsHandler,
  createWalkInBookingHandler,
  getBookingByIdHandler,
  getBookingStatusesHandler,
  getBookingStatusHandler,
  updateBookingDateHandler,
  updateBookingStatusHandler,
} from "../controllers/booking.controller";
import { getMonthlyBookings } from "../services/booking.service";

const router = Router();

router.post("/", upload.single("file"), createBookingHandler);
router.get("/", getBookingHandler);
router.get("/check-availability", checkAvailabilityHandler);
router.get("/latest-bookings", getLatestBookingsHandler);
router.get("/monthly", getMonthlyBookingsHandler);
router.get("/yearly", getYearlyBookingsHandler);

// Admin Side
router.get("/view-bookings", viewBookingsHandler);
router.post(
  "/walk-in",
  upload.single("proofOfPayment"),
  createWalkInBookingHandler
);
router.get("/status/:referenceCode", getBookingStatusHandler);
router.get("/statuses", getBookingStatusesHandler);
router.get("/:referenceCode", getBookingByIdHandler);
router.patch("/status/:id", updateBookingStatusHandler);

router.patch("/dates/:referenceCode", updateBookingDateHandler);

export default router;
