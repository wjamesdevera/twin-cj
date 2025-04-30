import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { BAD_REQUEST, OK } from "../constants/http";
import {
  feedbackSchema,
  updateFeedbackSchema,
} from "../schemas/feedback.schema";
import { getBookingByReferenceCode } from "../services/booking.service";
import {
  getFeedbacks,
  sendFeedback,
  updateFeedbackStatus,
} from "../services/feedback.service";
import appAssert from "../utils/appAssert";
import { idSchema } from "../schemas/schemas";

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
    if (request.query.limit && request.query.approved) {
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

export const updateFeedbackHandler = catchErrors(
  async (request: Request, response: Response) => {
    const { id } = idSchema.parse(request.params);

    appAssert(Number(id), BAD_REQUEST, "Id should be a number");

    const { statusId } = updateFeedbackSchema.parse(request.body);

    const updatedFeedback = await updateFeedbackStatus(
      Number(id),
      Number(statusId)
    );

    response.status(OK).json({
      status: "success",
      data: {
        feedback: updatedFeedback,
      },
    });
  }
);
