import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { createCabin, deleteAllCabins, deleteCabin, getAllCabins, getCabin, updateCabin } from "../services/service.service";
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
  const { service, cabin } = req.body;

  if (!service || !cabin) {
    return res.status(400).json({
      status: "error",
      message: "Both service and cabin data are required.",
    });
  }
  
  if (typeof service.quantity !== "number") {
    service.quantity = parseInt(service.quantity, 10);
  }

  if (!service.name || !service.description || !service.imageUrl || service.price == null) {
    return res.status(400).json({
      status: "error",
      message: "Missing required service fields (name, description, imageUrl, quantity, price).",
    });
  }

  if (service.quantity < 1) {
    return res.status(400).json({
      status: "error",
      message: "Service quantity must be at least 1.",
    });
  }

  if (service.price < 0) {
    return res.status(400).json({
      status: "error",
      message: "Service price cannot be negative.",
    });
  }

  if (cabin.minCapacity == null || cabin.maxCapacity == null) {
    return res.status(400).json({
      status: "error",
      message: "Cabin minimum capacity and maximum capacity are required.",
    });
  }

  if (cabin.minCapacity < 1) {
    return res.status(400).json({
      status: "error",
      message: "Cabin minimum capacity must be at least 1.",
    });
  }

  if (cabin.maxCapacity < cabin.minCapacity) {
    return res.status(400).json({
      status: "error",
      message: "Cabin maximum capacity cannot be smaller than minimum capacity.",
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

export const updateCabinHandler = catchErrors(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { service, cabin } = req.body;

  if (!service && !cabin) {
    return res.status(400).json({
      status: "error",
      message: "At least one field (service or cabin) must be provided for an update.",
    });
  }

  const updatedData = await updateCabin(Number(id), { service, cabin });

  if (!updatedData) {
    console.error(`Update failed: Cabin ID ${id} not found.`);
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
