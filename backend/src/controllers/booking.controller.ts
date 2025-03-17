import { prisma } from "../config/db";
import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  OK,
} from "../constants/http";
import { bookingSchema, personalDetailSchema } from "../schemas/booking.schema";
import { generateReferenceCode } from "../utils/referenceCodeGenerator";
import { ROOT_STATIC_URL } from "../constants/url";
import { getServicesByCategory } from "../services/booking.service";
import AppError from "../utils/AppError";

export const getBookingHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { type } = req.query;

    // Ensure 'type' query parameter is provided
    if (!type) {
      return res.status(BAD_REQUEST).json({
        status: "error",
        message: "'type' query parameter is required",
      });
    }

    // Get categorized bookings by the type parameter
    const categorizedBookings = await getServicesByCategory(type as string);

    appAssert(categorizedBookings, BAD_REQUEST, "No bookings available");

    return res.status(OK).json({
      status: "success",
      data: categorizedBookings,
    });
  }
);
