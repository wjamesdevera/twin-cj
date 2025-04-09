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
import {
  getServicesByCategory,
  createBooking,
  getBookingStatuses,
  checkAvailability,
  getLatestBookings,
  getMonthlyBookings,
  createWalkInBooking,
  editBookingStatus,
  getYearlyBookings,
  getBookingStatus,
  getBookingByReferenceCode,
  getAllBooking,
  editBookingDates,
} from "../services/booking.service";

export const getBookingHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { type, checkInDate, checkOutDate } = req.query;

    if (type && checkInDate && checkOutDate) {
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

    const bookings = await getAllBooking();

    res.status(OK).json(bookings);
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

export const getMonthlyBookingsHandler = async (
  req: Request,
  res: Response
) => {
  const bookings = await getMonthlyBookings();

  res.status(OK).json({
    monthlyBookingCount: bookings,
  });
};

export const getYearlyBookingsHandler = async (req: Request, res: Response) => {
  const bookings = await getYearlyBookings();

  res.status(OK).json({
    yearlyBookingCount: bookings,
  });
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
    const { referenceCode } = req.params;

    const booking = await getBookingByReferenceCode(referenceCode);

    res.status(OK).json(booking);
  }
);

export const updateBookingStatusHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { bookingStatus, message } = req.body;

    const booking = await editBookingStatus(id, bookingStatus, message);
    res.status(OK).json(booking);
  }
);

export const updateBookingDateHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { referenceCode } = req.params;
    const { newCheckIn, newCheckOut } = req.body;

    const result = await editBookingDates(
      referenceCode,
      newCheckIn,
      newCheckOut
    );

    if (result.unavailableServices) {
      return res.status(BAD_REQUEST).json({
        message: "The service is unavailable on the date provided.",
      });
    }

    res.status(OK).json(result.updatedBookingDate);
  }
);

export const getBookingStatusesHandler = catchErrors(
  async (request: Request, response: Response) => {
    const { referenceCode } = request.params;
    const bookingStatus = await getBookingStatuses(referenceCode);
    response.status(OK).json(bookingStatus);
  }
);

export const getBookingStatusHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { referenceCode } = req.params;

    const bookingStatus = await getBookingStatus(referenceCode);

    return res.status(OK).json(bookingStatus);
  }
);
