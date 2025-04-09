import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { OK } from "../constants/http";
import { feedbackSchema } from "../schemas/feedback.schema";
import { getBookingByReferenceCode } from "../services/booking.service";
import { getFeedbacks, sendFeedback } from "../services/feedback.service";

export const sendFeedbackHandler = catchErrors(
  async (request: Request, response: Response) => {
    const requestData = feedbackSchema.parse(request.body);

    await getBookingByReferenceCode(requestData.referenceCode);

    const feedback = await sendFeedback(requestData);

    response.status(OK).json({
      status: "success",
      data: {
        feedback: feedback,
      },
    });
  }
);

export const getFeedbackHandler = catchErrors(
  async (request: Request, response: Response) => {
    const feedbacks = await getFeedbacks();
    response.status(OK).json({
      status: "success",
      data: {
        feedbacks: feedbacks,
      },
    });
  }
);
