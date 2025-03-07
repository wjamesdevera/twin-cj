import { Request, Response } from 'express';
import catchErrors from '../utils/catchErrors';
import {
  createDayTour,
  getAllDayTours,
  getDayTourById,
  deleteDayTour,
  updateDayTour,
} from '../services/service.service';
import { BAD_REQUEST, CREATED, OK } from '../constants/http';
import { ROOT_STATIC_URL } from '../constants/url';
import appAssert from '../utils/appAssert';
import { z, ZodError } from 'zod';
import { serviceSchema } from '../schemas/service.schemas';

export const createDayTourHandler = catchErrors(
  async (req: Request, res: Response) => {
    appAssert(req.file, BAD_REQUEST, 'Image is required');
    const imageUrl = `${ROOT_STATIC_URL}/${req.file.filename}`;

    let jsonData;
    try {
      jsonData = JSON.parse(req.body.data);
    } catch (error) {
      console.error('JSON Parsing Error:', error);
      return res
        .status(BAD_REQUEST)
        .json({ status: 'error', message: 'Invalid JSON input' });
    }

    try {
      const validatedData = serviceSchema.parse(jsonData);
      const requestBody = {
        ...validatedData,
        imageUrl,
        additionalFee: validatedData.additionalFee
          ? {
              type: validatedData.additionalFee.type || '',
              description: validatedData.additionalFee.description || '',
              amount: validatedData.additionalFee.amount || 0,
            }
          : undefined,
      };

      const createdDayTour = await createDayTour(requestBody);

      res.status(CREATED).json({
        status: 'success',
        data: { dayTour: createdDayTour },
      });
    } catch (validationError) {
      console.error('Validation Error:', validationError);
      return res
        .status(BAD_REQUEST)
        .json({ status: 'error', message: 'Invalid data format' });
    }
  }
);

export const getAllDayToursHandler = catchErrors(
  async (req: Request, res: Response) => {
    const dayTours = await getAllDayTours();

    if (dayTours.length === 0) {
      return res.status(OK).json({
        status: 'success',
        message: 'No day tours found.',
        data: { dayTours: [] },
      });
    }

    res.status(OK).json({
      status: 'success',
      data: { dayTours },
    });
  }
);

export const getDayTourByIdHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    appAssert(!isNaN(Number(id)), BAD_REQUEST, 'Invalid day tour ID.');

    const dayTour = await getDayTourById(Number(id));
    appAssert(dayTour, 404, `Day Tour with ID ${id} not found.`);

    res.status(OK).json({
      status: 'success',
      data: { dayTour },
    });
  }
);

export const updateDayTourHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    let imageUrl = req.body.imageUrl;

    appAssert(id && !isNaN(Number(id)), BAD_REQUEST, 'Invalid ID');

    let jsonData;
    try {
      jsonData = JSON.parse(req.body.data);
    } catch (error) {
      return res
        .status(BAD_REQUEST)
        .json({ status: 'error', message: 'Invalid JSON input' });
    }

    try {
      const validatedData = serviceSchema.parse(jsonData);

      const updatedDayTour = await updateDayTour(Number(id), {
        ...validatedData,
        imageUrl,
        price: validatedData.price,
        additionalFee: {
          type: validatedData.additionalFee?.type || '',
          description: validatedData.additionalFee?.description || '',
          amount: validatedData.additionalFee?.amount || 0,
        },
      });

      res.status(OK).json({
        status: 'success',
        data: { dayTour: updatedDayTour },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Validation Error:', error);
        return res.status(BAD_REQUEST).json({
          status: 'error',
          message: error.errors || 'Invalid data format',
        });
      }
      throw error;
    }
  }
);

export const deleteDayTourHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    appAssert(!isNaN(Number(id)), BAD_REQUEST, 'Invalid day tour ID.');

    const dayTour = await getDayTourById(Number(id));
    appAssert(dayTour, 404, `Day Tour with ID ${id} not found.`);

    await deleteDayTour(Number(id));
    res.status(OK).json({
      status: 'success',
      message: `Day Tour Activity with ID ${id} deleted successfully`,
    });
  }
);

export const deleteSelectedDayToursHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid request. Provide day tour IDs.',
      });
    }

    await Promise.all(ids.map((id) => deleteDayTour(id)));

    res.status(OK).json({
      status: 'success',
      message: `${ids.length} day tours deleted successfully.`,
    });
  }
);
