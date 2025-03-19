import { prisma } from "../config/db";

export const generateReferenceCode = async (): Promise<string> => {
  let isUnique = false;
  let referenceCode = "";

  while (!isUnique) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

     const randomString = Array.from({ length: 5 }, () =>
       "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(
         Math.floor(Math.random() * 36)
       )
     ).join("");

    referenceCode = `B${year}${month}${day}-${randomString}`;
    
    // Check if the referenceCode already exists
    const existingBooking = await prisma.booking.findFirst({
      where: { referenceCode },
    });

    if (!existingBooking) {
      isUnique = true;
    }
  }

  return referenceCode;
};
