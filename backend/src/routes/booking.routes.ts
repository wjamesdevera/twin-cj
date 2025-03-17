import { Router } from "express";
import { upload } from "../middlewares/upload";
import { getBookingHandler } from "../controllers/booking.controller";

const router = Router();

router.get("/", getBookingHandler);

export default router;
