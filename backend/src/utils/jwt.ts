import jwt, { VerifyOptions, SignOptions } from "jsonwebtoken";
import config from "../config/config";
import Audience from "../constants/audience";

const { jwtRefreshSecret, jwtSecret } = config;

export type RefreshTokenPayload = {
  sessionId: string;
};

export type AccessTokenPayload = {
  userId: string;
  sessionId: string;
};

type SignOptionsAndSecret = SignOptions & {
  secret: string;
};

const defaults: SignOptions = {
  audience: [Audience.User],
};

export const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "15m",
  secret: jwtSecret,
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "30d",
  secret: jwtRefreshSecret,
};

export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsAndSecret
) => {
  const { secret, ...signOpts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...signOpts,
  });
};

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & {
    secret?: string;
  }
) => {
  const { secret = jwtSecret, ...verifyOpts } = options || {};
  try {
    const payload = jwt.verify(token, secret, {
      ...defaults,
      ...verifyOpts,
    }) as TPayload;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
