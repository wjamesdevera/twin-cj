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
  service: {
    name: string;
    description: string;
    imageUrl: string;
    quantity: number;
    price: number;
  };
  cabin: {
    minCapacity: number;
    maxCapacity: number;
    additionalFeeId?: number | null;
  };
}) => {
  return await prisma.$transaction(async (tx) => {
    const newService = await tx.service.create({
      data: data.service,
    });

    const newCabin = await tx.cabin.create({
      data: {
        serviceId: newService.id,
        minCapacity: data.cabin.minCapacity,
        maxCapacity: data.cabin.maxCapacity,
        additionalFeeId: data.cabin.additionalFeeId || null,
      },
    });

    return { service: newService, cabin: newCabin };
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
