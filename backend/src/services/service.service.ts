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
  return await prisma.$transaction(async (tx) => {
    const cabins = await tx.cabin.findMany({
      select: { serviceId: true },
    });

    const serviceIds = cabins.map(cabin => cabin.serviceId);

    await tx.cabin.deleteMany();

    await tx.service.deleteMany({
      where: {
        id: { in: serviceIds },
      },
    });

    return { deletedCabins: cabins.length, deletedServices: serviceIds.length };
  });
};

export const deleteCabin = async (id: number) => {
  return await prisma.$transaction(async (tx) => {
    const existingCabin = await tx.cabin.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!existingCabin) return null;

    const { serviceId } = existingCabin;

    await tx.cabin.delete({ where: { id } });

    const deletedService = await tx.service.delete({ where: { id: serviceId } });

    return { deletedCabin: existingCabin, deletedService };
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
