import { Request, Response } from "express";
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
    const services = await prisma.service.findMany({
      include: {
        serviceCategory: {
          include: {
            category: true,
          },
        },
      },
    });

    const filteredServices = services.filter(
      (service) => service.serviceCategory?.category?.name === type
    );

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

export const createBooking = async (req: Request) => {
  try {
    const referenceCode = await generateReferenceCode();

    const safeParse = (data: any, fallback: any) => {
      try {
        return typeof data === "string" ? JSON.parse(data) : data;
      } catch {
        return fallback;
      }
    };

    const totalPax =
      (req.body.guestCounts?.adults || 0) +
      (req.body.guestCounts?.children || 0);

    let personalDetail = await prisma.personalDetail.findUnique({
      where: { phoneNumber: req.body.contactNumber || "" },
    });

    if (!personalDetail) {
      personalDetail = await prisma.personalDetail.create({
        data: {
          firstName: req.body.firstName || "",
          lastName: req.body.lastName || "",
          phoneNumber: req.body.contactNumber || "",
          email: req.body.email || "",
        },
      });
    }

    let customer = await prisma.customer.findUnique({
      where: { personalDetailId: personalDetail.id },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: { personalDetailId: personalDetail.id },
      });
    }

    let pendingStatus = await prisma.bookingStatus.findFirst({
      where: { name: "Pending" },
    });

    if (!pendingStatus) {
      pendingStatus = await prisma.bookingStatus.create({
        data: { name: "Pending" },
      });
    }

    let pendingPaymentStatus = await prisma.paymentStatus.findFirst({
      where: { name: "Pending" },
    });

    if (!pendingPaymentStatus) {
      pendingPaymentStatus = await prisma.paymentStatus.create({
        data: { name: "Pending" },
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount: req.body.amount || 0,
        proofOfPaymentImageUrl: req.body.proofOfPaymentImageUrl || "",
        paymentStatusId: pendingPaymentStatus.id,
      },
    });

    const booking = await prisma.booking.create({
      data: {
        referenceCode,
        checkIn: req.body.checkInDate,
        checkOut: req.body.checkOutDate,
        totalPax,
        notes: req.body.specialRequest || "",
        customerId: customer.id,
        bookingStatusId: pendingStatus.id,
        transactionId: transaction.id,
      },
    });

    return { referenceCode, booking, transaction };
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error("Failed to create booking");
  }
};
