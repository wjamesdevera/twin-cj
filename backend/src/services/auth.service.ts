import { sign, Verify } from "crypto";
import { prisma } from "../config/db";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import appAssert from "../utils/appAssert";
import { signToken } from "../utils/jwt";
import { hashPassword, verifyPassword } from "../utils/password";

type CreateAccountParams = {
  email: string;
  password: string;
  phoneNumber: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  let existingUser = await prisma.personalDetail.findUnique({
    where: {
      email: data.email,
    },
  });

  appAssert(!existingUser, CONFLICT, "Email already in use");

  existingUser = await prisma.personalDetail.findUnique({
    where: {
      phoneNumber: data.phoneNumber,
    },
  });

  appAssert(!existingUser, CONFLICT, "Phone number already in use");

  const createUser = await prisma.personalDetail.create({
    data: {
      email: data.email,
      phoneNumber: data.phoneNumber,
      userAccount: {
        create: {
          password: await hashPassword(data.password),
        },
      },
    },
    include: {
      userAccount: true,
    },
  });

  const userAccountId = createUser.userAccount?.id;

  // TODO: Add Email Verification

  const session = await prisma.session.create({
    data: {
      userAccountId: userAccountId,
      userAgent: data.userAgent,
    },
  });

  const refreshToken = signToken({
    sessionId: session.id,
  });

  const accessToken = signToken({
    userId: userAccountId,
    sessionId: session.id,
  });

  return {
    user: {
      firstName: createUser.firstName,
      lastName: createUser.lastName,
      phoneNumber: createUser.phoneNumber,
      email: createUser.email,
    },
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

type LoginAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const loginAccount = async (data: LoginAccountParams) => {
  const user = await prisma.personalDetail.findUnique({
    where: {
      email: data.email,
    },
    include: {
      userAccount: true,
    },
  });

  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  const isValid = await verifyPassword(
    data.password,
    user.userAccount?.password
  );

  appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

  const userAccountId = user.userAccount?.id;

  const session = await prisma.session.create({
    data: {
      userAccountId: userAccountId,
      userAgent: data.userAgent,
    },
  });

  const refreshToken = signToken({
    sessionId: session.id,
  });

  const accessToken = signToken({
    userId: userAccountId,
    sessionId: session.id,
  });

  return {
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
    },
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};
