import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { BAD_REQUEST, OK } from "../constants/http";
import { feedbackSchema } from "../schemas/feedback.schema";
import { getBookingByReferenceCode } from "../services/booking.service";
import { getFeedbacks, sendFeedback } from "../services/feedback.service";
import appAssert from "../utils/appAssert";

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
    let feedbacks: any[] = [];
    if (request.query.limit) {
      appAssert(Number(request.query.limit), BAD_REQUEST, "Query is not valid");
      feedbacks = await getFeedbacks(Number(request.query.limit));
    } else {
      feedbacks = await getFeedbacks();
    }
    response.status(OK).json({
      status: "success",
      data: {
        feedbacks: feedbacks,
      },
    });
  }
);
