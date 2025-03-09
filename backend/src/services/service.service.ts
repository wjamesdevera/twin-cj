import { prisma } from "../config/db";
import path from "path";
import fs from "fs";
import appAssert from "../utils/appAssert";
import { NOT_FOUND } from "../constants/http";

interface CreateDayTourParams {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  additionalFee?: Partial<{
    type: string;
    description: string;
    amount: number;
  }> | null;
}

export const createDayTour = async (data: CreateDayTourParams) => {
  const createdDayTour = await prisma.dayTourActivities.create({
    data: {
      service: {
        create: {
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl,
          price: data.price,
        },
      },
      ...(data.additionalFee &&
      data.additionalFee.type &&
      data.additionalFee.description &&
      data.additionalFee.amount !== undefined
        ? {
            additionalFee: {
              create: {
                type: data.additionalFee.type,
                description: data.additionalFee.description,
                amount: data.additionalFee.amount,
              },
            },
          }
        : {}),
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
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      dayTourActivity: {
        include: {
          additionalFee: true,
        },
      },
    },
  });

  appAssert(service, NOT_FOUND, "Service Not Found");

  return {
    id: service.id,
    name: service.name,
    description: service.description,
    price: service.price,
    imageUrl: service.imageUrl,
    additionalFee: service.dayTourActivity?.additionalFee,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
};

interface UpdateDayTourParams {
  id: number;
  data: {
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    additionalFee?: Partial<{
      type: string;
      description: string;
      amount: number;
    }> | null;
  };
}

// Update
export const updateDayTour = async ({ id, data }: UpdateDayTourParams) => {
  const existingDayTour = await prisma.service.findUnique({
    where: {
      id,
    },
  });

  appAssert(existingDayTour, NOT_FOUND, `Day tour with ID ${id} not found`);

  const updatedDayTour = await prisma.service.update({
    where: { id },
    data: {
      name: data.name ?? undefined,
      description: data.description ?? undefined,
      price: data.price ?? undefined,
      imageUrl: data.imageUrl ?? undefined,
      dayTourActivity: {
        update: {
          ...(data.additionalFee
            ? {
                additionalFee: {
                  upsert: {
                    create: {
                      type: data.additionalFee.type ?? "default-type",
                      description: data.additionalFee.description ?? "",
                      amount: data.additionalFee.amount ?? 0,
                    },
                    update: {
                      type: data.additionalFee.type ?? undefined,
                      description: data.additionalFee.description ?? undefined,
                      amount: data.additionalFee.amount ?? undefined,
                    },
                  },
                },
              }
            : {}),
        },
      },
    },
    include: {
      dayTourActivity: {
        include: {
          additionalFee: true,
        },
      },
    },
  });

  appAssert(updateDayTour, NOT_FOUND, `Day tour with ID ${id} not found`);

  return {
    id: updatedDayTour.id,
    name: updatedDayTour.name,
    description: updatedDayTour.description,
    price: updatedDayTour.price,
    imageUrl: updatedDayTour.imageUrl,
    additionalFee: updatedDayTour.dayTourActivity?.additionalFee,
    createdAt: updatedDayTour.createdAt,
    updatedAt: updatedDayTour.updatedAt,
  };
};

// Delete
export const deleteDayTour = async (id: number) => {
  const existingDayTour = await prisma.service.findFirst({
    where: {
      id,
    },
  });

  appAssert(existingDayTour, NOT_FOUND, `Day tour with ID ${id} not found`);

  const deletedDayTour = await prisma.service.delete({
    where: { id },
    include: {
      dayTourActivity: {
        include: {
          additionalFee: true,
        },
      },
    },
  });

  if (deletedDayTour.imageUrl) {
    const imagePath = path.join(
      __dirname,
      "../../uploads",
      path.basename(deletedDayTour.imageUrl)
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log(`Deleted image file: ${imagePath}`);
    } else {
      console.warn(`Image file not found: ${imagePath}`);
    }
  }
};

export const deleteMultipleDayTour = async (ids: number[]) => {
  const services = await prisma.service.findMany({
    where: { id: { in: ids } },
    select: { imageUrl: true },
  });

  services.forEach((service) => {
    if (service.imageUrl) {
      const imagePath = path.join(
        __dirname,
        "../../uploads",
        path.basename(service.imageUrl)
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Deleted image file: ${imagePath}`);
      } else {
        console.warn(`Image file not found: ${imagePath}`);
      }
    }
  });
  await prisma.service.deleteMany({
    where: {
      id: { in: ids },
    },
  });
};

export const getCabinById = async (id: number) => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      cabin: {
        include: {
          additionalFee: true,
        },
      },
    },
  });

  appAssert(service, NOT_FOUND, "Service Not Found");

  return {
    id: service.id,
    name: service.name,
    description: service.description,
    price: service.price,
    imageUrl: service.imageUrl,
    additionalFee: service.cabin?.additionalFee,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
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
      minCapacity: cabin.minCapacity,
      maxCapacity: cabin.maxCapacity,
      additionalFee: cabin.additionalFee,
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
  price: number;
  imageUrl: string;
  additionalFee?: Partial<{
    type: string;
    description: string;
    amount: number;
  }> | null;
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
          price: data.price,
          imageUrl: data.imageUrl,
        },
      },
      ...(data.additionalFee &&
      data.additionalFee.type &&
      data.additionalFee.description &&
      data.additionalFee.amount !== undefined
        ? {
            additionalFee: {
              create: {
                type: data.additionalFee.type,
                description: data.additionalFee.description,
                amount: data.additionalFee.amount,
              },
            },
          }
        : {}),
    },
    include: {
      service: true,
      additionalFee: true,
    },
  });

  return {
    id: createdCabin.service.id,
    name: createdCabin.service.name,
    description: createdCabin.service.description,
    price: createdCabin.service.price,
    imageUrl: createdCabin.service.imageUrl,
    minCapacity: createdCabin.minCapacity,
    maxCapacity: createdCabin.maxCapacity,
    createdAt: createdCabin.service.createdAt,
    updatedAt: createdCabin.service.updatedAt,
  };
};

export const deleteMultipleCabin = async (ids: number[]) => {
  const services = await prisma.service.findMany({
    where: { id: { in: ids } },
    select: { imageUrl: true },
  });

  services.forEach((service) => {
    if (service.imageUrl) {
      const imagePath = path.join(
        __dirname,
        "../../uploads",
        path.basename(service.imageUrl)
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Deleted image file: ${imagePath}`);
      } else {
        console.warn(`Image file not found: ${imagePath}`);
      }
    }
  });

  await prisma.service.deleteMany({
    where: {
      id: { in: ids },
    },
  });
};

