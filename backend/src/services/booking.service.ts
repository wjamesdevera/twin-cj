import { prisma } from "../config/db";
import { generateReferenceCode } from "../utils/referenceCodeGenerator";

export const createBooking = async (
  validatedData: any,
  proofOfPaymentImageUrl: string,
  paymentMethodId: number | null,
  amount: number
) => {
  try {
    const {
      checkInDate,
      checkOutDate,
      notes,
      firstName,
      lastName,
      contactNumber,
      email,
      bookingStatusId,
      totalPax,
    } = validatedData;

    return await prisma.$transaction(async (prisma) => {
      console.log("Validated Data:", validatedData);

      // Ensure personal details exist
      let personalDetail = await prisma.personalDetail.findUnique({
        where: { email },
      });

      if (!personalDetail) {
        personalDetail = await prisma.personalDetail.create({
          data: {
            firstName,
            lastName,
            phoneNumber: contactNumber,
            email,
          },
        });
      }
      console.log("Personal Detail ID:", personalDetail.id);

      // Ensure customer exists
      let customer = await prisma.customer.findFirst({
        where: { personalDetailId: personalDetail.id },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            personalDetailId: personalDetail.id,
          },
        });
      }
      console.log("Customer ID:", customer.id);

      // Validate required fields
      const referenceCode = await generateReferenceCode();
      if (!referenceCode) throw new Error("Reference code generation failed.");
      if (!customer.id) throw new Error("Customer ID is undefined.");
      if (!bookingStatusId) throw new Error("Booking Status ID is missing.");

      // Create transaction if payment details exist
      let newTransaction = null;
      if (paymentMethodId) {
        newTransaction = await prisma.transaction.create({
          data: {
            paymentMethodId,
            proofOfPaymentImageUrl,
            amount,
          },
        });
      }
      console.log("Transaction Created:", newTransaction?.id || "No Payment");

      // Create booking
      const newBooking = await prisma.booking.create({
        data: {
          referenceCode,
          checkIn: new Date(checkInDate),
          checkOut: new Date(checkOutDate),
          notes,
          customerId: customer.id,
          bookingStatusId,
          totalPax,
          transactionId: newTransaction ? newTransaction.id : null,
        },
      });

      console.log("Booking Created:", newBooking);
      return newBooking;
    });
  } catch (error) {
    console.error("Error in createBooking:", error);
  }
};
