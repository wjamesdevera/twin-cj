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
  getBookingByIdHandler,
} from "../controllers/booking.controller";
import { getBookingById } from "../services/booking.service";

const router = Router();

router.post("/", upload.single("file"), createBookingHandler);
router.get("/", getBookingHandler);
router.get("/check-availability", checkAvailabilityHandler);
router.get("/latest-bookings", getLatestBookingsHandler);
router.get("/monthly", getLatestBookingsHandler);

// Admin Side
router.get("/view-bookings", viewBookingsHandler);
router.post("/walk-in", upload.single("file"), createWalkInBookingHandler);
router.get("/:referenceCode", getBookingByIdHandler);
router.put("/:id", updateBookingHandler);

export default router;
