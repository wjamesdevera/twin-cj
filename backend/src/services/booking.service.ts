import { Request, Response } from "express";
import { prisma } from "../config/db";
import { generateReferenceCode } from "../utils/referenceCodeGenerator";
import appAssert from "../utils/appAssert";
import { BAD_REQUEST, NOT_FOUND } from "../constants/http";
import { sendMail } from "../utils/sendMail";
import {
  getBookingApprovedEmailTemplate,
  getBookingCancelledEmailTemplate,
  getBookingCompleteEmailTemplate,
  getBookingRescheduledEmailTemplate,
  getBookingSuccessEmailTemplate,
  getOTPEmailTemplate,
} from "../utils/emailTemplates";
import { ROOT_STATIC_URL } from "../constants/url";
import path from "path";
import fs from "fs";
import { generateOTP, storeOTP, validateOTP } from "../utils/otpGenerator";

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

// Check Availability
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
          bookingStatus: {
            NOT: {
              name: {
                in: ["Cancelled", "Rescheduled"],
              },
            },
          },
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
          bookingStatus: {
            NOT: {
              name: {
                in: ["Cancelled", "Rescheduled"],
              },
            },
          },
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

// Create Bookings for Customer side
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

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const duration = checkOut.getTime() - checkIn.getTime();
    const numberOfNights = Math.ceil(duration / (1000 * 60 * 60 * 24));

    const amount = (bookingCards ?? []).reduce(
      (total: number, card: { price: string }) => {
        const cardPrice = parseFloat(card.price);

        if (numberOfNights > 1) {
          let additionalCardPrice = (cardPrice + 500) * (numberOfNights - 1);
          return (cardPrice + additionalCardPrice) / 2;
        } else {
          return isNaN(cardPrice) ? total / 2 : (total + cardPrice) / 2;
        }
      },
      0
    );

    // Find Personal Detail
    let customer = await prisma.customer.findFirst({
      where: {
        personalDetail: {
          email: email,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: lastName,
        },
      },
      include: {
        personalDetail: true,
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          personalDetail: {
            create: {
              email: email,
              firstName: firstName,
              lastName: lastName,
              phoneNumber: lastName,
            },
          },
        },
        include: {
          personalDetail: true,
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

    const services = bookingCards.map((card) => card.name);

    const { error } = await sendMail({
      to: customer.personalDetail?.email || "delivered@resend.dev",
      ...getBookingSuccessEmailTemplate(
        referenceCode,
        `${customer.personalDetail?.firstName} ${customer.personalDetail?.lastName}`,
        `${new Date(checkInDate).toLocaleDateString("en-US", {
          weekday: "short",
          month: "long",
          day: "2-digit",
          year: "numeric",
        })} - ${new Date(checkOutDate).toLocaleDateString("en-US", {
          weekday: "short",
          month: "long",
          day: "2-digit",
          year: "numeric",
        })}`,
        services
      ),
    });

    if (error) console.log(error);

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

// Admin Dashboard Latest Bookings
export const getLatestBookings = async () => {
  try {
    const latestBookings = await prisma.booking.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        services: {
          include: {
            service: true,
          },
        },
        transaction: true,
        customer: {
          include: {
            personalDetail: true,
          },
        },
        bookingStatus: true,
      },
    });

    const bookings = latestBookings.map((booking) => ({
      referenceNo: booking.referenceCode,
      checkIn: booking.checkIn.toISOString(),
      checkOut: booking.checkOut.toISOString(),
      service: booking.services[0]?.service?.name || "N/A",
      total: booking.transaction?.amount || 0,
      customerName: `${booking.customer.personalDetail?.firstName ?? ""} ${
        booking.customer.personalDetail?.lastName ?? ""
      }`,
      email: booking.customer.personalDetail?.email || "N/A",
      status: booking.bookingStatus.name,
    }));

    const pendingReservations = latestBookings.filter(
      (b) => b.bookingStatus.name === "Pending"
    ).length;
    const activeReservations = latestBookings.filter(
      (b) => b.bookingStatus.name === "Active"
    ).length;

    return {
      bookings,
      pendingReservations,
      activeReservations,
    };
  } catch (error) {
    console.error("Error fetching latest bookings:", error);
    throw new Error("Failed to fetch latest bookings");
  }
};

