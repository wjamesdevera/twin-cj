import { prisma } from "../config/db";
import { NOT_FOUND, TOO_MANY_REQUESTS } from "../constants/http";
import appAssert from "../utils/appAssert";

export const getUser = async (id: string) => {
  const user = await prisma.userAccount.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      personalDetail: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
        },
      },
    },
  });
  appAssert(user, NOT_FOUND, "User not found");

  return {
    id: user.id,
    isVerified: user.isVerified,
    email: user.personalDetail.email,
    firstName: user.personalDetail.firstName,
    lastName: user.personalDetail.lastName,
    phoneNumber: user.personalDetail.phoneNumber,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const getAllUsers = async () => {
  const users = await prisma.userAccount.findMany({
    select: {
      id: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      personalDetail: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
        },
      },
    },
  });

  appAssert(users, NOT_FOUND, "Users not found");

  const transformUsers = users.map((user) => {
    return {
      id: user.id,
      isVerified: user.isVerified,
      email: user.personalDetail.email,
      firstName: user.personalDetail.firstName,
      lastName: user.personalDetail.lastName,
      phoneNumber: user.personalDetail.phoneNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  });

  return transformUsers;
};
