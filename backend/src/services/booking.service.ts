import { request } from "http";
import { prisma } from "../config/db";
import { generateReferenceCode } from "../utils/referenceCodeGenerator";

interface ServiceCategory {
  id: number;
  name: string;
}

interface Service {
  id: number;
  serviceCategoryId: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export const getServicesByCategory = async (type: string) => {
  try {
    // Fetch all services with associated categories
    const services = await prisma.service.findMany({
      include: {
        serviceCategory: {
          include: {
            category: true,
          },
        },
      },
    });

    // Filter services by the provided category type
    const filteredServices = services.filter(
      (service) => service.serviceCategory?.category?.name === type
    );

    console.log(
      `Filtered Services for ${type}:`,
      JSON.stringify(filteredServices, null, 2)
    );

    // Organize services by service category
    const categorizedServices: Record<
      string,
      { services: Service[]; category: ServiceCategory }
    > = {};

    filteredServices.forEach((service) => {
      if (!service.serviceCategory?.category) {
        console.warn("Service missing category:", service);
        return;
      }

      const categoryName = service.serviceCategory.category.name;
      const categoryDetails: ServiceCategory = {
        id: service.serviceCategory.category.id,
        name: service.serviceCategory.category.name,
      };

      if (!categorizedServices[categoryName]) {
        categorizedServices[categoryName] = {
          services: [],
          category: categoryDetails,
        };
      }

      categorizedServices[categoryName].services.push({
        id: service.id,
        serviceCategoryId: service.serviceCategory.id,
        name: service.name,
        description: service.description,
        imageUrl: service.imageUrl,
        price: service.price,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      });
    });

    return categorizedServices;
  } catch (error) {
    console.error("Error fetching services by category:", error);
    throw new Error("Failed to fetch services by category");
  }
};