export const getMonthlyBookings = async () => {
  const currentYear = new Date().getFullYear();
  const shortMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyBookingCount = shortMonths.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {} as Record<string, number>);

  const yearlyBookings = await prisma.booking.findMany({
    where: {
      checkIn: {
        gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
        lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
      },
    },
  });

  yearlyBookings.forEach(({ checkIn }) => {
    const date = new Date(checkIn);
    const month = shortMonths[date.getMonth()];
    if (monthlyBookingCount[month] !== undefined) {
      monthlyBookingCount[month]++;
    }
    return monthlyBookingCount;
  });
  return monthlyBookingCount;
};

export const getYearlyBookings = async () => {
  const currentYear = new Date().getFullYear();

  // Initialize an object to store yearly booking counts
  const yearlyBookingCount: Record<number, number> = {};

  // Populate initial structure with zero counts
  for (let year = currentYear - 5; year <= currentYear; year++) {
    yearlyBookingCount[year] = 0;
  }

  // Fetch all bookings for the last 5 years
  const yearlyBookings = await prisma.booking.findMany({
    where: {
      checkIn: {
        gte: new Date(`${currentYear - 5}-01-01T00:00:00.000Z`),
        lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
      },
    },
    select: { checkIn: true },
  });

  // Count bookings per year
  yearlyBookings.forEach(({ checkIn }) => {
    const year = new Date(checkIn).getFullYear();
    if (yearlyBookingCount[year] !== undefined) {
      yearlyBookingCount[year]++;
    }
  });

  return yearlyBookingCount;
};

// Admin Booking Dashboard
export const viewBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        services: {
          include: {
            service: true,
          },
        },
        transaction: true,
        customer: {
          include: {
            personalDetail: true,
          },
        },
        bookingStatus: true,
      },
    });

    const formatDate = (date: Date) => {
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const bookingData = bookings.map((booking) => ({
      referenceNo: booking.referenceCode,
      checkIn: formatDate(booking.checkIn),
      checkOut: formatDate(booking.checkOut),
      service: booking.services[0]?.service?.name,
      total: (booking.transaction?.amount || 0).toFixed(2),
      customerName: `${booking.customer.personalDetail?.firstName} ${booking.customer.personalDetail?.lastName}`,
      email: booking.customer.personalDetail?.email,
      status: booking.bookingStatus.name,
    }));

    return {
      bookingData,
    };
  } catch (error) {
    console.error("Error fetching latest bookings:", error);
  }
};

