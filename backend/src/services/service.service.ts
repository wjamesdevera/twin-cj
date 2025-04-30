import { prisma } from "../config/db";
import path from "path";
import fs from "fs";
import appAssert from "../utils/appAssert";
import { BAD_REQUEST, NOT_FOUND } from "../constants/http";
import { O } from "@faker-js/faker/dist/airline-CBNP41sR";

interface CreateDayTourParams {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  serviceCategoryId: number;
}

export const createDayTour = async (data: CreateDayTourParams) => {

  const serviceCategory = await prisma.serviceCategory.create({
    data: {
      categoryId: 2,
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
    },
    include: {
      service: {
        include: { serviceCategory: { include: { category: true } } },
      },
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
    },
  });

  return dayTours.map((dayTour) => ({
    id: dayTour.service.id,
    name: dayTour.service.name,
    description: dayTour.service.description,
    price: dayTour.service.price,
    imageUrl: dayTour.service.imageUrl,
    categoryName: dayTour.service.serviceCategory?.category.name || null,
    createdAt: dayTour.createdAt,
    updatedAt: dayTour.updatedAt,
  }));
};

// Read a specific DayTourActivity by ID
export const getDayTourById = async (id: number) => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      dayTourActivities: true,
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
  };
}

export const updateDayTour = async ({ id, data }: UpdateDayTourParams) => {
  const existingDayTour = await prisma.service.findUnique({
    where: { id },
    include: {
      dayTourActivities: true,
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
    },
    include: {
      dayTourActivities: true,
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
    createdAt: updatedDayTour.createdAt,
    updatedAt: updatedDayTour.updatedAt,
  };
};

export const deleteDayTour = async (id: number) => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      serviceCategory: {
        include: { category: true },
      },
      bookings: true,
      dayTourActivities: true,
    },
  });

  if (!service) {
    throw new Error(`Service with ID ${id} not found.`);
  }

  if (service.bookings.length > 0) {
    await prisma.bookingService.deleteMany({
      where: { serviceId: id },
    });
  }

  await prisma.service.delete({
    where: { id },
  });

  if (service.serviceCategory) {
    await prisma.serviceCategory.delete({
      where: { id: service.serviceCategory.id },
    });

    const otherServiceCategories = await prisma.serviceCategory.findMany({
      where: { categoryId: service.serviceCategory.category.id },
    });

    if (otherServiceCategories.length === 0) {
      await prisma.category.delete({
        where: { id: service.serviceCategory.category.id },
      });
    }

    // Delete Image
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
  const services = await prisma.service.findMany({
    where: { id: { in: ids } },
    include: {
      serviceCategory: {
        include: { category: true },
      },
      bookings: true,
      dayTourActivities: true,
    },
  });

  if (services.length === 0) {
    throw new Error(`No services found for the given IDs.`);
  }

  const serviceCategoryIds = services
    .map((service) => service.serviceCategory?.id)
    .filter((id): id is number => id !== undefined);

  const categoryIds = services
    .map((service) => service.serviceCategory?.category?.id)
    .filter((id): id is number => id !== undefined);

  await prisma.bookingService.deleteMany({
    where: { serviceId: { in: ids } },
  });

  if (serviceCategoryIds.length > 0) {
    await prisma.serviceCategory.deleteMany({
      where: { id: { in: serviceCategoryIds } },
    });
  }

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

  await prisma.service.deleteMany({
    where: { id: { in: ids } },
  });
};

export const getCabinById = async (id: number) => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      cabins: true,
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
    minCapacity: cabin?.minCapacity ?? 1,
    maxCapacity: cabin?.maxCapacity ?? 1,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
};

export const getAllCabins = async () => {
  const cabins = await prisma.cabin.findMany({
    include: {
      service: true,
    },
  });

  return cabins
    .map((cabin) => {
      if (!cabin.service) {
        console.warn(`Cabin ID ${cabin.id} has no associated service.`);
        return null;
      }

      return {
        id: cabin.service.id,
        name: cabin.service.name,
        description: cabin.service.description,
        price: cabin.service.price,
        imageUrl: cabin.service.imageUrl,
        minCapacity: cabin.minCapacity,
        maxCapacity: cabin.maxCapacity,
        createdAt: cabin.createdAt,
        updatedAt: cabin.updatedAt,
      };
    })
    .filter(Boolean);
};

type CreateCabinParams = {
  minCapacity: number;
  maxCapacity: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  serviceCategoryId: number;
};

export const createCabin = async (data: CreateCabinParams) => {

  const serviceCategory = await prisma.serviceCategory.create({
    data: {
      categoryId: 1,
    },
  });

  // Create the Cabin
  const createdCabin = await prisma.cabin.create({
    data: {
      minCapacity: data.minCapacity,
      maxCapacity: data.maxCapacity,
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
    },
    include: {
      service: {
        include: { serviceCategory: { include: { category: true } } },
      },
    },
  });

  return {
    id: createdCabin.service.id,
    name: createdCabin.service.name,
    description: createdCabin.service.description,
    price: createdCabin.service.price,
    imageUrl: createdCabin.service.imageUrl,
    categoryName:
      createdCabin.service.serviceCategory?.category?.name ?? "Cabin",
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
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      serviceCategory: {
        include: { category: true },
      },
      bookings: true,
      dayTourActivities: true,
    },
  });

  if (!service) {
    throw new Error(`Service with ID ${id} not found.`);
  }

  if (service.bookings.length > 0) {
    await prisma.bookingService.deleteMany({
      where: { serviceId: id },
    });
  }

  await prisma.service.delete({
    where: { id },
  });

  if (service.serviceCategory) {
    await prisma.serviceCategory.delete({
      where: { id: service.serviceCategory.id },
    });

    const otherServiceCategories = await prisma.serviceCategory.findMany({
      where: { categoryId: service.serviceCategory.category.id },
    });

    if (otherServiceCategories.length === 0) {
      await prisma.category.delete({
        where: { id: service.serviceCategory.category.id },
      });
    }

    // Delete Image
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

interface UpdateCabinParams {
  id: number;
  data: {
    minCapacity: number;
    maxCapacity: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
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
  };
}

export const updateCabin = async ({ id, data }: UpdateCabinParams) => {
  const existingCabinService = await prisma.service.findUnique({
    where: { id },
    include: {
      cabins: true,
    },
  });

  appAssert(
    existingCabinService,
    NOT_FOUND,
    `Cabin service with ID ${id} not found`
  );

  const oldImageUrl = existingCabinService.imageUrl;

  const updatedCabinService = await prisma.service.update({
    where: { id },
    data: {
      name: data.name ?? undefined,
      description: data.description ?? undefined,
      price: data.price ?? undefined,
      imageUrl: data.imageUrl ?? undefined,
      cabins: {
        update: existingCabinService.cabins.map((cabin) => ({
          where: { id: cabin.id },
          data: {
            minCapacity: data.minCapacity ?? undefined,
            maxCapacity: data.maxCapacity ?? undefined,
          },
        })),
      },
    },
    include: {
      cabins: true,
    },
  });

  appAssert(
    updatedCabinService,
    NOT_FOUND,
    `Cabin service with ID ${id} not found`
  );

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
    id: updatedCabinService.id,
    name: updatedCabinService.name,
    description: updatedCabinService.description,
    price: updatedCabinService.price,
    imageUrl: updatedCabinService.imageUrl,
    createdAt: updatedCabinService.createdAt,
    updatedAt: updatedCabinService.updatedAt,
  };
};
