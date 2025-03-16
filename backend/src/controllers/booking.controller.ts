import { prisma } from "../config/db";
import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";
import { BAD_REQUEST, CREATED } from "../constants/http";
import { bookingSchema } from "../schemas/booking.schema";
import { generateReferenceCode } from "../utils/referenceCodeGenerator";
import { ROOT_STATIC_URL } from "../constants/url";
import { createBooking } from "../services/booking.service";

export const createBookingHandler = catchErrors(
  async (request: Request, response: Response) => {
    appAssert(request.file, BAD_REQUEST, "Proof of payment is required");
    const proofOfPayment = `${ROOT_STATIC_URL}/${request.file.filename}`;

    const jsonData = request.body.bookingData;
    const parsedJsonData = JSON.parse(jsonData);

    const validatedData = bookingSchema.parse(parsedJsonData);

    const {
      checkInDate,
      checkOutDate,
      notes,
      customerId,
      bookingStatusId,
      totalPax,
      amount,
    } = validatedData;

    appAssert(checkInDate, BAD_REQUEST, "Check-in date is required");
    appAssert(checkOutDate, BAD_REQUEST, "Check-out date is required");
    appAssert(customerId, BAD_REQUEST, "Customer ID is required");
    appAssert(bookingStatusId, BAD_REQUEST, "Booking status ID is required");
    appAssert(totalPax, BAD_REQUEST, "Total Pax is required");

    const referenceCode = await generateReferenceCode();

    console.log(`Creating booking with reference code: ${referenceCode}`);

    const newBooking = await createBooking(
      validatedData,
      proofOfPayment,
      request.body.paymentMethodId,
      amount
    );

    response.status(CREATED).json({
      status: "success",
      data: { booking: newBooking },
    });
  }
);
