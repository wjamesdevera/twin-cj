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
  const cabins = await prisma.cabin.findMany({
    include: {
      additionalFee: true,
      service: true,
    },
  });

  return cabins.map((cabin) => {
    return {
      id: cabin.service.id,
      name: cabin.service.name,
      description: cabin.service.description,
      price: cabin.service.price,
      imageUrl: cabin.service.imageUrl,
      quantity: cabin.service.quantity,
      minCapacity: cabin.minCapacity,
      maxCapacity: cabin.maxCapacity,
      createdAt: cabin.createdAt,
      updatedAt: cabin.updatedAt,
    };
  });
};

type CreateCabinParams = {
  minCapacity: number;
  maxCapacity: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  imageUrl: string;
  additionalFee?:
    | {
        type: string;
        amount: number;
        description?: string | undefined;
      }
    | undefined;
};

export const createCabin = async (data: CreateCabinParams) => {
  const createdCabin = await prisma.cabin.create({
    data: {
      minCapacity: data.minCapacity,
      maxCapacity: data.maxCapacity,
      service: {
        create: {
          name: data.name,
          description: data.description,
          quantity: data.quantity,
          price: data.price,
          imageUrl: data.imageUrl,
        },
      },
    },
    include: {
      service: true,
    },
  });

  return {
    id: createdCabin.service.id,
    name: createdCabin.service.name,
    description: createdCabin.service.description,
    price: createdCabin.service.price,
    imageUrl: createdCabin.service.imageUrl,
    quantity: createdCabin.service.quantity,
    minCapacity: createdCabin.minCapacity,
    maxCapacity: createdCabin.maxCapacity,
    createdAt: createdCabin.service.createdAt,
    updatedAt: createdCabin.service.updatedAt,
  };
};

export const deleteAllCabins = async () => {
  return await prisma.$transaction(async (tx) => {
    const deletedCabins = await tx.cabin.deleteMany();
    const deletedServices = await tx.service.deleteMany();

    return {
      deletedCabins: deletedCabins.count,
      deletedServices: deletedServices.count,
    };
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
      const imagePath = path.join(
        __dirname,
        "../../uploads",
        path.basename(imageUrl)
      );

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

    return {
      deletedCabin: existingCabin,
      deletedService: serviceId ? existingCabin.service : null,
      deletedAdditionalFee: additionalFee ? additionalFee : null,
    };
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

    if (
      data.service?.imageUrl &&
      data.service.imageUrl !== existingCabin.service.imageUrl
    ) {
      const oldImagePath = path.join(
        __dirname,
        "../../uploads",
        path.basename(existingCabin.service.imageUrl)
      );

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
        await tx.additionalFee.delete({
          where: { id: existingCabin.additionalFee.id },
        });
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

    return {
      service: updatedService,
      cabin: updatedCabin,
      additionalFee: updatedAdditionalFee,
    };
  });
};
