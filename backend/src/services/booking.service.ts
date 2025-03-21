import { Request, Response } from "express";
import { prisma } from "../config/db";
import { generateReferenceCode } from "../utils/referenceCodeGenerator";
import appAssert from "../utils/appAssert";
import { BAD_REQUEST } from "../constants/http";
import { parse } from "path";

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

export const checkAvailability = async (
  checkInDate: string,
  checkOutDate: string
): Promise<Service[]> => {
  try {
    if (!checkInDate || !checkOutDate) {
      throw new Error("Invalid dates provided");
    }

    // Get all services
    const allServices = await prisma.service.findMany();

    // Get unavailable services
    const bookedServices = await prisma.bookingService.findMany({
      where: {
        booking: {
          checkIn: { lte: new Date(checkOutDate) },
          checkOut: { gte: new Date(checkInDate) },
        },
      },
      select: { serviceId: true },
    });

    const bookedServiceIds = new Set(bookedServices.map((bs) => bs.serviceId));

    // Filter available services
    const availableServices = allServices.filter(
      (service) => !bookedServiceIds.has(service.id)
    );

    return availableServices;
  } catch (error: any) {
    console.error("Error checking availability:", error.message);
    throw new Error("Failed to check availability");
  }
};

export const getServicesByCategory = async (
  type: string,
  checkInDate: string,
  checkOutDate: string
) => {
  try {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const services = await prisma.service.findMany({
      where: {
        serviceCategory: {
          category: {
            name: type,
          },
        },
      },
      select: {
        id: true,
        serviceCategoryId: true,
        name: true,
        description: true,
        imageUrl: true,
        price: true,
        createdAt: true,
        updatedAt: true,
        serviceCategory: {
          select: {
            id: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!services || services.length === 0) {
      return {};
    }

    // Fetch the booked services
    const bookedServices = await prisma.bookingService.findMany({
      where: {
        booking: {
          checkIn: { lte: checkOut },
          checkOut: { gte: checkIn },
        },
      },
      select: {
        serviceId: true,
      },
    });

    const bookedServiceIds = bookedServices.map((booking) => booking.serviceId);

    // Filter out booked services from the available services
    const availableServices = services.filter(
      (service) => !bookedServiceIds.includes(service.id)
    );

    // Categorize available services
    const categorizedServices: Record<
      string,
      { services: typeof availableServices; category: ServiceCategory }
    > = {};

    availableServices.forEach((service) => {
      const category = service.serviceCategory?.category;
      if (!category) {
        console.warn("Service missing category:", service);
        return;
      }

      if (!categorizedServices[category.name]) {
        categorizedServices[category.name] = {
          services: [],
          category: {
            id: category.id,
            name: category.name,
          },
        };
      }

      categorizedServices[category.name].services.push({
        id: service.id,
        serviceCategoryId: service.serviceCategoryId,
        name: service.name,
        description: service.description,
        imageUrl: service.imageUrl,
        price: service.price,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
        serviceCategory: service.serviceCategory,
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
    const parsedBookingData = JSON.parse(req.body.bookingData || "{}");

    const {
      firstName,
      lastName,
      contactNumber,
      email,
      checkInDate,
      checkOutDate,
      bookingCards,
    } = parsedBookingData;

    appAssert(email, BAD_REQUEST, "Email is required.");
    appAssert(firstName, BAD_REQUEST, "First name is required.");
    appAssert(lastName, BAD_REQUEST, "Last name is required.");
    appAssert(contactNumber, BAD_REQUEST, "Contact number is required.");
    appAssert(checkInDate, BAD_REQUEST, "Check-in date is required.");
    appAssert(checkOutDate, BAD_REQUEST, "Check-out date is required.");
    appAssert(
      Array.isArray(bookingCards) && bookingCards.length > 0,
      BAD_REQUEST,
      "Choose at least one Package."
    );

    const referenceCode = await generateReferenceCode();

    const totalGuest =
      (parsedBookingData.guestCounts?.adults || 0) +
      (parsedBookingData.guestCounts?.children || 0);

    const amount = (bookingCards ?? []).reduce(
      (total: number, card: { price: string }) => {
        const cardPrice = parseFloat(card.price);
        return isNaN(cardPrice) ? total : total + cardPrice;
      },
      0
    );

    // Find Personal Detail
    let personalDetail = await prisma.personalDetail.findUnique({
      where: { email: email },
    });

    if (!personalDetail) {
      personalDetail = await prisma.personalDetail.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          phoneNumber: contactNumber,
          email: email,
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

    // Find Booking Status
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
        amount: amount,
        proofOfPaymentImageUrl: req.file?.path,
      },
    });

    // Create Booking
    const booking = await prisma.booking.create({
      data: {
        referenceCode,
        checkIn: new Date(checkInDate),
        checkOut: new Date(checkOutDate),
        totalPax: totalGuest,
        notes: parsedBookingData.specialRequest || "",
        customerId: customer.id,
        bookingStatusId: pendingBookingStatus.id,
        transactionId: transaction.id,
      },
    });

    const bookingServices = await Promise.all(
      bookingCards.map((card: { id: number }) =>
        prisma.bookingService.create({
          data: {
            bookingId: booking.id,
            serviceId: card.id,
          },
        })
      )
    );

    return { referenceCode, booking, transaction, bookingServices };
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error("Failed to create booking");
  }
};
