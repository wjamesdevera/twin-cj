import { Request, Response } from "express";
import { prisma } from "../config/db";
import { generateReferenceCode } from "../utils/referenceCodeGenerator";
import appAssert from "../utils/appAssert";
import { BAD_REQUEST, NOT_FOUND } from "../constants/http";
import { ROOT_STATIC_URL } from "../constants/url";
import path from "path";
import fs from "fs";

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
        amount: amount,
        proofOfPaymentImageUrl: req.body.proofOfPaymentImageUrl || "",
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

export const getBookingStatus = async (referenceCode: string) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { referenceCode },
      include: {
        customer: true,
        bookingStatus: true,
        services: {
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
        },
        transaction: true,
      },
    });

    appAssert(booking, NOT_FOUND, "Booking not found");

    return {
      id: booking.id,
      referenceCode: booking.referenceCode,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      totalPax: booking.totalPax,
      notes: booking.notes,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      customerId: booking.customerId,
      bookingStatusId: booking.bookingStatusId,
      transactionId: booking.transactionId,
      customer: booking.customer
        ? {
            id: booking.customer.id,
            personalDetailId: booking.customer.personalDetailId,
            createdAt: booking.customer.createdAt,
            updatedAt: booking.customer.updatedAt,
          }
        : null,
      bookingStatus: booking.bookingStatus
        ? {
            id: booking.bookingStatus.id,
            name: booking.bookingStatus.name,
            createdAt: booking.bookingStatus.createdAt,
            updatedAt: booking.bookingStatus.updatedAt,
          }
        : null,
      services: booking.services.map((booking) => ({
        id: booking.service.id,
        name: booking.service.name,
        description: booking.service.description,
        imageUrl: booking.service.imageUrl,
        price: booking.service.price,
        createdAt: booking.service.createdAt,
        updatedAt: booking.service.updatedAt,
        serviceCategoryId: booking.service.serviceCategoryId,
        serviceCategory: booking.service.serviceCategory
          ? {
            id: booking.service.serviceCategory.id,
            categoryId: booking.service.serviceCategory.categoryId,
            category: booking.service.serviceCategory.category
              ? {
                id: booking.service.serviceCategory.category.id,
                name: booking.service.serviceCategory.category.name,
                createdAt: booking.service.serviceCategory.category.createdAt,
                updatedAt: booking.service.serviceCategory.category.updatedAt,
              } : null,
          } : null,
      })),
      transaction: booking.transaction
        ? {
            id: booking.transaction.id,
            proofOfPaymentImageUrl: booking.transaction.proofOfPaymentImageUrl,
            amount: booking.transaction.amount,
            createdAt: booking.transaction.createdAt,
            updatedAt: booking.transaction.updatedAt,
            paymentAccountId: booking.transaction.paymentAccountId,
            paymentStatusId: booking.transaction.paymentStatusId,
          }
        : null,
    };
  } catch (error) {
    console.error("Error fetching booking status:", error);
  }
};

export const reuploadPaymentImage = async (
  referenceCode: string,
  file: Express.Multer.File
) => {
  appAssert(file, BAD_REQUEST, "No file uploaded");

  const booking = await prisma.booking.findUnique({
    where: { referenceCode },
    include: { transaction: true },
  });

  appAssert(booking, NOT_FOUND, "Booking not found");
  appAssert(booking.transaction, NOT_FOUND, "Transaction not found");

  const oldImageUrl = booking.transaction.proofOfPaymentImageUrl;
  const proofOfPaymentImageUrl = `${ROOT_STATIC_URL}/${file.filename}`;

  await prisma.transaction.update({
    where: { id: booking.transactionId },
    data: { proofOfPaymentImageUrl },
  });

  const pendingStatus = await prisma.bookingStatus.findUnique({
    where: { name: "Pending" },
  });

  appAssert(pendingStatus, NOT_FOUND, "Pending status not found");

  await prisma.booking.update({
    where: { referenceCode },
    data: { bookingStatusId: pendingStatus.id },
  });

  if (oldImageUrl) {
    const oldImagePath = path.join(
      __dirname,
      "../../uploads",
      path.basename(oldImageUrl)
    );
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  return proofOfPaymentImageUrl;
};
