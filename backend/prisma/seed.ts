import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password";
const prisma = new PrismaClient();
async function main() {
  const hashedPassword = await hashPassword("Pa$$w0rd123");
  const adminDetail = await prisma.personalDetail.upsert({
    where: {
      email: "admin@email.com",
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
          isVerified: false,
        },
      },
    },
    include: {
      userAccount: true,
    },
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
