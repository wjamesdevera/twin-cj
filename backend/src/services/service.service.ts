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

export const updateCabin = async (
  id: number,
  data: {
    service?: {
      name?: string;
      description?: string;
      imageUrl?: string;
      quantity?: number;
      price?: number;
    };
    cabin?: {
      minCapacity?: number;
      maxCapacity?: number;
      additionalFeeId?: number | null;
    };
  }
) => {
  return await prisma.$transaction(async (tx) => {
    const existingCabin = await tx.cabin.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!existingCabin) return null;

    const { serviceId } = existingCabin;

    const updatedService = data.service
      ? await tx.service.update({
          where: { id: serviceId },
          data: data.service,
        })
      : existingCabin.service;
    
    const updatedCabin = data.cabin
      ? await tx.cabin.update({
          where: { id },
          data: data.cabin,
        })
      : existingCabin;

    return { service: updatedService, cabin: updatedCabin };
  });
};
