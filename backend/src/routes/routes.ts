import { Router, Request, Response } from "express";
import { OK } from "../constants/http";
import authRoutes from "./auth.routes";

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

export default router;
