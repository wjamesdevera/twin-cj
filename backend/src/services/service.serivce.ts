import { prisma } from '../config/db';

interface CreateDayTourInput {
  name: string;
  description: string;
  imageUrl: string;
  rate: number;
  quantity?: number;
}

export const createDayTour = async (input: CreateDayTourInput) => {
  return await prisma.dayTourActivities.create({
    data: {
      service: {
        create: {
          name: input.name,
          description: input.description,
          imageUrl: input.imageUrl,
          price: input.rate,
          quantity: input.quantity ?? 0,
        },
      },
    },
    include: {
      service: true,
    },
  });
};

// Read all DayTourActivities
export const getAllDayTours = async () => {
  return await prisma.dayTourActivities.findMany({
    include: {
      service: true,
      additionalFee: true,
    },
  });
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
    rate: number;
    quantity: number;
  }
) => {
  return await prisma.dayTourActivities.update({
    where: { id },
    data: {
      service: {
        update: {
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl,
          price: parseFloat(data.rate.toString()),
          quantity: data.quantity,
        },
      },
    },
    include: {
      service: true,
    },
  });
};

// Delete
export const deleteDayTour = async (id: number) => {
  return await prisma.dayTourActivities.delete({
    where: { id },
  });
};
