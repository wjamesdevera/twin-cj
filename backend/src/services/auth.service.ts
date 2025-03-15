import config from "../config/config";
import { prisma } from "../config/db";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "../constants/http";
import appAssert from "../utils/appAssert";
import {
  fiveMinutesAgo,
  ONE_DAY_MS,
  oneHourFromNow,
  oneYearFromNow,
  thirtyDaysFromNow,
} from "../utils/data";
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from "../utils/emailTemplates";
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../utils/jwt";
import { hashPassword, verifyPassword } from "../utils/password";
import { sendMail } from "../utils/sendMail";

type CreateAccountParams = {
  firstName: string | null;
  lastName: string | null;
  email: string;
  password: string;
  phoneNumber: string;
  userAgent?: string;
};

type LoginAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

type ChangePasswordParams = {
  userId: string;
  oldPassword: string;
  newPassword: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  let existingUser = await prisma.personalDetail.findUnique({
    where: {
      email: data.email.toLowerCase(),
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
      firstName: data.firstName,
      lastName: data.lastName,
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

  const verificationCode = await prisma.verificationCode.create({
    data: {
      userAccountId: userAccountId,
      expiresAt: oneYearFromNow(),
    },
  });

  const url = `${config.appOrigin}/email/verify/${verificationCode.id}`;

  // Send Email Verification
  const { error } = await sendMail({
    to: createUser.email,
    ...getVerifyEmailTemplate(url),
  });

  //ignore email errors for now
  if (error) console.log(error);

  // const session = await prisma.session.create({
  //   data: {
  //     userAccountId: userAccountId,
  //     userAgent: data.userAgent,
  //     expiresAt: thirtyDaysFromNow(),
  //   },
  // });

  // const refreshToken = signToken({
  //   sessionId: session.id,
  // });

  // const accessToken = signToken({
  //   userId: userAccountId,
  //   sessionId: session.id,
  // });

  return {
    user: {
      firstName: createUser.firstName,
      lastName: createUser.lastName,
      phoneNumber: createUser.phoneNumber,
      email: createUser.email,
    },
    // accessToken: accessToken,
    // refreshToken: refreshToken,
  };
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
      expiresAt: thirtyDaysFromNow(),
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

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

  const session = await prisma.session.findFirst({
    where: {
      id: payload.sessionId,
    },
  });
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getDate() > now,
    UNAUTHORIZED,
    "Session expired"
  );

  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken(
        {
          sessionId: session.id,
        },
        refreshTokenSignOptions
      )
    : undefined;

  const accessToken = signToken({
    userId: session.userAccountId,
    sessionId: session.id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};

export const sendPasswordResetEmail = async (email: string) => {
  const user = await prisma.personalDetail.findFirst({
    where: {
      email: email,
    },
    include: {
      userAccount: true,
    },
  });

  appAssert(user, NOT_FOUND, "User not found");

  const fiveMinAgo = fiveMinutesAgo();
  const count = await prisma.verificationCode.count({
    where: {
      userAccountId: user.userAccount?.id,
      createdAt: {
        gt: fiveMinAgo,
      },
    },
  });

  appAssert(
    count <= 1,
    TOO_MANY_REQUESTS,
    "Too many requests, please try again later"
  );

  const expiresAt = oneHourFromNow();
  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      userAccountId: user.userAccount?.id,
      expiresAt: expiresAt,
    },
  });

  const url = `${config.appOrigin}/admin/password/change?code=${
    passwordResetToken.id
  }&exp=${expiresAt.getTime()}`;

  const { data, error } = await sendMail({
    to: email,
    ...getPasswordResetTemplate(url),
  });

  appAssert(
    data?.id,
    INTERNAL_SERVER_ERROR,
    `${error?.name} - ${error?.message}`
  );

  return {
    url,
    emailId: data.id,
  };
};

type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};

export const resetPassword = async ({
  verificationCode,
  password,
}: ResetPasswordParams) => {
  const validCode = await prisma.passwordResetToken.findFirst({
    where: {
      id: verificationCode,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

  const updateUser = await prisma.userAccount.update({
    where: {
      id: validCode.userAccountId,
    },
    data: {
      password: await hashPassword(password),
    },
    include: {
      personalDetail: true,
    },
  });

  appAssert(updateUser, INTERNAL_SERVER_ERROR, "Failed to reset password");

  await prisma.passwordResetToken.delete({
    where: {
      id: validCode.id,
    },
  });

  await prisma.session.deleteMany({
    where: {
      userAccountId: validCode.userAccountId,
    },
  });

  return {
    user: {
      firstName: updateUser.personalDetail.firstName,
      lastName: updateUser.personalDetail.lastName,
      phoneNumber: updateUser.personalDetail.phoneNumber,
      email: updateUser.personalDetail.email,
    },
  };
};

export const changePassword = async ({
  userId,
  oldPassword,
  newPassword,
}: ChangePasswordParams) => {
  try {
    const user = await prisma.userAccount.findFirst({
      where: {
        id: userId,
      },
    });

    appAssert(user, UNAUTHORIZED, "User not found");

    const isOldPasswordValid = verifyPassword(oldPassword, user.password);

    appAssert(isOldPasswordValid, UNAUTHORIZED, "Invalid password");

    const updatedUser = await prisma.userAccount.update({
      where: {
        id: userId,
      },
      data: {
        password: await hashPassword(newPassword),
      },
    });

    return updatedUser;
  } catch (error: Error | any) {
    console.error(error.message);
  }
};

export const verifyEmail = async (code: string) => {
  const validCode = await prisma.verificationCode.findFirst({
    where: {
      id: code,
    },
    include: {
      userAccount: true,
    },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

  const updatedUser = await prisma.userAccount.update({
    where: {
      id: validCode.userAccountId,
    },
    data: {
      isVerified: true,
    },
    include: {
      personalDetail: true,
    },
  });

  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email");

  await prisma.verificationCode.delete({
    where: {
      id: validCode.id,
    },
  });

  return {
    user: {
      firstName: updatedUser.personalDetail.firstName,
      lastName: updatedUser.personalDetail.lastName,
      phoneNumber: updatedUser.personalDetail.phoneNumber,
      email: updatedUser.personalDetail.email,
      isVerified: updatedUser.isVerified,
    },
  };
};
