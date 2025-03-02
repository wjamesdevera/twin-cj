import { Request, Response } from 'express';
import {
  createDayTour,
  getAllDayTours,
  getDayTourById,
  deleteDayTour,
  updateDayTour,
} from '../services/service.service';
import { BAD_REQUEST, CREATED, OK } from '../constants/http';
import catchErrors from '../utils/catchErrors';
import path from 'path';
import fs from 'fs';
import appAssert from '../utils/appAssert';
import { ROOT_STATIC_URL } from '../constants/url';
import { serviceSchema } from '../schemas/service.schemas';
import { ZodError } from 'zod';

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
        name: validatedData.name,
        description: validatedData.description,
        imageUrl,
        price: validatedData.price,
        additionalFee:
          validatedData.additionalFee?.type &&
          validatedData.additionalFee?.description &&
          validatedData.additionalFee?.amount !== undefined
            ? {
                type: validatedData.additionalFee.type,
                description: validatedData.additionalFee.description,
                amount: validatedData.additionalFee.amount,
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
    res.status(OK).json({
      status: 'success',
      data: { dayTours },
    });
  }
);

export const getDayTourByIdHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const dayTour = await getDayTourById(Number(id));
    if (!dayTour) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        message: 'Day Tour not found',
      });
    }
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

      if (req.file) {
        imageUrl = `uploads/${req.file.filename}`;
        const existingDayTour = await getDayTourById(Number(id));
        if (existingDayTour?.service?.imageUrl) {
          const oldImagePath = path.join(
            __dirname,
            '../../uploads',
            existingDayTour.service.imageUrl.replace(/^.*[\\\/]/, '')
          );
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error('Failed to delete old image file:', err);
          });
        }
      }

      const updatedDayTour = await updateDayTour(Number(id), {
        ...validatedData,
        imageUrl,
        rate: validatedData.price,
        additionalFee: validatedData.additionalFee || {},
      });

      res.status(OK).json({
        status: 'success',
        data: { DayTour: updatedDayTour },
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
    const dayTour = await getDayTourById(Number(id));
    if (!dayTour) {
      return res.status(404).json({
        status: BAD_REQUEST,
        message: 'Day Tour not found',
      });
    }

    if (dayTour.service && dayTour.service.imageUrl) {
      const imagePath = path.join(
        __dirname,
        '../../uploads',
        dayTour.service.imageUrl.replace(/^.*[\\\/]/, '')
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Failed to delete image file:', err);
        }
      });
    }

    await deleteDayTour(Number(id));
    res.status(OK).json({
      status: 'success',
      message: `Day Tour Activity with ID ${id} deleted successfully`,
    });
  }
);
