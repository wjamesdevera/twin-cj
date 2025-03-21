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
import { ROOT_STATIC_URL } from "../constants/url";
import {
  getServicesByCategory,
  createBooking,
  checkAvailability,
} from "../services/booking.service";
import AppError from "../utils/AppError";

export const getBookingHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { type, checkInDate, checkOutDate } = req.query;

    if (!type || !checkInDate || !checkOutDate) {
      return res.status(BAD_REQUEST).json({
        status: "error",
        message:
          "'type', 'checkInDate', and 'checkOutDate' query parameters are required",
      });
    }

    const categorizedBookings = await getServicesByCategory(
      type as string,
      checkInDate as string,
      checkOutDate as string
    );

    appAssert(categorizedBookings, BAD_REQUEST, "No bookings available");

    return res.status(OK).json({
      status: "success",
      data: categorizedBookings,
    });
  }
);

export const checkAvailabilityHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { checkInDate, checkOutDate } = req.query as {
      checkInDate?: string;
      checkOutDate?: string;
    };

    if (!checkInDate || !checkOutDate) {
      return res.status(BAD_REQUEST).json({
        status: "error",
        message: "Missing required query parameters.",
      });
    }

    const availableServices = await checkAvailability(
      checkInDate,
      checkOutDate
    );

    return res.status(OK).json({
      status: "success",
      data: availableServices,
    });
  }
);

export const createBookingHandler = async (req: Request, res: Response) => {
  try {
    const result = await createBooking(req);
    res
      .status(CREATED)
      .json({ message: "Booking created successfully", result });
  } catch (error) {
    res.status(BAD_REQUEST).json({ error: error });
  }
};
