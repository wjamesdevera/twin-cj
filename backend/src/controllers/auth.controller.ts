import { loginSchema, registerSchema } from "../schemas/auth.schems";
import catchErrors from "../utils/catchErrors";
import { createAccount, loginAccount } from "../services/auth.service";
import { Request, response, Response } from "express";
import { setAuthCookies } from "../utils/cookies";
import { CREATED, OK } from "../constants/http";
import appAssert from "../utils/appAssert";

export const registerHandler = catchErrors(
  async (request: Request, response: Response) => {
    const requestBody = registerSchema.parse({
      ...request.body,
      userAgent: request.headers["user-agent"],
    });

    const { user, accessToken, refreshToken } = await createAccount(
      requestBody
    );

    setAuthCookies({ response, accessToken, refreshToken })
      .status(CREATED)
      .json({
        status: "success",
        data: {
          user: {
            email: user.email,
          },
        },
      });
  }
);

export const loginHandler = catchErrors(
  async (request: Request, response: Response) => {
    const requestBody = loginSchema.parse({
      ...request.body,
      userAgent: request.headers["user-agent"],
    });

    const { user, accessToken, refreshToken } = await loginAccount(requestBody);

    setAuthCookies({ response, accessToken, refreshToken })
      .status(OK)
      .json({
        status: "success",
        data: {
          user: {
            email: user.email,
          },
        },
      });
  }
);

export const refreshHandler = catchErrors(
  async (request: Request, response: Response) => {
    response.status(OK).json({
      status: "success",
      data: {
        message: "refresh handler working",
      },
    });
  }
);
