import { Router } from "express";
import { upload } from "../middlewares/upload";
import {
  createBookingHandler,
  getBookingHandler,
} from "../controllers/booking.controller";

const router = Router();

router.get("/", getBookingHandler);
router.post("/", upload.single("file"), createBookingHandler);

export default router;
