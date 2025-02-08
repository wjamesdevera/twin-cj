import { prisma } from "../config/db";

export const getCabin = async (id: number) => {
  return await prisma.cabin.findUnique({
    where: { id },
    include: {
      service: true,
      additionalFee: true,
    },
  });
};

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

export const deleteAllCabins = async () => {
  return await prisma.cabin.deleteMany();
};

export const deleteCabin = async (id: number) => {
  return await prisma.cabin.delete({
    where: { id },
  });
};

export const updateCabin = async (id: number, data: { 
  serviceId?: number;
  minCapacity?: number;
  maxCapacity?: number;
  additionalFeeId?: number;
}) => {
  return await prisma.cabin.update({
    where: { id },
    data,
  });
};
