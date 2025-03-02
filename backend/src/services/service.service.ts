import { prisma } from '../config/db';

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
  return await prisma.dayTourActivities.create({
    data: {
      service: {
        create: {
          name: input.name,
          description: input.description,
          imageUrl: input.imageUrl,
          price: input.price,
        },
      },
      additionalFee:
        input.additionalFee &&
        input.additionalFee.type &&
        input.additionalFee.description &&
        input.additionalFee.amount !== undefined
          ? {
              create: {
                type: input.additionalFee.type,
                description: input.additionalFee.description,
                amount: input.additionalFee.amount,
              },
            }
          : undefined,
    },
    include: {
      service: true,
      additionalFee: true,
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
    additionalFee: {
      type?: string;
      description?: string;
      amount?: number;
    };
  }
) => {
  const updateData: any = {
    updatedAt: new Date(),
    service: {
      update: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        price: parseFloat(data.rate.toString()),
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
  return await prisma.dayTourActivities.delete({
    where: { id },
  });
};
