import { Router, Request, Response } from "express";
import { OK } from "../constants/http";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import { authenticate } from "../middlewares/auth.middleware";

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
router.use("/users", authenticate, userRoutes);

router.get("/auth-test", authenticate, (req, res) => {
  res.json({
    message: "authenticated",
  });
});

export default router;
