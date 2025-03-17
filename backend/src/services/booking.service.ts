import { prisma } from "../config/db";
import { generateReferenceCode } from "../utils/referenceCodeGenerator";

export const createBooking = async (
  validatedData: any,
  proofOfPaymentImageUrl: string,
  paymentMethodId: number,
  amount: number
) => {
  const {
    checkInDate,
    checkOutDate,
    notes,
    customerId,
    bookingStatusId,
    totalPax,
  } = validatedData;

  const referenceCode = await generateReferenceCode();

  console.log(`Generated Reference Code: ${referenceCode}`);

  const result = await prisma.$transaction(async (prisma) => {
    const newTransaction = await prisma.transaction.create({
      data: {
        paymentMethodId,
        proofOfPaymentImageUrl,
        amount,
      },
    });

    const newBooking = await prisma.booking.create({
      data: {
        referenceCode,
        checkIn: new Date(checkInDate),
        checkOut: new Date(checkOutDate),
        notes,
        customerId,
        bookingStatusId,
        totalPax,
        transactionId: newTransaction.id,
      },
    });

    return newBooking;
  });

  return result;
};
