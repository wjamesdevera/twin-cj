import { prisma } from "../config/db";
import path from "path";
import fs from "fs";

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

    const newAdditionalFee = data.additionalFee
      ? await tx.additionalFee.create({
          data: {
            type: data.additionalFee.type,
            description: data.additionalFee.description || null,
            amount: data.additionalFee.amount,
          },
        })
      : null;

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
      include: { service: true, additionalFee: true },
    });

    if (!existingCabin) return null;

    const { serviceId, additionalFee } = existingCabin;
    const imageUrl = existingCabin.service?.imageUrl;

    if (imageUrl) {
      const imagePath = path.join(__dirname, "../../uploads", path.basename(imageUrl));

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Deleted image file: ${imagePath}`);
      } else {
        console.warn(`Image file not found: ${imagePath}`);
      }
    }
    
    await tx.cabin.delete({ where: { id } });

    if (serviceId) {
      await tx.service.delete({ where: { id: serviceId } });
    }

    if (additionalFee) {
      await tx.additionalFee.delete({ where: { id: additionalFee.id } });
    }

    return { deletedCabin: existingCabin, deletedService: serviceId ? existingCabin.service : null, deletedAdditionalFee: additionalFee ? additionalFee : null };
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

    const { serviceId } = existingCabin;
    let updatedImageUrl = existingCabin.service.imageUrl;

    if (data.service?.imageUrl && data.service.imageUrl !== existingCabin.service.imageUrl) {
      const oldImagePath = path.join(__dirname, "../../uploads", path.basename(existingCabin.service.imageUrl));

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log(`Deleted old image file: ${oldImagePath}`);
      } else {
        console.warn(`Old image file not found: ${oldImagePath}`);
      }

      updatedImageUrl = data.service.imageUrl;
    }

    const updatedService = data.service
      ? await tx.service.update({
          where: { id: serviceId },
          data: { ...data.service, imageUrl: updatedImageUrl },
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
      if (data.additionalFee === null && existingCabin.additionalFee) {
        await tx.additionalFee.delete({ where: { id: existingCabin.additionalFee.id } });
        updatedAdditionalFee = null;
      } else if (data.additionalFee) {
        if (existingCabin.additionalFee) {
          updatedAdditionalFee = await tx.additionalFee.update({
            where: { id: existingCabin.additionalFee.id },
            data: data.additionalFee,
          });
        } else {
          updatedAdditionalFee = await tx.additionalFee.create({
            data: data.additionalFee,
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