export const createWalkInBooking = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      contactNumber,
      email,
      checkInDate,
      checkOutDate,
      selectedPackage,
      paymentAccountName,
      paymentAccountNumber,
      paymentMethod,
      proofOfPayment,
      totalPax,
      amount,
    } = req.body;

    appAssert(email, BAD_REQUEST, "Email is required.");
    appAssert(firstName, BAD_REQUEST, "First name is required.");
    appAssert(lastName, BAD_REQUEST, "Last name is required.");
    appAssert(contactNumber, BAD_REQUEST, "Contact number is required.");
    appAssert(checkInDate, BAD_REQUEST, "Check-in date is required.");
    appAssert(checkOutDate, BAD_REQUEST, "Check-out date is required.");
    appAssert(selectedPackage, BAD_REQUEST, "Package selection is required.");

    const referenceCode = await generateReferenceCode();

    // Find Personal Detail
    let personalDetail = await prisma.personalDetail.findFirst({
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

    // Find or Create Payment Method
    let paymentMethodRecord = await prisma.paymentMethod.findFirst({
      where: { name: paymentMethod },
    });

    if (!paymentMethodRecord) {
      paymentMethodRecord = await prisma.paymentMethod.create({
        data: { name: paymentMethod, type: paymentMethod },
      });
    }

    // Create Payment Account
    const paymentAccount = await prisma.paymentAccount.create({
      data: {
        accountName: paymentAccountName,
        accountNumber: paymentAccountNumber,
        paymentMethodId: paymentMethodRecord.id,
      },
    });

    let paymentStatus = await prisma.paymentStatus.findFirst({
      where: { name: "Pending" },
    });

    if (!paymentStatus) {
      paymentStatus = await prisma.paymentStatus.create({
        data: { name: "Pending" },
      });
    }

    // Create Transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        proofOfPaymentImageUrl: req.file?.path,
        paymentAccountId: paymentAccount.id,
      },
    });

    // Create Booking
    const booking = await prisma.booking.create({
      data: {
        referenceCode,
        checkIn: new Date(checkInDate),
        checkOut: new Date(checkOutDate),
        totalPax: parseInt(totalPax),
        notes: "",
        customerId: customer.id,
        bookingStatusId: pendingBookingStatus.id,
        transactionId: transaction.id,
      },
    });

    // Retrieve the service details
    const service = await prisma.service.findUnique({
      where: { id: parseInt(selectedPackage) },
    });

    if (!service) {
      throw new Error("Service not found");
    }

    // Create Booking Service
    const bookingService = await prisma.bookingService.create({
      data: {
        bookingId: booking.id,
        serviceId: service.id,
      },
    });

    return res.json({
      referenceCode,
      booking,
      transaction,
      bookingService,
      serviceName: service.name,
    });
  } catch (error) {
    console.error("Error creating walk-in booking:", error);
  }
};

// Update Booking
export const editBookingStatus = async (
  referenceCode: string,
  bookingStatus: string,
  userMessage: string | null
) => {
  const booking = await prisma.booking.findFirst({
    where: {
      referenceCode,
    },
  });

  appAssert(booking, NOT_FOUND, "Booking not found");

  const updatedBooking = await prisma.booking.update({
    where: {
      referenceCode,
    },
    data: {
      bookingStatus: {
        connect: {
          name: bookingStatus,
        },
      },
      message: userMessage || null,
    },
    include: {
      customer: {
        include: {
          personalDetail: true,
        },
      },
      services: {
        include: {
          service: true,
        },
      },
    },
  });

  appAssert(updatedBooking, NOT_FOUND, "Booking not found");

  if (updatedBooking.customer?.personalDetail?.email) {
    const services = updatedBooking.services.map(
      (service) => service.service.name
    );
    const dateTime = `${new Date(updatedBooking.checkIn).toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        month: "long",
        day: "2-digit",
        year: "numeric",
      }
    )} 4:00 PM - ${new Date(updatedBooking.checkOut).toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        month: "long",
        day: "2-digit",
        year: "numeric",
      }
    )} 12:00 PM`;

    let emailTemplate;
    switch (bookingStatus.toLowerCase()) {
      case "cancelled":
        emailTemplate = getBookingCancelledEmailTemplate(
          referenceCode,
          `${updatedBooking.customer.personalDetail.firstName} ${updatedBooking.customer.personalDetail.lastName}`,
          dateTime,
          services,
          bookingStatus,
          userMessage
        );
        break;
      case "rescheduled":
        emailTemplate = getBookingRescheduledEmailTemplate(
          referenceCode,
          `${updatedBooking.customer.personalDetail.firstName} ${updatedBooking.customer.personalDetail.lastName}`,
          dateTime,
          services,
          bookingStatus,
          userMessage
        );
        break;
      case "approved":
        emailTemplate = getBookingApprovedEmailTemplate(
          referenceCode,
          `${updatedBooking.customer.personalDetail.firstName} ${updatedBooking.customer.personalDetail.lastName}`,
          dateTime,
          services,
          bookingStatus
        );
        break;
      case "completed":
        emailTemplate = getBookingCompleteEmailTemplate(
          updatedBooking.referenceCode,
          `${updatedBooking.customer.personalDetail.firstName} ${updatedBooking.customer.personalDetail.lastName}`
        );
        break;
      default:
        emailTemplate = getBookingSuccessEmailTemplate(
          referenceCode,
          `${updatedBooking.customer.personalDetail.firstName} ${updatedBooking.customer.personalDetail.lastName}`,
          dateTime,
          services,
          bookingStatus
        );
    }

    const { error } = await sendMail({
      to:
        updatedBooking.customer.personalDetail.email || "delivered@resend.dev",
      ...emailTemplate,
    });

    if (error) {
      console.error("Error sending status update email:", error);
    }
  }

  return updatedBooking;
};

