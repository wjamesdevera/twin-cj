import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password";
import { randomUUID } from "node:crypto";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();
async function main() {
  const hashedPassword = await hashPassword("Pa$$w0rd123");
  const adminDetail = await prisma.personalDetail.upsert({
    where: {
      id: randomUUID(),
    },
    update: {},
    create: {
      email: "admin@email.com",
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

  const service = await prisma.service.create({
    data: {
      name: "Venti Cabin",
      description: `For groups of 15-20
Rates:

    Day tour (8AM - 5PM) - ₱10,000
    Overnight (4PM - 12NN) - ₱12,000
    Additional guests - ₱350 each

Additional Inclusions:

    2 queen-sized beds and 5 foam beds
    Spacious kitchen inside`,
      imageUrl: "/assets/amenities_venti.jpg",
      price: 12_000,
      cabins: {
        create: {
          maxCapacity: 15,
          minCapacity: 20,
        },
      },
      serviceCategory: {
        create: {
          categoryId: 1,
        },
      },
    },
  });

  const bookingStatus = await prisma.bookingStatus.createMany({
    data: [
      {
        name: "Pending",
      },
      {
        name: "Cancelled",
      },
      {
        name: "Confirmed",
      },
      {
        name: "Rejected",
      },
      {
        name: "Approved",
      },
      {
        name: "Invalid",
      },
    ],
  });

  const customer = await prisma.customer.create({
    data: {
      personalDetailId: adminDetail.id,
    },
  });

  const paymentMethod = await prisma.paymentMethod.create({
    data: {
      name: faker.finance.accountName(),
      type: "GCASH",
    },
  });

  const paymentAccount = await prisma.paymentAccount.create({
    data: {
      accountName: faker.finance.accountName(),
      accountNumber: 2,
      paymentMethodId: paymentMethod.id,
    },
  });

  const pendingStatus = await prisma.bookingStatus.findUnique({
    where: {
      name: "Pending",
    },
  });

  for (let i = 0; i < 200; i++) {
    const transaction = await prisma.transaction.create({
      data: {
        proofOfPaymentImageUrl: faker.image.url(),
        amount: 1000,
        paymentAccountId: paymentAccount.id,
      },
    });

    const checkIn = faker.date.future();
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + 2);

    await prisma.booking.create({
      data: {
        referenceCode: faker.finance.accountNumber(),
        checkIn,
        checkOut,
        totalPax: faker.number.int({ min: 1, max: 10 }),
        bookingStatusId: pendingStatus?.id || 1,
        services: { create: { serviceId: service.id } },
        customerId: customer.id,
        transactionId: transaction.id,
      },
    });
  }
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
