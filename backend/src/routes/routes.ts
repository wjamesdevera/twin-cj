import { Router, Request, Response } from "express";
import { OK } from "../constants/http";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import inquiryRoutes from "./inquiry.routes";
import serviceRoutes from "./service.routes";
import sessionRoutes from "./session.routes";
import bookingRoutes from "./booking.routes";
import feedbackRoutes from "./feedback.routes"
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload";

const router = Router();

router.get("/health", (request: Request, response: Response) => {
  response.status(OK).json({
    status: "success",
    data: {
      message: "Hello World!",
    },
  });
});

router.use("/auth", authRoutes);
router.use("/sessions", sessionRoutes);
router.use("/users", authenticate, userRoutes);
router.use("/services", serviceRoutes);
router.use("/inquiry", inquiryRoutes);
router.use("/feedback", feedbackRoutes)
router.use("/services", serviceRoutes);
router.use("/bookings", bookingRoutes);

router.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    file: req.file,
    body: req.body,
  });
});

router.get("/auth-test", authenticate, (req, res) => {
  res.json({
    message: "authenticated",
  });
});

export default router;