export const editBookingDates = async (
  referenceCode: string,
  newCheckIn: string,
  newCheckOut: string
): Promise<{
  updatedBookingDate?: Awaited<ReturnType<typeof prisma.booking.update>>;
  unavailableServices?: { id: string; name: string }[];
}> => {
  try {
    const newCheckInDate = new Date(newCheckIn);
    const newCheckOutDate = new Date(newCheckOut);

    if (
      !newCheckIn ||
      !newCheckOut ||
      isNaN(newCheckInDate.getTime()) ||
      isNaN(newCheckOutDate.getTime())
    ) {
      throw new Error("Invalid or missing date format provided");
    }

    if (newCheckInDate >= newCheckOutDate) {
      throw new Error("Check-in date must be before check-out date");
    }

    const booking = await prisma.booking.findFirst({
      where: { referenceCode },
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
        services: {
          select: {
            serviceId: true,
          },
        },
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Validate duration consistency
    const originalDuration = Math.round(
      (booking.checkOut.getTime() - booking.checkIn.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const newDuration = Math.round(
      (newCheckOutDate.getTime() - newCheckInDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (newDuration !== originalDuration) {
      throw new Error(
        `Duration mismatch: original (${originalDuration} days) vs new (${newDuration} days)`
      );
    }

    const serviceIds = booking.services.map((s) => s.serviceId);

    const conflicts = await prisma.bookingService.findMany({
      where: {
        serviceId: { in: serviceIds },
        booking: {
          id: { not: booking.id },
          OR: [
            {
              checkIn: { lte: newCheckOutDate },
              checkOut: { gte: newCheckInDate },
            },
          ],
          bookingStatus: {
            name: { notIn: ["Cancelled", "Rescheduled"] },
          },
        },
      },
      select: {
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (conflicts.length > 0) {
      console.log("Conflicts detected:", conflicts);
      const unavailableServices = conflicts.map((conflict) => ({
        id: conflict.service.id.toString(),
        name: conflict.service.name,
      }));
      return { unavailableServices };
    }

    // Update the booking if no conflicts
    const updatedBookingDate = await prisma.booking.update({
      where: { referenceCode },
      data: {
        checkIn: newCheckInDate,
        checkOut: newCheckOutDate,
        bookingStatus: {
          connect: { name: "Pending" },
        },
        updatedAt: new Date(),
      },
      select: {
        id: true,
        referenceCode: true,
        checkIn: true,
        checkOut: true,
        totalPax: true,
        notes: true,
        message: true,
        createdAt: true,
        updatedAt: true,
        customerId: true,
        bookingStatusId: true,
        transactionId: true,
        bookingStatus: {
          select: {
            name: true,
          },
        },
      },
    });

    return { updatedBookingDate };
  } catch (error) {
    console.error("Error in editBookingDates:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(
      "Failed to update booking dates due to an unexpected error"
    );
  }
};

export const getBookingStatuses = async () => {
  return await prisma.bookingStatus.findMany();
};

export const getBookingByReferenceCode = async (referenceCode: string) => {
  const booking = await prisma.booking.findFirst({
    where: {
      referenceCode,
    },
    select: {
      id: true,
      referenceCode: true,
      checkIn: true,
      checkOut: true,
      totalPax: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      services: {
        select: {
          service: {
            include: {
              serviceCategory: true,
            },
          },
        },
      },
      customer: {
        select: {
          personalDetail: true,
        },
      },
      bookingStatus: true,
      transaction: {
        include: {
          paymentAccount: true,
        },
      },
    },
  });

  appAssert(booking, NOT_FOUND, "Booking not founds");

  return {
    id: booking.id,
    referenceCode: booking.referenceCode,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    totalPax: booking.totalPax,
    notes: booking.notes,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    services: booking.services,
    customer: {
      id: booking.customer?.personalDetail?.id,
      firstName: booking.customer?.personalDetail?.firstName,
      lastName: booking.customer?.personalDetail?.lastName,
      email: booking.customer?.personalDetail?.email,
      phoneNumber: booking.customer?.personalDetail?.phoneNumber,
      createdAt: booking.customer?.personalDetail?.createdAt,
      updatedAt: booking.customer?.personalDetail?.updatedAt,
    },
    bookingStatus: booking.bookingStatus.name,
    transaction: {
      id: booking.transaction?.id,
      proofOfPaymentImageUrl: booking.transaction?.proofOfPaymentImageUrl,
      amount: booking.transaction?.amount,
      createdAt: booking.transaction?.createdAt,
      updatedAt: booking.transaction?.updatedAt,
    },
  };
};

export const getAllBooking = async () => {
  const bookings = await prisma.booking.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      referenceCode: true,
      checkIn: true,
      checkOut: true,
      totalPax: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      services: {
        select: {
          service: true,
        },
      },
      customer: {
        select: {
          personalDetail: true,
        },
      },
      bookingStatus: true,
      transaction: {
        include: {
          paymentAccount: true,
        },
      },
    },
  });

  return bookings.map((booking) => {
    return {
      id: booking.id,
      referenceCode: booking.referenceCode,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      totalPax: booking.totalPax,
      notes: booking.notes,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      services: booking.services,
      customer: {
        id: booking.customer?.personalDetail?.id,
        firstName: booking.customer?.personalDetail?.firstName,
        lastName: booking.customer?.personalDetail?.lastName,
        email: booking.customer?.personalDetail?.email,
        phoneNumber: booking.customer?.personalDetail?.phoneNumber,
        createdAt: booking.customer?.personalDetail?.createdAt,
        updatedAt: booking.customer?.personalDetail?.updatedAt,
      },
      bookingStatus: booking.bookingStatus.name,
      transaction: {
        id: booking.transaction?.id,
        proofOfPaymentImageUrl: booking.transaction?.proofOfPaymentImageUrl,
        amount: booking.transaction?.amount,
        createdAt: booking.transaction?.createdAt,
        updatedAt: booking.transaction?.updatedAt,
      },
    };
  });
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
      message: booking.message,
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
                    createdAt:
                      booking.service.serviceCategory.category.createdAt,
                    updatedAt:
                      booking.service.serviceCategory.category.updatedAt,
                  }
                : null,
            }
          : null,
      })),
      transaction: booking.transaction
        ? {
            id: booking.transaction.id,
            proofOfPaymentImageUrl: booking.transaction.proofOfPaymentImageUrl,
            amount: booking.transaction.amount,
            createdAt: booking.transaction.createdAt,
            updatedAt: booking.transaction.updatedAt,
            paymentAccountId: booking.transaction.paymentAccountId,
          }
        : null,
    };
  } catch (error) {
    console.error("Error fetching booking status:", error);
  }
};

export const sendOtp = async (email: string) => {
  const { otp, expiresAt } = generateOTP(5);
  storeOTP(email, otp, expiresAt);

  console.log("OTP:", otp, "Expires At:", expiresAt);
  const { error } = await sendMail({
    to: email || "delivered@resend.dev",
    ...getOTPEmailTemplate(otp),
  });

  if (error) {
    console.error("Failed to send OTP:", error);
    throw new Error("Failed to send OTP");
  }

  return { success: true, message: "OTP sent successfully" };
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const isValid = validateOTP(email, otp);

    if (!isValid) {
      throw new Error("Invalid or expired OTP");
    }

    return { success: true, message: "OTP verified successfully" };
  } catch (error: any) {
    throw new Error(error.message || "Failed to verify OTP");
  }
};
