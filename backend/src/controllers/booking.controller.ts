import { prisma } from "../config/db";
import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR } from "../constants/http";
import { bookingSchema } from "../schemas/booking.schema";
import { generateReferenceCode } from "../utils/referenceCodeGenerator";
import { ROOT_STATIC_URL } from "../constants/url";
import { createBooking } from "../services/booking.service";
import AppError from "../utils/AppError";

export const createBookingHandler = catchErrors(
  async (request: Request, response: Response) => {
    appAssert(request.file, BAD_REQUEST, "Proof of payment is required");
    const proofOfPayment = `${ROOT_STATIC_URL}/${request.file.filename}`;

    appAssert(
      request.body.bookingData,
      BAD_REQUEST,
      "Booking data is required"
    );

    let parsedJsonData;
    try {
      parsedJsonData = JSON.parse(request.body.bookingData);
    } catch (error) {
      throw new AppError(BAD_REQUEST, "Invalid JSON format in bookingData");
    }

    // Generate reference code before validation
    const referenceCode = await generateReferenceCode();
    console.log(`Generated Reference Code: ${referenceCode}`);

    // Validate input data and inject reference code
    const validatedData = bookingSchema.parse({
      ...parsedJsonData,
      referenceCode,
    });

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

    console.log("Validating customer existence...");
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    appAssert(customer, BAD_REQUEST, "Invalid Customer ID");

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
