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
    const {
      firstName,
      lastName,
      contactNumber,
      email,
      checkInDate,
      checkOutDate,
      amount,
    } = req.body;

    if (!contactNumber) throw new Error("Contact number is required");

    const referenceCode = await generateReferenceCode();

    // Find Personal Detail
    let personalDetail = await prisma.personalDetail.findUnique({
      where: { email: req.body.email },
    });

    if (!personalDetail) {
      personalDetail = await prisma.personalDetail.create({
        data: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.contactNumber,
          email: req.body.email,
        },
      });
    }

    // Find Customer
    let customer = await prisma.customer.findUnique({
      where: { personalDetailId: personalDetail.id },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          personalDetailId: personalDetail.id,
        },
      });
    }

    // Find or Create Booking Status
    let pendingBookingStatus = await prisma.bookingStatus.findUnique({
      where: { name: "Pending" },
    });

    if (!pendingBookingStatus) {
      pendingBookingStatus = await prisma.bookingStatus.create({
        data: { name: "Pending" },
      });
    }

    // Create Transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount: req.body.amount || 0,
        proofOfPaymentImageUrl: req.body.proofOfPaymentImageUrl || "",
      },
    });

    // Create Booking
    const booking = await prisma.booking.create({
      data: {
        referenceCode,
        checkIn: new Date(checkInDate),
        checkOut: new Date(checkOutDate),
        totalPax:
          (req.body.guestCounts?.adults || 0) +
          (req.body.guestCounts?.children || 0),
        notes: req.body.specialRequest || "",
        customerId: customer.id,
        bookingStatusId: pendingBookingStatus.id,
        transactionId: transaction.id,
      },
    });

    return { referenceCode, booking, transaction };
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error("Failed to create booking");
  }
};
