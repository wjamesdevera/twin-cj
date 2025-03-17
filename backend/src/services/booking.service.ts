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
    console.log("Creating booking with:");
    console.log("Reference Code:", referenceCode);
    console.log("Check-In:", req.body.checkInDate);
    console.log("Check-Out:", req.body.checkOutDate);

    const safeParse = (data: any, fallback: any) => {
      try {
        return typeof data === "string" ? JSON.parse(data) : data;
      } catch {
        return fallback;
      }
    };

    // Calculate totalPax
    const totalPax =
      (req.body.guestCounts?.adults || 0) +
      (req.body.guestCounts?.children || 0);

    // Step 1: Get or Create Personal Detail
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

    // Step 2: Get or Create Customer
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
      console.log("⚠️ 'Pending' status not found. Creating it...");
      pendingStatus = await prisma.bookingStatus.create({
        data: { name: "Pending" },
      });
    }

    // Step 4: Create Booking
    const booking = await prisma.booking.create({
      data: {
        referenceCode,
        checkIn: req.body.checkInDate,
        checkOut: req.body.checkOutDate,
        totalPax,
        notes: req.body.specialRequest || "",
        customerId: customer.id, // ✅ Now included
        bookingStatusId: pendingStatus.id,
      },
    });

    console.log("✅ Booking Created:", booking.id);

    // Step 5: Create Transaction (Ensure payment details exist)
    const paymentDetails = safeParse(req.body.paymentDetails, {});
    let pendingPaymentStatus = await prisma.paymentStatus.findFirst({
      where: { name: "Pending" },
    });

    if (!pendingPaymentStatus) {
      console.log("⚠️ 'Pending' payment status not found. Creating it...");
      pendingPaymentStatus = await prisma.paymentStatus.create({
        data: { name: "Pending" },
      });
    }

    // Step 6: Create Transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount: req.body.amount || 0,
        proofOfPaymentImageUrl: req.body.proofOfPaymentImageUrl || "",
        paymentStatusId: pendingPaymentStatus.id, // Use the correct 'Pending' payment status ID
        booking: { connect: { id: booking.id } },
      },
    });

    console.log("✅ Transaction Created:", transaction.id);

    return { referenceCode, booking, transaction };
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error("Failed to create booking");
  }
};
