import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { OK } from "../constants/http";
import { sendFeedbackSchema } from "../schemas/feedback.schemas";
import { sendFeedback } from "../services/feedback.service";

export const sendFeedbackHandler = catchErrors(
  async (request: Request, response: Response) => {
    const data = sendFeedbackSchema.parse(request.body);

    await sendFeedback(data);

    response.status(OK).json({
      status: "success",
      data: {
        message: "Feedback sent successfully",
      },
    });
  }
);
