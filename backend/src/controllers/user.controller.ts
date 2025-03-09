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
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../services/user.service";

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
    const users = await getAllUsers();

    return response.status(OK).json({
      status: "success",
      data: {
        users: users,
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

    const updatedUser = await updateUser({ id, data: userDetails });

    return response.status(OK).json({
      status: "success",
      data: {
        user: updatedUser,
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

    const deletedUserId = await deleteUser(id);

    return response.status(OK).json({
      status: "success",
      data: {
        message: `User: ${deletedUserId} has been deleted`,
      },
    });
  }
);
