import { prisma } from "../config/db";

export const getAllCabins = async () => {
  return await prisma.cabin.findMany({
    include: {
      service: true,
      additionalFee: true,
    },
  });
};

export const createCabin = async (data: {
  serviceId: number;
  minCapacity: number;
  maxCapacity: number;
  additionalFeeId: number;
}) => {
  return await prisma.cabin.create({
    data,
  });
};
