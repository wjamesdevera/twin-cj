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
      specialRequest,
    } = req.body;

    if (!contactNumber) throw new Error("Contact number is required");

    const referenceCode = await generateReferenceCode();

    // Find Personal Detail
    const personalDetail = await prisma.personalDetail.findUnique({
      where: { phoneNumber: contactNumber },
    });

    if (!personalDetail) {
      throw new Error("Customer not found. Please register first.");
    }

    // Find Customer
    const customer = await prisma.customer.findUnique({
      where: { personalDetailId: personalDetail.id },
    });

    if (!customer) {
      throw new Error("Customer record is missing. Please contact support.");
    }

    // Fetch Existing Booking Status
    const pendingStatus = await prisma.bookingStatus.findFirst({
      where: { name: "Pending" },
    });

    if (!pendingStatus) {
      throw new Error(
        "Booking status 'Pending' is not configured. Please contact an admin."
      );
    }

    // Fetch Existing Payment Status
    const pendingPaymentStatus = await prisma.paymentStatus.findFirst({
      where: { name: "Pending" },
    });

    if (!pendingPaymentStatus) {
      throw new Error(
        "Payment status 'Pending' is not configured. Please contact an admin."
      );
    }

    // Create Transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount: amount || 0,
        proofOfPaymentImageUrl: req.body.proofOfPaymentImageUrl || "",
        paymentStatusId: pendingPaymentStatus.id,
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
        notes: specialRequest || "",
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
