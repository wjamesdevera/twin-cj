import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../schemas/auth.schems";
import catchErrors from "../utils/catchErrors";
import {
  createAccount,
  loginAccount,
  refreshUserAccessToken,
  resetPassword,
  sendPasswordResetEmail,
} from "../services/auth.service";
import { Request, response, Response } from "express";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import appAssert from "../utils/appAssert";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../config/db";

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
    const refreshToken = request.cookies.refreshToken as string | undefined;
    appAssert(refreshToken, UNAUTHORIZED, "Refresh Token required");

    const { accessToken, newRefreshToken } = await refreshUserAccessToken(
      refreshToken
    );

    if (newRefreshToken) {
      response.cookie(
        "refreshToken",
        newRefreshToken,
        getRefreshTokenCookieOptions()
      );
    }

    response
      .status(OK)
      .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
      .json({
        status: "success",
        data: {
          message: "Access token refreshed",
        },
      });
  }
);

export const logoutHandler = catchErrors(
  async (request: Request, response: Response) => {
    const accessToken = request.cookies.accessToken as string | undefined;
    const { payload } = verifyToken(accessToken || "");
    if (payload) {
      await prisma.session.delete({
        where: {
          id: payload.sessionId,
        },
      });
    }

    clearAuthCookies(response)
      .status(OK)
      .json({
        status: "success",
        data: {
          message: "Logout successful",
        },
      });
  }
);

export const forgotPasswordHandler = catchErrors(
  async (request: Request, response: Response) => {
    const email = emailSchema.parse(request.body.email);

    await sendPasswordResetEmail(email);

    return response.status(OK).json({
      status: "success",
      data: {
        message: "Password reset email sent",
      },
    });
  }
);

export const passwordResetHandler = catchErrors(
  async (request: Request, response: Response) => {
    const requestBody = resetPasswordSchema.parse(request.body);

    await resetPassword(requestBody);

    return clearAuthCookies(response)
      .status(OK)
      .json({
        status: "success",
        data: {
          message: "Password was reset successfully",
        },
      });
  }
);

export const changePasswordHandler = catchErrors(
  async (request: Request, response: Response) => {
    return response.status(OK).json({
      status: "success",
      data: {
        message: "Change Password Endpoint In Pogres",
      },
    });
  }
);
