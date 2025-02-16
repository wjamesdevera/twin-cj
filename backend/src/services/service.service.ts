import { prisma } from "../config/db";

export const getCabin = async (id: number) => {
  return await prisma.cabin.findUnique({
    where: { id },
    select: {
      id: true,
      minCapacity: true,
      maxCapacity: true,
      createdAt: true,
      updatedAt: true,
      service: {
        select: {
          name: true,
          description: true,
          price: true,
          imageUrl: true,
          quantity: true,
        },
      },
      additionalFee: {
        select: { id: true },
      },
    },
  });
};

export const getAllCabins = async () => {
  return await prisma.cabin.findMany({
    select: {
      id: true,
      minCapacity: true,
      maxCapacity: true,
      createdAt: true,
      updatedAt: true,
      service: {
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          imageUrl: true,
          quantity: true,
        },
      },
      additionalFee: {
        select: { id: true },
      },
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
    const deletedCabins = await tx.cabin.deleteMany();
    const deletedServices = await tx.service.deleteMany();

    return { deletedCabins: deletedCabins.count, deletedServices: deletedServices.count };
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

    if (serviceId) {
      await tx.service.delete({ where: { id: serviceId } });
    }

    return { deletedCabin: existingCabin, deletedService: serviceId ? existingCabin.service : null };
  });
};

export const updateCabin = async (
  id: number,
  data: {
    service?: Partial<{
      name: string;
      description: string;
      imageUrl: string;
      quantity: number;
      price: number;
    }>;
    cabin?: Partial<{
      minCapacity: number;
      maxCapacity: number;
      additionalFeeId: number | null;
    }>;
  }
) => {
  return await prisma.$transaction(async (tx) => {
    const existingCabin = await tx.cabin.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!existingCabin) return null;

    const { serviceId } = existingCabin;

    const [updatedService, updatedCabin] = await Promise.all([
      data.service
        ? tx.service.update({
            where: { id: serviceId },
            data: data.service,
          })
        : existingCabin.service,
      data.cabin
        ? tx.cabin.update({
            where: { id },
            data: data.cabin,
          })
        : existingCabin,
    ]);

    return { service: updatedService, cabin: updatedCabin };
  });
};
