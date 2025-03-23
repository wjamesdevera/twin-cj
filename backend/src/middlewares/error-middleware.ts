import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { z } from "zod";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import AppError from "../utils/AppError";

const handleZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));

  res.status(BAD_REQUEST).json({
    status: "error",
    errors,
  });
};

const handleAppError = (res: Response, error: AppError) => {
  res.status(error.statusCode).json({
    status: "error",
    message: error.message,
    errorCode: error.errorCode,
  });
};

export const errorMiddleware: ErrorRequestHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log(`PATH ${request.path}`, error);

  if (error instanceof z.ZodError) {
    handleZodError(response, error);
    return;
  }

  if (error instanceof AppError) {
    handleAppError(response, error);
    return;
  }

  response.status(INTERNAL_SERVER_ERROR).send("Internal server error");
};
