import { prisma } from "../config/db";

export const getAllCabins = async () => {
  return await prisma.cabin.findMany({
    include: {
      service: true,
      additionalFee: true,
    },
  });
};
