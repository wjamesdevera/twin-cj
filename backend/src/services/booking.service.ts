import { Request, Response } from "express";
import { prisma } from "../config/db";
import { generateReferenceCode } from "../utils/referenceCodeGenerator";
import appAssert from "../utils/appAssert";
import { BAD_REQUEST, NOT_FOUND } from "../constants/http";
import { sendMail } from "../utils/sendMail";
import { getBookingSuccessEmailTemplate } from "../utils/emailTemplates";
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

    const amount = (bookingCards ?? []).reduce(
      (total: number, card: { price: string }) => {
        const cardPrice = parseFloat(card.price);
        return isNaN(cardPrice) ? total : total + cardPrice;
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
        gte: new Date(`${currentYear}-01-01T00:00:00.000Z`), // Start of the year
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
        checkIn: "desc",
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

    console.log("Received booking data:", {
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
    });

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

    // Create Transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        proofOfPaymentImageUrl: proofOfPayment,
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

export const editBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const {
      checkInDate,
      checkOutDate,
      bookingCards,
      specialRequest,
      totalPax,
    } = req.body;

    appAssert(bookingId, BAD_REQUEST, "Booking ID is required.");
    appAssert(checkInDate, BAD_REQUEST, "Check-in date is required.");
    appAssert(checkOutDate, BAD_REQUEST, "Check-out date is required.");
    appAssert(Array.isArray(bookingCards), BAD_REQUEST, "Invalid services.");

    // Find existing booking
    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
      include: { services: true },
    });

    appAssert(booking, BAD_REQUEST, "Booking not found.");

    // Check new availability
    const availableServices = await checkAvailability(
      checkInDate,
      checkOutDate
    );
    const selectedServices = bookingCards.map(
      (card: { id: number }) => card.id
    );

    const isAvailable = selectedServices.every((id) =>
      availableServices.some((service) => service.id === id)
    );

    appAssert(
      isAvailable,
      BAD_REQUEST,
      "One or more services are not available."
    );

    // Update Booking
    const updatedBooking = await prisma.booking.update({
      where: { id: Number(bookingId) },
      data: {
        checkIn: new Date(checkInDate),
        checkOut: new Date(checkOutDate),
        totalPax,
        notes: specialRequest || "",
      },
    });

    return res.json({
      message: "Booking updated successfully",
      updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
  }
};

// Update Booking
export const editBookingStatus = async (
  referenceCode: string,
  bookingStatus: string
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
      bookingStatusId: Number(bookingStatus),
    },
  });

  appAssert(updatedBooking, NOT_FOUND, "Booking not found");
  return updatedBooking;
};

export const getBookingStatuses = async () => {
  return await prisma.bookingStatus.findMany();
};

export const getBookingByReferenceCode = async (referenceCode: string) => {
  const booking = await prisma.booking.findFirst({
    where: {
      referenceCode
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