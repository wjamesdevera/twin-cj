import { Router } from "express";
import { upload } from "../middlewares/upload";
import {
  checkAvailabilityHandler,
  createBookingHandler,
  getBookingHandler,
} from "../controllers/booking.controller";

const router = Router();

router.get("/", getBookingHandler);
router.post("/", upload.single("file"), createBookingHandler);
router.get("/check-availability", checkAvailabilityHandler);

export default router;
