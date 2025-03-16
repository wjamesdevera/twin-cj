import { prisma } from "../config/db";
import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";
import { BAD_REQUEST, CREATED } from "../constants/http";
import { bookingSchema } from "../schemas/booking.schema";
import { generateReferenceCode } from "../utils/referenceCodeGenerator";

export const createBookingHandler = catchErrors(
  async (request: Request, response: Response) => {
    const validatedData = bookingSchema.parse(request.body);

    const {
      checkInDate,
      checkOutDate,
      notes,
      customerId,
      bookingStatusId,
      totalPax,
    } = validatedData;

    appAssert(checkInDate, BAD_REQUEST, "Check-in date is required");
    appAssert(checkOutDate, BAD_REQUEST, "Check-out date is required");
    appAssert(customerId, BAD_REQUEST, "Customer ID is required");
    appAssert(bookingStatusId, BAD_REQUEST, "Booking status ID is required");
    appAssert(totalPax, BAD_REQUEST, "Total Pax is required");

    const referenceCode = await generateReferenceCode();

    console.log(`Creating booking with reference code:", ${referenceCode}`);

    const newBooking = await prisma.booking.create({
      data: {
        referenceCode,
        checkIn: new Date(checkInDate),
        checkOut: new Date(checkOutDate),
        notes,
        customerId,
        bookingStatusId,
        totalPax,
      },
    });

    response.status(CREATED).json({
      status: "success",
      data: { booking: newBooking },
    });
  }
);
