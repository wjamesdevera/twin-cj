import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password";
import { randomUUID } from "node:crypto";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();
async function main() {
  const hashedPassword = await hashPassword(
    process.env.DEFAULT_ACCOUNT_PASSWORD || "Pa$$w0rd123"
  );
  const adminDetail = await prisma.personalDetail.upsert({
    where: {
      id: randomUUID(),
    },
    update: {},
    create: {
      email: process.env.DEFAULT_ACCOUNT_EMAIL || "admin@twincj.com",
      firstName: "admin",
      lastName: "account",
      phoneNumber: "09123456789",
      userAccount: {
        create: {
          password: hashedPassword,
          isVerified: true,
        },
      },
    },
    include: {
      userAccount: true,
    },
  });

  const categories = await prisma.category.createMany({
    data: [
      {
        name: "cabins",
      },
      {
        name: "day-tour",
      },
    ],
  });

  //   const ventiCabin = await prisma.service.create({
  //     data: {
  //       name: "Venti Cabin",
  //       description: `For groups of 15-20
  // Rates:

  //     Day tour (8AM - 5PM) - ₱10,000
  //     Overnight (4PM - 12NN) - ₱12,000
  //     Additional guests - ₱350 each

  // Additional Inclusions:

  //     2 queen-sized beds and 5 foam beds
  //     Spacious kitchen inside`,
  //       imageUrl: "/assets/amenities_venti.jpg",
  //       price: 12_000,
  //       cabins: {
  //         create: {
  //           maxCapacity: 20,
  //           minCapacity: 15,
  //         },
  //       },
  //       serviceCategory: {
  //         create: {
  //           categoryId: 1,
  //         },
  //       },
  //     },
  //   });

  //   const maxiCabin = await prisma.service.create({
  //     data: {
  //       name: "Maxi Cabin",
  //       description: `For 6-8 guests
  // Rates:

  //     Day tour (8AM - 5PM) - ₱5,000
  //     Overnight (4PM - 12NN) - ₱6,000
  //     Additional guests - ₱350 each

  // Additional Inclusions:

  //     1 queen-sized bed and 2 foam beds`,
  //       imageUrl: "/assets/amenities_maxi.jpg",
  //       price: 6_000,
  //       cabins: {
  //         create: {
  //           maxCapacity: 8,
  //           minCapacity: 6,
  //         },
  //       },
  //       serviceCategory: {
  //         create: {
  //           categoryId: 1,
  //         },
  //       },
  //     },
  //   });

  //   for (let i = 0; i < 3; i++) {
  //     const miniCabin = await prisma.service.create({
  //       data: {
  //         name: "Mini Cabin",
  //         description: `For 2-4 guests
  // Rates:

  //     Day tour (8AM - 5PM) - ₱2,000 for 2 guests
  //     ₱2,500 for 3-4 guests
  //     Overnight (4PM - 12NN) - ₱3,000 for 2 guests
  //     ₱3,500 for 3-4 guests
  //     Additional guests - ₱350 each

  // Additional Inclusions:

  //     1 queen-sized bed and 1 foam bed`,
  //         imageUrl: "/assets/amenities_mini.jpg",
  //         price: 3_500,
  //         cabins: {
  //           create: {
  //             maxCapacity: 4,
  //             minCapacity: 2,
  //           },
  //         },
  //         serviceCategory: {
  //           create: {
  //             categoryId: 1,
  //           },
  //         },
  //       },
  //     });
  //   }

  await prisma.bookingStatus.createMany({
    data: [
      {
        name: "Pending",
      },
      {
        name: "Approved",
      },
      {
        name: "Cancelled",
      },
      {
        name: "Rescheduled",
      },
      {
        name: "Completed",
      },
    ],
  });

  const paymentMethod = await prisma.paymentMethod.create({
    data: {
      name: faker.finance.accountName(),
      type: "GCASH",
    },
  });

  await prisma.paymentAccount.create({
    data: {
      paymentMethod: {
        connect: {
          id: paymentMethod.id,
        },
      },
    },
  });

  await prisma.bookingStatus.findUnique({
    where: {
      name: "Pending",
    },
  });

  await prisma.feedbackStatus.createMany({
    data: [
      {
        name: "For Review",
      },
      {
        name: "Approved",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
