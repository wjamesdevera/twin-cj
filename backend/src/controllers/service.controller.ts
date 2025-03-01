import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import {
  createCabin,
  deleteAllCabins,
  deleteCabin,
  getAllCabins,
  getCabin,
  updateCabin,
} from "../services/service.service";
import { BAD_REQUEST, CREATED, OK } from "../constants/http";
import { ROOT_STATIC_URL } from "../constants/url";
import appAssert from "../utils/appAssert";
import { cabinSchema } from "../schemas/service.schemas";

export const getCabinHandler = catchErrors(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid cabin ID." });
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
  }
);

export const getAllCabinsHandler = catchErrors(
  async (req: Request, res: Response) => {
    const cabins = await getAllCabins();

    if (cabins.length === 0) {
      return res.status(OK).json({
        status: "success",
        message: "No cabins found.",
        data: { cabins: [] },
      });
    }

    res.status(OK).json({
      status: "success",
      data: { cabins },
    });
  }
);

export const createCabinHandler = catchErrors(
  async (req: Request, res: Response) => {
    appAssert(req.file, BAD_REQUEST, "Image is required");
    const imageUrl = `${ROOT_STATIC_URL}/${req.file.filename}`;

    let jsonData;
    try {
      jsonData = JSON.parse(req.body.data);
    } catch (error) {
      console.error("JSON Parsing Error:", error);
      return res.status(BAD_REQUEST).json({ status: "error", message: "Invalid JSON Input" });
    }

    try {
      const validatedData = cabinSchema.parse(jsonData);
      const requestBody = {
        service: {
          name: validatedData.name,
          description: validatedData.description,
          imageUrl,
          quantity: validatedData.quantity,
          price: validatedData.price,
        },
        cabin: {
          minCapacity: validatedData.minCapacity,
          maxCapacity: validatedData.maxCapacity,
        },
        additionalFee: validatedData.additionalFee?.type ? validatedData.additionalFee: undefined,
      };

      const createdCabin = await createCabin(requestBody);

      res.status(CREATED).json({ status: "success", data: { cabin: createdCabin } });
    } catch (validationError) {
      console.error("Validation Error: ", validationError);
      return res.status(BAD_REQUEST).json({ status: "error", message: "Invalid Data Format" });
    }

    // NOTE: You may remove this after accomplishing the task
    // Apply the given structure above to request that requires files and text data

    // TODO: ADD Validations

    // TODO: Implement adding the data to the database

    // if (!service || !cabin) {
    //   return res.status(400).json({
    //     status: "error",
    //     message: "Service and cabin data are required.",
    //   });
    // }

    // if (
    //   additionalFee &&
    //   (additionalFee.amount == null || additionalFee.amount < 0)
    // ) {
    //   return res.status(400).json({
    //     status: "error",
    //     message: "Additional fee must have a valid amount.",
    //   });
    // }

    // const result = await createCabin({ service, cabin, additionalFee });

    // res.status(CREATED).json({
    //   status: "success",
    //   data: result,
    // });
  }
);

export const deleteAllCabinsHandler = catchErrors(
  async (req: Request, res: Response) => {
    const deletedData = await deleteAllCabins();

    res.status(OK).json({
      status: "success",
      message:
        "All cabins and their corresponding services have been deleted successfully.",
      data: deletedData,
    });
  }
);

export const deleteCabinHandler = catchErrors(
  async (req: Request, res: Response) => {
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
        message:
          `Cabin with ID ${deletedCabin.id} deleted successfully.` +
          (deletedService
            ? ` Service ID ${deletedService.id} was also deleted.`
            : ""),
        data: deletedData,
      });
    } catch (error) {
      console.error(`Error deleting cabin ID ${cabinId}:`, error);
      return res.status(500).json({
        status: "error",
        message: "An error occurred while deleting the cabin.",
      });
    }
  }
);

export const deleteSelectedCabinsHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Invalid request. Provide cabin IDs.",
      });
    }

    await Promise.all(ids.map((id) => deleteCabin(id)));

    res.status(OK).json({
      status: "success",
      message: `${ids.length} cabins deleted successfully.`,
    });
  }
);

export const updateCabinHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { service, cabin, additionalFee } = req.body;

    if (!service && !cabin && additionalFee === undefined) {
      return res.status(400).json({
        status: "error",
        message:
          "At least one field (service, cabin, or additionalFee) must be provided for an update.",
      });
    }

    const updatedData = await updateCabin(Number(id), {
      service,
      cabin,
      additionalFee,
    });

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
  }
);
