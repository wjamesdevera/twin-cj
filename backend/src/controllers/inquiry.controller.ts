import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { OK } from "../constants/http";
import { sendInquirySchema } from "../schemas/inquiry.schema";
import { sendInquiry } from "../services/inquiry.service";

export const sendInquiryHandler = catchErrors(
  async (request: Request, response: Response) => {
    const data = sendInquirySchema.parse(request.body);

    await sendInquiry(data);

    response.status(OK).json({
      status: "success",
      data: {
        message: "Feedback sent successfully",
      },
    });
  }
);
