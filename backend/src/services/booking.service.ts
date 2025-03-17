// import { request } from "http";
// import { prisma } from "../config/db";
// import { generateReferenceCode } from "../utils/referenceCodeGenerator";

// export const getServicesByType = async (type: "day-tour" | "cabin") => {
//   try {
//     const services = await prisma.bookingService.findMany({
//       include: {
//         service: true,
//       },
//     });

//     return services
//       .filter((bookingService) => bookingService.service.type === type)
//       .map((bookingService) => ({
//         id: bookingService.id,
//         name: bookingService.service.name,
//         description: bookingService.service.description,
//         price: bookingService.service.price,
//         imageUrl: bookingService.service.imageUrl,
//       }));
//   } catch (error) {
//     console.error("Error fetching services:", error);
//     throw new Error("Failed to fetch services. Please try again.");
//   }
// };

// export const createBooking = async (
//   validatedData: {
//     checkInDate: string;
//     checkOutDate: string;
//     notes?: string;
//     firstName: string;
//     lastName: string;
//     contactNumber: string;
//     email: string;
//     bookingStatusId: number;
//     totalPax: number;
//     customerId: number;
//   },
//   proofOfPaymentImageUrl: string,
//   paymentMethodType: "GCash" | "Credit Card",
//   amount: number
// ) => {
//   try {
//     const {
//       checkInDate,
//       checkOutDate,
//       notes,
//       firstName,
//       lastName,
//       contactNumber,
//       email,
//       bookingStatusId,
//       totalPax,
//       customerId,
//     } = validatedData;

//     return await prisma.$transaction(async (prisma) => {
//       console.log("Validated Data:", validatedData);

//       let personalDetail = await prisma.personalDetail.findUnique({
//         where: { email },
//       });

//       if (!personalDetail) {
//         personalDetail = await prisma.personalDetail.create({
//           data: {
//             firstName,
//             lastName,
//             phoneNumber: contactNumber,
//             email,
//           },
//         });
//       }
//       console.log("Personal Detail ID:", personalDetail.id);

//       let customer = await prisma.customer.findUnique({
//         where: { id: customerId },
//       });

//       if (!customer) {
//         customer = await prisma.customer.create({
//           data: {
//             personalDetailId: personalDetail.id,
//           },
//         });
//       }
//       console.log("Customer ID:", customer.id);

//       const referenceCode = await generateReferenceCode();
//       if (!referenceCode) throw new Error("Reference code generation failed.");
//       if (!customer?.id) throw new Error("Customer ID is undefined.");
//       if (!bookingStatusId) throw new Error("Booking Status ID is missing.");

//       const paymentMethod = await prisma.paymentMethod.findFirst({
//         where: { type: paymentMethodType },
//       });

//       if (!paymentMethod) {
//         throw new Error(`Payment method '${paymentMethodType}' not found.`);
//       }

//       console.log("Payment Method ID:", paymentMethod.id);

//       // const newTransaction = paymentMethod
//       //   ? await prisma.transaction.create({
//       //       data: {
//       //         paymentMethodId: paymentMethod.id,
//       //         proofOfPaymentImageUrl,
//       //         amount,
//       //       },
//       //     })
//       //   : null;

//       // console.log("Transaction Created:", newTransaction?.id || "No Payment");

//       // Create booking
//       const newBooking = await prisma.booking.create({
//         data: {
//           checkIn: new Date(checkInDate),
//           checkOut: new Date(checkOutDate),
//           notes,
//           referenceCode,
//           bookingStatusId,
//           totalPax,
//           customerId,
//           // transactionId: newTransaction?.id || undefined,
//         },
//       });

//       console.log("Booking Created:", newBooking);
//       return newBooking;
//     });
//   } catch (error) {
//     console.error("Error in createBooking:", error);
//     throw new Error("Booking creation failed. Please try again.");
//   }
// };
