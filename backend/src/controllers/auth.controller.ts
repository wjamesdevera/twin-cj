import { registerSchema } from "../schemas/auth.schems";
import catchErrors from "../utils/catchErrors";
import { createAccount } from "../services/auth.service";
import { Request, Response } from "express";

export const registerHandler = catchErrors(
  async (request: Request, response: Response) => {
    const requestBody = registerSchema.parse({
      ...request.body,
      userAgent: request.headers["user-agent"],
    });
    await createAccount(requestBody);
    response.json({ status: "success", data: requestBody });
  }
);
