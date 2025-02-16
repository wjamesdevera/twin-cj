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
          id: true,
          name: true,
          description: true,
          price: true,
          imageUrl: true,
          quantity: true,
        },
      },
      additionalFee: {
        select: {
          id: true,
          type: true,
          description: true,
          amount: true,
        },
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
        select: {
          id: true,
          type: true,
          description: true,
          amount: true,
        },
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
  };
  additionalFee?: {
    type: string;
    description?: string;
    amount: number;
  };
}) => {
  return await prisma.$transaction(async (tx) => {
    const newService = await tx.service.create({
      data: data.service,
    });

    let newAdditionalFee = null;
    if (data.additionalFee) {
      newAdditionalFee = await tx.additionalFee.create({
        data: {
          type: data.additionalFee.type,
          description: data.additionalFee.description || null,
          amount: data.additionalFee.amount,
        },
      });
    }

    const newCabin = await tx.cabin.create({
      data: {
        serviceId: newService.id,
        minCapacity: data.cabin.minCapacity,
        maxCapacity: data.cabin.maxCapacity,
        additionalFeeId: newAdditionalFee ? newAdditionalFee.id : null,
      },
    });

    return { service: newService, cabin: newCabin, additionalFee: newAdditionalFee };
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
    additionalFee?: {
      type: string;
      description?: string;
      amount: number;
    } | null;
  }
) => {
  return await prisma.$transaction(async (tx) => {
    const existingCabin = await tx.cabin.findUnique({
      where: { id },
      include: { service: true, additionalFee: true },
    });

    if (!existingCabin) return null;

    const { serviceId, additionalFeeId } = existingCabin;

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

    let updatedAdditionalFee = existingCabin.additionalFee;

    if (data.additionalFee !== undefined) {
      if (data.additionalFee === null && additionalFeeId) {
        await tx.additionalFee.delete({ where: { id: additionalFeeId } });
        updatedAdditionalFee = null;
      } else if (data.additionalFee) {
        if (additionalFeeId) {
          updatedAdditionalFee = await tx.additionalFee.update({
            where: { id: additionalFeeId },
            data: {
              type: data.additionalFee.type ?? existingCabin.additionalFee?.type,
              description: data.additionalFee.description ?? existingCabin.additionalFee?.description,
              amount: data.additionalFee.amount ?? existingCabin.additionalFee?.amount,
            },
          });
        } else {
          updatedAdditionalFee = await tx.additionalFee.create({
            data: {
              type: data.additionalFee.type,
              description: data.additionalFee.description ?? null,
              amount: data.additionalFee.amount,
            },
          });

          await tx.cabin.update({
            where: { id },
            data: { additionalFeeId: updatedAdditionalFee.id },
          });
        }
      }
    }

    return { service: updatedService, cabin: updatedCabin, additionalFee: updatedAdditionalFee };
  });
};
