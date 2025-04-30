import { UnwrapPromise } from "@prisma/client/runtime/library";
import { prisma } from "../config/db";
import { CONFLICT, NOT_FOUND, TOO_MANY_REQUESTS } from "../constants/http";
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

interface EditUserParams {
  id: string;
  data: {
    email?: string;
    phoneNumber?: string;
    firstName?: string | null;
    lastName?: string | null;
  };
}

export const updateUser = async ({ id, data }: EditUserParams) => {
  const user = await prisma.userAccount.findFirst({
    where: {
      id: id,
    },
    include: {
      personalDetail: true,
    },
  });
  appAssert(user, NOT_FOUND, "User not found");

  let existingUser = await prisma.userAccount.findFirst({
    where: {
      NOT: {
        id: id,
      },
      personalDetail: {
        email: data.email?.toLowerCase(),
      },
    },
    include: {
      personalDetail: true,
    },
  });

  appAssert(!existingUser, CONFLICT, "Email already in use");

  existingUser = await prisma.userAccount.findFirst({
    where: {
      NOT: {
        id: id,
      },
      personalDetail: {
        phoneNumber: data.phoneNumber,
      },
    },
    include: {
      personalDetail: true,
    },
  });

  appAssert(!existingUser, CONFLICT, "Phone number already in use");

  const updatedUser = await prisma.userAccount.update({
    where: {
      id,
    },
    data: {
      personalDetail: {
        update: {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          email: data.email,
        },
      },
    },
    include: {
      personalDetail: true,
    },
  });
  appAssert(updatedUser, NOT_FOUND, "User not found");

  return {
    id: updatedUser.id,
    isVerified: updatedUser.isVerified,
    email: updatedUser.personalDetail.email,
    firstName: updatedUser.personalDetail.firstName,
    lastName: updatedUser.personalDetail.lastName,
    phoneNumber: updatedUser.personalDetail.phoneNumber,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  };
};

export const deleteUser = async (id: string) => {
  const existingUserAccount = await prisma.userAccount.findFirst({
    where: {
      id,
    },
  });

  appAssert(existingUserAccount, NOT_FOUND, `User with ID: ${id} not found`);

  const deletedUser = await prisma.personalDetail.delete({
    where: {
      id: existingUserAccount.personalId,
    },
  });

  appAssert(deletedUser, NOT_FOUND, `User with ID: ${id} not found`);

  return existingUserAccount.id;
};

export const getUserById = async (id: string) => {
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
