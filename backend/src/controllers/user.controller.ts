import { Request, Response } from "express";
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
      status: "success",
      data: {
        user: user,
      },
    });
  }
);
