import { Router } from "express";
import { upload } from "../middlewares/upload";
import {
  checkAvailabilityHandler,
  createBookingHandler,
  getBookingHandler,
  getLatestBookingsHandler,
  viewBookingsHandler,
  createWalkInBookingHandler,
  updateBookingHandler,
  getBookingByReferenceCode,
} from "../controllers/booking.controller";

const router = Router();

router.post("/", upload.single("file"), createBookingHandler);
router.get("/", getBookingHandler);
router.get("/check-availability", checkAvailabilityHandler);
router.get("/latest-bookings", getLatestBookingsHandler);
router.get("/monthly", getLatestBookingsHandler);

// Admin Side
router.get("/view-bookings", viewBookingsHandler);
router.post("/walk-in", upload.single("file"), createWalkInBookingHandler);
router.get("/:referenceCode", getBookingByReferenceCode);
router.put("/:id", updateBookingHandler);

export default router;
