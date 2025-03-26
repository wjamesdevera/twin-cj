import {
  cabinSchema,
  deleteItemsSchema,
  serviceSchema,
} from "../schemas/service.schemas";

import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import {
  createCabin,
  createDayTour,
  deleteCabin,
  deleteDayTour,
  deleteMultipleCabin,
  deleteMultipleDayTour,
  getAllCabins,
  getAllDayTours,
  getCabinById,
  getDayTourById,
  updateCabin,
  updateDayTour,
} from "../services/service.service";
import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from "../constants/http";
import { ROOT_STATIC_URL } from "../constants/url";
import appAssert from "../utils/appAssert";
import { idSchema, jsonSchema } from "../schemas/schemas";
import { z } from "zod";

export const createDayTourHandler = catchErrors(
  async (request: Request, response: Response) => {
    appAssert(request.file, BAD_REQUEST, "Image is required");
    const imageUrl = `${ROOT_STATIC_URL}/${request.file.filename}`;

    const jsonData = jsonSchema.parse(request.body);

    const parsedJsonData = JSON.parse(jsonData.data);

    const validatedData = serviceSchema.parse(parsedJsonData);

    const requestBody = {
      ...validatedData,
      imageUrl,
      serviceCategoryId: parsedJsonData.serviceCategoryId,
    };

    console.log(requestBody);

    const createdDayTour = await createDayTour(requestBody);

    response.status(CREATED).json({
      status: "success",
      data: { dayTour: createdDayTour },
    });
  }
);

export const getAllDayToursHandler = catchErrors(
  async (request: Request, response: Response) => {
    const dayTours = await getAllDayTours();

    appAssert(dayTours, NOT_FOUND, "No Day Tours Available");

    return response.status(OK).json({
      status: "success",
      data: { dayTours },
    });
  }
);

export const getDayTourByIdHandler = catchErrors(
  async (request: Request, response: Response) => {
    const { id } = idSchema.parse(request.params);
    appAssert(!isNaN(Number(id)), BAD_REQUEST, "Invalid day tour ID.");

    const dayTour = await getDayTourById(Number(id));
    appAssert(dayTour, 404, `Day Tour with ID ${id} not found.`);

    response.status(OK).json({
      status: "success",
      data: { dayTour },
    });
  }
);

export const updateDayTourHandler = catchErrors(
  async (request: Request, response: Response) => {
    const { id } = idSchema.parse(request.params);
    let imageUrl = request.body.imageUrl;
    if (request.file) {
      imageUrl = `${ROOT_STATIC_URL}/${request.file.filename}`;
    }

    appAssert(id && !isNaN(Number(id)), BAD_REQUEST, "Invalid ID");

    const transformedId = Number(id);

    const jsonData = jsonSchema.parse(request.body);

    const parsedJsonData = JSON.parse(jsonData.data);

    const validatedData = serviceSchema.parse(parsedJsonData);

    const updatedDayTour = await updateDayTour({
      id: transformedId,
      data: { ...validatedData, imageUrl },
    });

    response.status(OK).json({
      status: "success",
      data: { dayTour: updatedDayTour },
    });
  }
);

export const deleteDayTourHandler = catchErrors(
  async (request: Request, response: Response) => {
    const { id } = idSchema.parse(request.params);
    appAssert(!isNaN(Number(id)), BAD_REQUEST, "Invalid day tour ID.");

    await deleteDayTour(Number(id));
    response.status(OK).json({
      status: "success",
      message: `Day Tour Activity with ID ${id} deleted successfully`,
    });
  }
);

export const deleteSelectedDayToursHandler = catchErrors(
  async (request: Request, response: Response) => {
    const { ids } = deleteItemsSchema.parse(request.query);

    await deleteMultipleDayTour(ids);

    response.status(OK).json({
      status: "success",
      message: `${ids.length} day tours deleted successfully.`,
    });
  }
);

export const getCabinByIdHandler = catchErrors(
  async (request: Request, response: Response) => {
    const { id } = idSchema.parse(request.params);
    appAssert(!isNaN(Number(id)), BAD_REQUEST, "Invalid Cabin ID.");

    const cabin = await getCabinById(Number(id));
    appAssert(cabin, 404, `Cabin with ID ${id} not found.`);

    response.status(OK).json({
      status: "success",
      data: { cabin },
    });
  }
);

export const getAllCabinsHandler = catchErrors(
  async (request: Request, response: Response) => {
    const cabins = await getAllCabins();

    appAssert(cabins, NOT_FOUND, "No Cabins Available");

    response.status(OK).json({
      status: "success",
      data: { cabins },
    });
  }
);

export const createCabinHandler = catchErrors(
  async (request: Request, response: Response) => {
    appAssert(request.file, BAD_REQUEST, "Image is required");
    const imageUrl = `${ROOT_STATIC_URL}/${request.file.filename}`;

    const jsonData = jsonSchema.parse(request.body);

    const parsedJsonData = JSON.parse(jsonData.data);

    const validatedData = cabinSchema.parse(parsedJsonData);

    appAssert(validatedData, BAD_REQUEST, "Invalid Data format");

    const requestBody = {
      ...validatedData,
      imageUrl,
      serviceCategoryId: parsedJsonData.serviceCategoryId,
    };

    const createdCabin = await createCabin(requestBody);

    response
      .status(CREATED)
      .json({ status: "success", data: { cabin: createdCabin } });
  }
);

export const deleteCabinHandler = catchErrors(
  async (request: Request, response: Response) => {
    const { id } = idSchema.parse(request.params);
    appAssert(!isNaN(Number(id)), BAD_REQUEST, "Invalid day tour ID.");

    await deleteCabin(Number(id));

    response.status(OK).json({
      status: "success",
      message: `Cabin with ID ${id} deleted successfully`,
    });
  }
);

export const deleteSelectedCabinsHandler = catchErrors(
  async (request: Request, response: Response) => {
    const { ids } = deleteItemsSchema.parse(request.query);

    await deleteMultipleCabin(ids);

    response.status(OK).json({
      status: "success",
      message: `${ids.length} cabins deleted successfully.`,
    });
  }
);

export const updateCabinHandler = catchErrors(
  async (request: Request, response: Response) => {
    const { id } = idSchema.parse(request.params);

    let imageUrl = request.body.imageUrl;
    if (request.file) {
      imageUrl = `${ROOT_STATIC_URL}/${request.file.filename}`;
    }

    appAssert(id && !isNaN(Number(id)), BAD_REQUEST, "Invalid ID");

    const transformedId = Number(id);

    const jsonData = jsonSchema.parse(request.body);

    const parsedJsonData = JSON.parse(jsonData.data);

    const validatedData = cabinSchema.parse(parsedJsonData);
    const updatedCabin = await updateCabin({
      id: transformedId,
      data: {
        ...validatedData,
        imageUrl,
      },
    });

    response.status(OK).json({
      status: "success",
      data: { cabin: updatedCabin },
    });
  }
);