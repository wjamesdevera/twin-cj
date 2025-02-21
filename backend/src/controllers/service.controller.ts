import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { createCabin, deleteAdditionalFee, deleteAllCabins, deleteCabin, getAllAdditionalFees, getAllCabins, getCabin, updateCabin } from "../services/service.service";
import { CREATED, OK } from "../constants/http";

export const getCabinHandler = catchErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ status: "error", message: "Invalid cabin ID." });
  }
  const cabin = await getCabin(id);

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
  
  if (cabins.length === 0) {
    return res.status(OK).json({
      status: "success",
      message: "No cabins found.",
      data: { cabins: [] }
    });
  }

  res.status(OK).json({
    status: "success",
    data: { cabins }
  });
});

export const createCabinHandler = catchErrors(async (req: Request, res: Response) => {
  const { service, cabin, additionalFee } = req.body;

  if (!service || !cabin) {
    return res.status(400).json({
      status: "error",
      message: "Service and cabin data are required.",
    });
  }

  if (additionalFee && (additionalFee.amount == null || additionalFee.amount < 0)) {
    return res.status(400).json({
      status: "error",
      message: "Additional fee must have a valid amount.",
    });
  }

  const result = await createCabin({ service, cabin, additionalFee });

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
  const cabinId = Number(id);

  if (isNaN(cabinId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid cabin ID.",
    });
  }

  try {
    const deletedData = await deleteCabin(cabinId);

    if (!deletedData) {
      return res.status(404).json({
        status: "error",
        message: `Cabin with ID ${cabinId} not found.`,
      });
    }

    const { deletedCabin, deletedService } = deletedData;

    res.status(OK).json({
      status: "success",
      message: `Cabin with ID ${deletedCabin.id} deleted successfully.` + 
               (deletedService ? ` Service ID ${deletedService.id} was also deleted.` : ""),
      data: deletedData,
    });
  } catch (error) {
    console.error(`Error deleting cabin ID ${cabinId}:`, error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the cabin.",
    });
  }
});

export const deleteSelectedCabinsHandler = catchErrors(async (req: Request, res: Response) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ status: "error", message: "Invalid request. Provide cabin IDs." });
  }

  await Promise.all(ids.map((id) => deleteCabin(id)));

  res.status(OK).json({
    status: "success",
    message: `${ids.length} cabins deleted successfully.`,
  });
});

export const updateCabinHandler = catchErrors(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { service, cabin, additionalFee } = req.body;

  if (!service && !cabin && additionalFee === undefined) {
    return res.status(400).json({
      status: "error",
      message: "At least one field (service, cabin, or additionalFee) must be provided for an update.",
    });
  }

  const updatedData = await updateCabin(Number(id), { service, cabin, additionalFee });

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

/* ADDITIONAL FEES */

export const getAllAdditionalFeesHandler = catchErrors(async (req: Request, res: Response) => {
  const additionalFees = await getAllAdditionalFees();

  if (!additionalFees.length) {
    return res.status(200).json({
      status: "success",
      message: "No additional fees found.",
      data: [],
    });
  }

  res.status(200).json({
    status: "success",
    data: additionalFees,
  });
});

export const deleteAdditionalFeeHandler = catchErrors(async (req: Request, res: Response) => {
  const { type } = req.params;

  if (!type) {
    return res.status(400).json({ status: "error", message: "Fee type is required for deletion." });
  }

  try {
    const deletedFee = await deleteAdditionalFee(type);
    res.status(200).json({
      status: "success",
      message: `Additional fee '${type}' deleted successfully.`,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: `Additional fee '${type}' not found.`,
    });
  }
});