export const deleteCabin = async (id: number) => {
  const existingCabin = await prisma.service.findUnique({
    where: {
      id,
    },
  });

  appAssert(existingCabin, NOT_FOUND, `Cabin with ID ${id} not found`);

  const deletedCabin = await prisma.service.delete({
    where: { id },
    include: {
      dayTourActivity: {
        include: {
          additionalFee: true,
        },
      },
    },
  });

  if (deletedCabin.imageUrl) {
    const imagePath = path.join(
      __dirname,
      "../../uploads",
      path.basename(deletedCabin.imageUrl)
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log(`Deleted image file: ${imagePath}`);
    } else {
      console.warn(`Image file not found: ${imagePath}`);
    }
  }
};

interface UpdateCabinParams {
  id: number;
  data: {
    minCapacity: number;
    maxCapacity: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    additionalFee?: Partial<{
      type: string;
      description: string;
      amount: number;
    }> | null;
  };
}

export const updateCabin = async ({ id, data }: UpdateCabinParams) => {
  const existingCabin = await prisma.service.findUnique({
    where: {
      id,
    },
  });

  appAssert(existingCabin, NOT_FOUND, `Day tour with ID ${id} not found`);

  const updatedCabin = await prisma.service.update({
    where: { id },
    data: {
      name: data.name ?? undefined,
      description: data.description ?? undefined,
      price: data.price ?? undefined,
      imageUrl: data.imageUrl ?? undefined,
      cabin: {
        update: {
          minCapacity: data.minCapacity ?? undefined,
          maxCapacity: data.maxCapacity ?? undefined,
          ...(data.additionalFee
            ? {
                additionalFee: {
                  upsert: {
                    create: {
                      type: data.additionalFee.type ?? "default-type",
                      description: data.additionalFee.description ?? "",
                      amount: data.additionalFee.amount ?? 0,
                    },
                    update: {
                      type: data.additionalFee.type ?? undefined,
                      description: data.additionalFee.description ?? undefined,
                      amount: data.additionalFee.amount ?? undefined,
                    },
                  },
                },
              }
            : {}),
        },
      },
    },
    include: {
      cabin: {
        include: {
          additionalFee: true,
        },
      },
    },
  });

  appAssert(updatedCabin, NOT_FOUND, `Day tour with ID ${id} not found`);

  return {
    id: updatedCabin.id,
    name: updatedCabin.name,
    description: updatedCabin.description,
    price: updatedCabin.price,
    imageUrl: updatedCabin.imageUrl,
    additionalFee: updatedCabin.cabin?.additionalFee,
    minCapacity: updatedCabin.cabin?.minCapacity,
    maxCapacity: updatedCabin.cabin?.maxCapacity,
    createdAt: updatedCabin.createdAt,
    updatedAt: updatedCabin.updatedAt,
  };
};
