import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { createCabin, getAllCabins } from "../services/service.service";
import { CREATED, OK } from "../constants/http";

export const getCabinsHandler = catchErrors(async (req: Request, res: Response) => {
  const cabins = await getAllCabins();
  res.status(OK).json({
    status: "success",
    data: {
      "cabins": cabins
    }
  });
});

export const createCabinHandler = catchErrors(async (req: Request, res: Response) => {
  const newCabin = await createCabin(req.body);
  res.status(CREATED).json({
    status: "success",
    data: { cabin: newCabin },
  });
});
