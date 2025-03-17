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
import { createBooking } from "../services/booking.service";
import AppError from "../utils/AppError";

export const createBookingHandler = catchErrors(
  async (request: Request, response: Response) => {
    try {
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

      console.log("Parsed booking data:", parsedJsonData);

      const referenceCode = await generateReferenceCode();

      // Extract personal details from booking data
      const personalDetails = personalDetailSchema.parse({
        firstName: parsedJsonData.firstName,
        lastName: parsedJsonData.lastName,
        phoneNumber: parsedJsonData.contactNumber,
        email: parsedJsonData.email,
      });

      let personalDetail = await prisma.personalDetail.findUnique({
        where: { email: personalDetails.email },
      });

      if (!personalDetail) {
        personalDetail = await prisma.personalDetail.create({
          data: personalDetails,
        });
      }

      let customer = await prisma.customer.findUnique({
        where: { personalDetailId: personalDetail.id },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: { personalDetailId: personalDetail.id },
        });
      }

      const customerId = customer?.id;
      if (!customerId) {
        throw new AppError(BAD_REQUEST, "Invalid customer ID");
      }

      const bookingData = bookingSchema.parse({
        ...parsedJsonData,
        referenceCode,
        bookingStatusId: parsedJsonData.bookingStatusId ?? 1,
        customerId: customerId,
      });

      const newBooking = await createBooking(
        bookingData,
        proofOfPayment,
        request.body.paymentMethodId,
        bookingData.amount
      );

      response.status(CREATED).json({
        status: "success",
        data: { booking: newBooking },
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      response
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: "error", message: "Failed to create booking" });
    }
  }
);
