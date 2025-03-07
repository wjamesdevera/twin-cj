import { prisma } from '../config/db';
import path from 'path';
import fs from 'fs';

interface CreateDayTourInput {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  additionalFee?: {
    type: string;
    description: string;
    amount: number;
  };
}

export const createDayTour = async (input: CreateDayTourInput) => {
  const createdDayTour = await prisma.dayTourActivities.create({
    data: {
      service: {
        create: {
          name: input.name,
          description: input.description,
          imageUrl: input.imageUrl,
          price: input.price,
        },
      },
      additionalFee: input.additionalFee
        ? {
            create: {
              type: input.additionalFee.type,
              description: input.additionalFee.description,
              amount: input.additionalFee.amount,
            },
          }
        : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    include: {
      service: true,
      additionalFee: true,
    },
  });

  return {
    id: createdDayTour.service.id,
    name: createdDayTour.service.name,
    description: createdDayTour.service.description,
    price: createdDayTour.service.price,
    imageUrl: createdDayTour.service.imageUrl,
    additionalFee: createdDayTour.additionalFee,
    createdAt: createdDayTour.createdAt,
    updatedAt: createdDayTour.updatedAt,
  };
};

// Read all DayTourActivities
export const getAllDayTours = async () => {
  const dayTours = await prisma.dayTourActivities.findMany({
    include: {
      service: true,
      additionalFee: true,
    },
  });

  return dayTours.map((dayTour) => ({
    id: dayTour.service.id,
    name: dayTour.service.name,
    description: dayTour.service.description,
    price: dayTour.service.price,
    imageUrl: dayTour.service.imageUrl,
    additionalFee: dayTour.additionalFee,
    createdAt: dayTour.createdAt,
    updatedAt: dayTour.updatedAt,
  }));
};

// Read a specific DayTourActivity by ID
export const getDayTourById = async (id: number) => {
  return await prisma.dayTourActivities.findUnique({
    where: { id },
    include: {
      service: true,
      additionalFee: true,
    },
  });
};

// Update
export const updateDayTour = async (
  id: number,
  data: {
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    additionalFee?: {
      type?: string;
      description?: string;
      amount?: number;
    };
  }
) => {
  const existingDayTour = await prisma.dayTourActivities.findUnique({
    where: { id },
    include: { service: true },
  });

  if (!existingDayTour) {
    throw new Error(`Day tour with ID ${id} not found`);
  }

  const updateData: any = {
    updatedAt: new Date(),
    service: {
      update: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        price: data.price,
      },
    },
  };

  if (data.additionalFee) {
    const existingAdditionalFee = await prisma.additionalFee.findFirst({
      where: { dayTourActivity: { id } },
    });

    if (existingAdditionalFee) {
      updateData.additionalFee = {
        update: {
          ...(data.additionalFee.type && { type: data.additionalFee.type }),
          ...(data.additionalFee.description && {
            description: data.additionalFee.description,
          }),
          ...(data.additionalFee.amount !== undefined && {
            amount: data.additionalFee.amount,
          }),
        },
      };
    } else {
      updateData.additionalFee = {
        create: {
          ...(data.additionalFee.type && { type: data.additionalFee.type }),
          ...(data.additionalFee.description && {
            description: data.additionalFee.description,
          }),
          ...(data.additionalFee.amount !== undefined && {
            amount: data.additionalFee.amount,
          }),
        },
      };
    }
  }

  // Delete the old image if a new image URL is provided
  if (existingDayTour.service.imageUrl !== data.imageUrl) {
    const oldImagePath = path.join(
      __dirname,
      '../../uploads',
      path.basename(existingDayTour.service.imageUrl)
    );

    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
      console.log(`Deleted old image file: ${oldImagePath}`);
    } else {
      console.warn(`Old image file not found: ${oldImagePath}`);
    }
  }

  return await prisma.dayTourActivities.update({
    where: { id },
    data: updateData,
    include: {
      service: true,
      additionalFee: true,
    },
  });
};

// Delete
export const deleteDayTour = async (id: number) => {
  return await prisma.$transaction(async (tx) => {
    const existingDayTour = await tx.dayTourActivities.findUnique({
      where: { id },
      include: { service: true, additionalFee: true },
    });

    if (!existingDayTour) return null;

    const { serviceId, additionalFee } = existingDayTour;
    const imageUrl = existingDayTour.service?.imageUrl;

    if (imageUrl) {
      const imagePath = path.join(
        __dirname,
        '../../uploads',
        path.basename(imageUrl)
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Deleted image file: ${imagePath}`);
      } else {
        console.warn(`Image file not found: ${imagePath}`);
      }
    }

    await tx.dayTourActivities.delete({ where: { id } });

    if (serviceId) {
      await tx.service.delete({ where: { id: serviceId } });
    }

    if (additionalFee) {
      await tx.additionalFee.delete({ where: { id: additionalFee.id } });
    }

    return {
      deletedDayTour: existingDayTour,
      deletedService: serviceId ? existingDayTour.service : null,
      deletedAdditionalFee: additionalFee ? additionalFee : null,
    };
  });
};
