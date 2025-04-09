import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { OK } from "../constants/http";

export const sendFeedbackHandler = catchErrors(
    async (request: Request, response: Response) => {
        response.status(OK).json({
            message: "success"
        })
    }
)