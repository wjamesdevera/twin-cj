import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { getAllCabins } from "../services/cabin.service";
import { OK } from "../constants/http";

export const getCabinsHandler = catchErrors(async (req: Request, res: Response) => {
  const cabins = await getAllCabins();
  res.status(OK).json({
    status: "success",
    data: {
      "cabins": cabins
    }
  });
});
