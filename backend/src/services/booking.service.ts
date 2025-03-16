import { prisma } from "../config/db";
import { generateReferenceCode } from "../utils/referenceCodeGenerator";

export const createBooking = async (validatedData: any) => {
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

  return newBooking;
};
