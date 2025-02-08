import { prisma } from "../config/db";

// Create
export const createDayTour = async (data: {
  name: string;
  description: string;
  imageUrl: string;
  rate: number;
  quantity: number;
}) => {
  return await prisma.dayTourActivities.create({
    data: {
      service: {
        create: {
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl,
          price: data.rate,
          quantity: data.quantity,
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

// Delete
export const deleteDayTour = async (id: number) => {
  return await prisma.dayTourActivities.delete({
    where: { id },
  });
};
