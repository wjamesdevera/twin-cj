import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { prisma } from "../config/db";
import appAssert from "../utils/appAssert";
import { BAD_REQUEST, NOT_FOUND, OK } from "../constants/http";
import {
  editUserSchema,
  idSchema,
  registerSchema,
} from "../schemas/auth.schema";
import app from "../app";
import { getUser } from "../services/user.service";

export const getUserHandler = catchErrors(
  async (request: Request, response: Response) => {
    const user = await getUser(request.userId);
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

export const editUserHandler = catchErrors(
  async (request: Request, response: Response) => {
    const id = idSchema.parse(request.params.id);

    appAssert(id, BAD_REQUEST, "Id is required");
    const userDetails = editUserSchema.parse(request.body);

    appAssert(userDetails, BAD_REQUEST, "User Details Needed");
    const user = await prisma.userAccount.findFirst({
      where: {
        id: id,
      },
      include: {
        personalDetail: true,
      },
    });
    appAssert(user, NOT_FOUND, "User not found");
    const updateUser = await prisma.personalDetail.update({
      where: {
        id: user?.personalId,
      },
      data: {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        phoneNumber: userDetails.phoneNumber,
        email: userDetails.email,
      },
    });
    appAssert(updateUser, NOT_FOUND, "User not found");

    return response.status(OK).json({
      status: "success",
      data: {
        updateUser,
      },
    });
  }
);

export const getUserByIdHandler = catchErrors(
  async (request: Request, response: Response) => {
    const id = idSchema.parse(request.params.id);

    appAssert(id, BAD_REQUEST, "Id is required");

    const user = await prisma.userAccount.findFirst({
      where: {
        id: id,
      },
      include: {
        personalDetail: true,
      },
    });

    appAssert(user, NOT_FOUND, "User not found");

    return response.status(OK).json({
      status: "success",
      data: {
        id: user.id,
        firstName: user.personalDetail.firstName,
        lastName: user.personalDetail.lastName,
        email: user.personalDetail.email,
        phoneNumber: user.personalDetail.phoneNumber,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }
);

export const deleteUserHandler = catchErrors(
  async (request: Request, response: Response) => {
    const id = idSchema.parse(request.params.id);

    appAssert(id, BAD_REQUEST, "Id is required");

    const user = await prisma.userAccount.delete({
      where: {
        id: id,
      },
      include: {
        personalDetail: true,
      },
    });

    appAssert(user, NOT_FOUND, "User not found");

    return response.status(OK).json({
      status: "success",
      data: {
        message: `User: ${user.id} has been deleted`,
      },
    });
  }
);
