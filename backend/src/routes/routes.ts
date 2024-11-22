import { Router, Request, Response } from "express";
import { OK } from "../constants/http";

const router = Router();

router.get("/health", (request: Request, response: Response) => {
  response.status(OK).json({
    status: "success",
    data: {
      message: "Hello World!",
    },
  });
});

export default router;
