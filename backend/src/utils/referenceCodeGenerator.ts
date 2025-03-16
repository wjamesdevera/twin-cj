import { prisma } from "../config/db";

export const generateReferenceCode = async (): Promise<string> => {
  let isUnique = false;
  let referenceCode = "";

  while (!isUnique) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(1000 + Math.random() * 9000);

    referenceCode = `B${year}/${month}${day}-${random}`;

    // Check if the reference code already exists in the database
    const existingBooking = await prisma.booking.findUnique({
      where: { referenceCode },
    });

    if (!existingBooking) {
      isUnique = true;
    }
  }

  return referenceCode;
};
