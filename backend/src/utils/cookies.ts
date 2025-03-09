import { CookieOptions, response, Response } from "express";
import config from "../config/config";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./data";

export const REFRESH_PATH = "/api/auth/refresh";
const secure = config.environment !== "development";

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: fifteenMinutesFromNow(),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDaysFromNow(),
  path: REFRESH_PATH,
});

type Params = {
  response: Response;
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookies = ({
  response,
  accessToken,
  refreshToken,
}: Params) =>
  response
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

export const clearAuthCookies = (response: Response) =>
  response
    .clearCookie("accessToken")
    .clearCookie("refreshToken", { path: REFRESH_PATH });
