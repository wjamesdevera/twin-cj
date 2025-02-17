import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { OK } from "../constants/http";

export const sendFeedback = catchErrors(
  async (request: Request, response: Response) => {
    response.status(OK).json({
      status: "success",
      data: {
        message: "Feedback route successfully installed",
      },
    });
  }
);
