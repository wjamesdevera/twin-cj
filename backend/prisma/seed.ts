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

  const service = await prisma.service.create({
    data: {
      name: faker.location.city(),
      description: faker.location.city(),
      imageUrl: faker.image.url(),
      price: faker.number.int({ min: 500, max: 3000 }),
      cabins: {
        create: {
          maxCapacity: faker.number.int({ min: 1, max: 3 }),
          minCapacity: faker.number.int({ min: 3, max: 6 }),
        },
      },
      serviceCategory: {
        create: {
          category: {
            create: {
              name: "cabin",
            },
          },
        },
      },
    },
  });

  const bookingStatus = await prisma.bookingStatus.create({
    data: {
      name: "pending",
    },
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
        bookingStatusId: bookingStatus.id,
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
