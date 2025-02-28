import { request, Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { prisma } from "../config/db";
import appAssert from "../utils/appAssert";
import { NOT_FOUND, OK } from "../constants/http";

export const getUserHandler = catchErrors(
  async (request: Request, response: Response) => {
    const user = await prisma.userAccount.findFirst({
      where: {
        id: request.userId,
      },
      include: {
        personalDetail: true,
      },
    });
    appAssert(user, NOT_FOUND, "User not found");
    return response.status(OK).json({
      user,
    });
  }
);

export const getAllUsersHandler = catchErrors(
  async (request: Request, response: Response) => {
    const users = await prisma.userAccount.findMany({
      include: {
        personalDetail: true,
      },
    });
    appAssert(users, 404, "No Users Found");

    const transformUsers = users.map((user) => {
      return {
        id: user.id,
        firstName: user.personalDetail.firstName,
        lastName: user.personalDetail.lastName,
        email: user.personalDetail.email,
        phoneNumber: user.personalDetail.phoneNumber,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    return response.status(OK).json({
      status: "success",
      data: {
        users: transformUsers,
      },
    });
  }
);
