import { prisma } from "../config/db";
import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from "../constants/http";
import { bookingSchema, personalDetailSchema } from "../schemas/booking.schema";
import { ROOT_STATIC_URL } from "../constants/url";
import {
  getServicesByCategory,
  createBooking,
  checkAvailability,
  getLatestBookings,
  getMonthlyBookings,
  createWalkInBooking,
  editBookingStatus,
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

export const getLatestBookingsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const latestBookings = await getLatestBookings();
    res.status(OK).json(latestBookings);
  } catch (error) {
    res.status(NOT_FOUND).json({
      message: "Failed to fetch latest bookings",
      error: error,
    });
  }
};

export const getMonthlyBookingsController = async (
  req: Request,
  res: Response
) => {
  try {
    const bookings = await getMonthlyBookings(req, res);

    res.status(OK).json(bookings);
  } catch (error) {
    console.error("Error in getMonthlyBookingsController:", error);
    res.status(NOT_FOUND).send("Failed to fetch monthly bookings");
  }
};

// Admin Side
export const viewBookingsHandler = catchErrors(
  async (req: Request, res: Response) => {
    try {
      const bookings = await getLatestBookings();

      return res.status(OK).json({
        status: "success",
        data: bookings.bookings,
        pendingReservations: bookings.pendingReservations,
        activeReservations: bookings.activeReservations,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return res.status(INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to fetch bookings",
      });
    }
  }
);

export const createWalkInBookingHandler = catchErrors(
  async (req: Request, res: Response) => {
    try {
      await createWalkInBooking(req, res);
    } catch (error) {
      console.error("Error creating walk-in booking:", error);
      console.log("Request Body:", req.body);
      return res.status(INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to create walk-in booking",
      });
    }
  }
);

export const getBookingByIdHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: {
        services: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  }
);

export const updateBookingHandler = catchErrors(
  async (req: Request, res: Response) => {
    try {
      await editBookingStatus(req, res);
    } catch (error) {
      console.error("Error updating booking status:", error);
      console.log("Request Body:", req.body);
      return res.status(INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to update booking status",
      });
    }
  }
);
