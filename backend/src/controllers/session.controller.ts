import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { prisma } from "../config/db";
import { NOT_FOUND, OK } from "../constants/http";
import { z } from "zod";
import appAssert from "../utils/appAssert";

export const getSessionHandler = catchErrors(
  async (request: Request, response: Response) => {
    const sessions = await prisma.session.findMany({
      where: {
        userAccountId: request.userId,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        userAgent: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    response.status(OK).json(
      sessions.map((session) => ({
        ...session,
        ...(session.id === request.sessionId && {
          isCurrent: true,
        }),
      }))
    );
  }
);

export const deleteSessionHandler = catchErrors(
  async (request: Request, response: Response) => {
    const sessionId = z.string().parse(request.params.id);
    const deleted = await prisma.session.delete({
      where: {
        id: sessionId,
        userAccountId: request.userId,
      },
    });
    appAssert(deleted, NOT_FOUND, "Session not found");

    return response.status(OK).json({
      message: "Session removed",
    });
  }
);
