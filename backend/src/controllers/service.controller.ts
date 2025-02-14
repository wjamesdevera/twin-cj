import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { createCabin, deleteAllCabins, deleteCabin, getAllCabins, getCabin, updateCabin } from "../services/service.service";
import { CREATED, OK } from "../constants/http";

export const getCabinHandler = catchErrors(async (req: Request, res: Response) => {
  const { id } = req.params;
  const cabin = await getCabin(Number(id));

  if (!cabin) {
    return res.status(404).json({
      status: "error",
      message: `Cabin with ID ${id} not found.`,
    });
  }

  res.status(OK).json({
    status: "success",
    data: { cabin },
  });
});

export const getAllCabinsHandler = catchErrors(async (req: Request, res: Response) => {
  const cabins = await getAllCabins();
  res.status(OK).json({
    status: "success",
    data: {
      "cabins": cabins
    }
  });
});

export const createCabinHandler = catchErrors(async (req: Request, res: Response) => {
  const { service, cabin } = req.body;

  if (!service || !cabin) {
    return res.status(400).json({
      status: "error",
      message: "Both service and cabin data are required.",
    });
  }

  const result = await createCabin({ service, cabin });

  res.status(CREATED).json({
    status: "success",
    data: result,
  });
});

export const deleteAllCabinsHandler = catchErrors(async (req: Request, res: Response) => {
  const deletedData = await deleteAllCabins();

  res.status(OK).json({
    status: "success",
    message: "All cabins and their corresponding services have been deleted successfully.",
    data: deletedData,
  });
});

export const deleteCabinHandler = catchErrors(async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedData = await deleteCabin(Number(id));

  if (!deletedData) {
    return res.status(404).json({
      status: "error",
      message: `Cabin with ID ${id} not found.`,
    });
  }

  res.status(OK).json({
    status: "success",
    message: `Cabin and Service with ID ${id} deleted successfully.`,
    data: deletedData,
  });
});

export const updateCabinHandler = catchErrors(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { service, cabin } = req.body;

  const updatedData = await updateCabin(Number(id), { service, cabin });

  if (!updatedData) {
    return res.status(404).json({
      status: "error",
      message: `Cabin with ID ${id} not found.`,
    });
  }

  res.status(OK).json({
    status: "success",
    data: updatedData,
  });
});
