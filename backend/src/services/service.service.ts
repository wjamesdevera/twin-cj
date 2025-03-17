import { prisma } from "../config/db";
import path from "path";
import fs from "fs";
import appAssert from "../utils/appAssert";
import { NOT_FOUND } from "../constants/http";

interface CreateDayTourParams {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  serviceCategoryId: number;
  additionalFee?: Partial<{
    type: string;
    description: string;
    amount: number;
  }> | null;
}

export const createDayTour = async (data: CreateDayTourParams) => {
  const category = await prisma.category.create({
    data: { name: "day-tour" },
  });

  const serviceCategory = await prisma.serviceCategory.create({
    data: {
      categoryId: category.id,
    },
  });

  // Create the Day Tour activity
  const createdDayTour = await prisma.dayTourActivities.create({
    data: {
      service: {
        create: {
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl,
          price: data.price,
          serviceCategory: {
            connect: { id: serviceCategory.id },
          },
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
      service: {
        include: { serviceCategory: { include: { category: true } } },
      },
      additionalFee: true,
    },
  });

  return {
    id: createdDayTour.service.id,
    name: createdDayTour.service.name,
    description: createdDayTour.service.description,
    price: createdDayTour.service.price,
    imageUrl: createdDayTour.service.imageUrl,
    categoryName:
      createdDayTour.service.serviceCategory?.category?.name ?? "Day Tour",
    createdAt: createdDayTour.createdAt,
    updatedAt: createdDayTour.updatedAt,
  };
};

// Read all DayTourActivities
export const getAllDayTours = async () => {
  const dayTours = await prisma.dayTourActivities.findMany({
    include: {
      service: {
        include: {
          serviceCategory: {
            include: {
              category: true,
            },
          },
        },
      },
      additionalFee: true,
    },
  });

  return dayTours.map((dayTour) => ({
    id: dayTour.service.id,
    name: dayTour.service.name,
    description: dayTour.service.description,
    price: dayTour.service.price,
    imageUrl: dayTour.service.imageUrl,
    categoryName: dayTour.service.serviceCategory?.category.name || null,
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
      dayTourActivities: {
        include: {
          additionalFee: true,
        },
      },
      serviceCategory: {
        include: {
          category: true,
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
    categoryName: service.serviceCategory?.category?.name ?? null,
    additionalFee: service.dayTourActivities?.[0]?.additionalFee ?? null,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
};

interface UpdateDayTourParams {
  id: number;
  data: {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    additionalFee?: {
      type?: string;
      description?: string;
      amount?: number;
    } | null;
  };
}

export const updateDayTour = async ({ id, data }: UpdateDayTourParams) => {
  const existingDayTour = await prisma.service.findUnique({
    where: { id },
    include: {
      dayTourActivities: {
        include: {
          additionalFee: true,
        },
      },
    },
  });

  appAssert(existingDayTour, NOT_FOUND, `Day tour with ID ${id} not found`);

  const oldImageUrl = existingDayTour.imageUrl;

  const updatedDayTour = await prisma.service.update({
    where: { id },
    data: {
      name: data.name ?? undefined,
      description: data.description ?? undefined,
      price: data.price ?? undefined,
      imageUrl: data.imageUrl ?? undefined,
      dayTourActivities: {
        update: existingDayTour.dayTourActivities.map((activity) => ({
          where: { id: activity.id },
          data: {
            additionalFee: data.additionalFee
              ? {
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
                }
              : undefined,
          },
        })),
      },
    },
    include: {
      dayTourActivities: {
        include: {
          additionalFee: true,
        },
      },
    },
  });

  appAssert(updatedDayTour, NOT_FOUND, `Day tour with ID ${id} not found`);

  // Replace and Update the Image URL
  if (data.imageUrl && oldImageUrl && oldImageUrl !== data.imageUrl) {
    const oldImagePath = path.join(
      __dirname,
      "../../uploads",
      path.basename(oldImageUrl)
    );

    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
      console.log(`Deleted old image file: ${oldImagePath}`);
    } else {
      console.warn(`Old image file not found: ${oldImagePath}`);
    }
  }

  return {
    id: updatedDayTour.id,
    name: updatedDayTour.name,
    description: updatedDayTour.description,
    price: updatedDayTour.price,
    imageUrl: updatedDayTour.imageUrl,
    additionalFee: updatedDayTour.dayTourActivities?.[0]?.additionalFee ?? null,
    createdAt: updatedDayTour.createdAt,
    updatedAt: updatedDayTour.updatedAt,
  };
};

export const deleteDayTour = async (id: number) => {
  // Find the service and related data
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      serviceCategory: {
        include: { category: true },
      },
      bookings: true,
      dayTourActivities: {
        include: { additionalFee: true },
      },
    },
  });

  if (!service) {
    throw new Error(`Service with ID ${id} not found.`);
  }

  // Collect additionalFee IDs
  const additionalFeeIds = service.dayTourActivities
    .map((activity) => activity.additionalFee?.id)
    .filter((id): id is number => id !== undefined);

  // Delete additional fees
  if (additionalFeeIds.length > 0) {
    await prisma.additionalFee.deleteMany({
      where: { id: { in: additionalFeeIds } },
    });
  }

  // Delete related bookings
  if (service.bookings.length > 0) {
    await prisma.bookingService.deleteMany({
      where: { serviceId: id },
    });
  }

  // ⚠️ DELETE `Service` FIRST to prevent FK error
  await prisma.service.delete({
    where: { id },
  });

  // Delete service category
  if (service.serviceCategory) {
    await prisma.serviceCategory.delete({
      where: { id: service.serviceCategory.id },
    });

    // Delete category if no other serviceCategory references it
    const otherServiceCategories = await prisma.serviceCategory.findMany({
      where: { categoryId: service.serviceCategory.category.id },
    });

    if (otherServiceCategories.length === 0) {
      await prisma.category.delete({
        where: { id: service.serviceCategory.category.id },
      });
    }

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
};

export const deleteMultipleDayTour = async (ids: number[]) => {
  // Fetch all services and their related data
  const services = await prisma.service.findMany({
    where: { id: { in: ids } },
    include: {
      serviceCategory: {
        include: { category: true },
      },
      bookings: true,
      dayTourActivities: {
        include: { additionalFee: true },
      },
    },
  });

  if (services.length === 0) {
    throw new Error(`No services found for the given IDs.`);
  }

  // Collect all related IDs for deletion
  const additionalFeeIds = services
    .flatMap((service) =>
      service.dayTourActivities.map((activity) => activity.additionalFee?.id)
    )
    .filter((id): id is number => id !== undefined);

  const serviceCategoryIds = services
    .map((service) => service.serviceCategory?.id)
    .filter((id): id is number => id !== undefined);

  const categoryIds = services
    .map((service) => service.serviceCategory?.category?.id)
    .filter((id): id is number => id !== undefined);

  // Delete additional fees
  if (additionalFeeIds.length > 0) {
    await prisma.additionalFee.deleteMany({
      where: { id: { in: additionalFeeIds } },
    });
  }

  // Delete related bookings
  await prisma.bookingService.deleteMany({
    where: { serviceId: { in: ids } },
  });

  // Delete service categories
  if (serviceCategoryIds.length > 0) {
    await prisma.serviceCategory.deleteMany({
      where: { id: { in: serviceCategoryIds } },
    });
  }

  // Delete categories
  if (categoryIds.length > 0) {
    await prisma.category.deleteMany({
      where: { id: { in: categoryIds } },
    });
  }

  // Delete service images
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

  // Delete services
  await prisma.service.deleteMany({
    where: { id: { in: ids } },
  });
};

export const getCabinById = async (id: number) => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      cabins: {
        include: {
          additionalFee: true,
        },
      },
    },
  });

  console.log("Fetched service data:", service);

  appAssert(service, NOT_FOUND, "Service Not Found");

  const cabin = service.cabins?.[0];

  return {
    id: service.id,
    name: service.name,
    description: service.description,
    price: service.price,
    imageUrl: service.imageUrl,
    additionalFee: cabin?.additionalFee ?? null,
    minCapacity: cabin?.minCapacity ?? 1,
    maxCapacity: cabin?.maxCapacity ?? 1,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
};

export const getAllCabins = async () => {
  try {
    const cabins = await prisma.cabin.findMany({
      include: {
        additionalFee: true,
        service: true,
      },
    });

    return cabins
      .map((cabin) => {
        if (!cabin.service) {
          console.warn(`Cabin ID ${cabin.id} has no associated service.`);
          return null; // Skip cabins without services
        }

        return {
          id: cabin.service.id,
          name: cabin.service.name,
          description: cabin.service.description,
          price: cabin.service.price,
          imageUrl: cabin.service.imageUrl,
          minCapacity: cabin.minCapacity,
          maxCapacity: cabin.maxCapacity,
          additionalFee: cabin.additionalFee ?? null,
          createdAt: cabin.createdAt,
          updatedAt: cabin.updatedAt,
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Error fetching all cabins:", error);
    throw error;
  }
};

type CreateCabinParams = {
  minCapacity: number;
  maxCapacity: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  serviceCategoryId: number;
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
          serviceCategory: {
            connect: {
              id: data.serviceCategoryId, // Connect using the serviceCategoryId
            },
          },
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
  // Fetch existing cabin
  const existingCabin = await prisma.cabin.findUnique({
    where: { id },
    include: {
      additionalFee: true,
      service: true,
    },
  });

  appAssert(existingCabin, NOT_FOUND, `Cabin with ID ${id} not found`);

  // Delete additional fees first if they exist
  if (existingCabin.additionalFee) {
    await prisma.additionalFee.delete({
      where: { id: existingCabin.additionalFee.id },
    });
    console.log(`Deleted additional fee for cabin ID: ${id}`);
  }

  // Delete the cabin itself
  await prisma.cabin.delete({
    where: { id },
  });
  console.log(`Deleted cabin ID: ${id}`);

  // Optional: Delete service if no more cabins are linked to it
  const remainingCabins = await prisma.cabin.count({
    where: { serviceId: existingCabin.serviceId },
  });

  if (remainingCabins === 0) {
    await prisma.service.delete({
      where: { id: existingCabin.serviceId },
    });
    console.log(
      `Deleted service ID: ${existingCabin.serviceId} as it had no more cabins`
    );
  }

  // Delete image file if it exists
  if (existingCabin.service.imageUrl) {
    const imagePath = path.join(
      __dirname,
      "../../uploads",
      path.basename(existingCabin.service.imageUrl)
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log(`Deleted image file: ${imagePath}`);
    } else {
      console.warn(`Image file not found: ${imagePath}`);
    }
  }

  return {
    id: existingCabin.id,
    name: existingCabin.service.name,
    description: existingCabin.service.description,
    price: existingCabin.service.price,
    imageUrl: existingCabin.service.imageUrl,
    minCapacity: existingCabin.minCapacity,
    maxCapacity: existingCabin.maxCapacity,
    createdAt: existingCabin.createdAt,
    updatedAt: existingCabin.updatedAt,
  };
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
  const existingCabin = await prisma.cabin.findUnique({
    where: {
      id,
    },
    include: {
      service: true,
      additionalFee: true,
    },
  });

  appAssert(existingCabin, NOT_FOUND, `Cabin with ID ${id} not found`);

  const oldImageUrl = existingCabin.service.imageUrl;

  const updatedCabin = await prisma.cabin.update({
    where: { id },
    data: {
      minCapacity: data.minCapacity ?? undefined,
      maxCapacity: data.maxCapacity ?? undefined,
      service: {
        update: {
          name: data.name ?? undefined,
          description: data.description ?? undefined,
          price: data.price ?? undefined,
          imageUrl: data.imageUrl ?? undefined,
        },
      },
      additionalFee: data.additionalFee
        ? {
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
          }
        : undefined,
    },
    include: {
      service: true,
      additionalFee: true,
    },
  });

  appAssert(updatedCabin, NOT_FOUND, `Cabin with ID ${id} not found`);

  // Replaces and Updates the Image URL
  if (data.imageUrl && oldImageUrl && oldImageUrl !== data.imageUrl) {
    const oldImagePath = path.join(
      __dirname,
      "../../uploads",
      path.basename(oldImageUrl)
    );

    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
      console.log(`Deleted old image file: ${oldImagePath}`);
    } else {
      console.warn(`Old image file not found: ${oldImagePath}`);
    }
  }

  return {
    id: updatedCabin.id,
    name: updatedCabin.service.name,
    description: updatedCabin.service.description,
    price: updatedCabin.service.price,
    imageUrl: updatedCabin.service.imageUrl,
    additionalFee: updatedCabin.additionalFee,
    minCapacity: updatedCabin.minCapacity,
    maxCapacity: updatedCabin.maxCapacity,
    createdAt: updatedCabin.createdAt,
    updatedAt: updatedCabin.updatedAt,
  };
};
