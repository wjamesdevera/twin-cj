import { Request, Response } from 'express';
import {
  createDayTour,
  getAllDayTours,
  getDayTourById,
  deleteDayTour,
  updateDayTour,
} from '../services/service.serivce';
import { CREATED, OK } from '../constants/http';
import catchErrors from '../utils/catchErrors';
import path from 'path';
import fs from 'fs';

export const createDayTourHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { name, description, rate } = req.body;
    const imageUrl = req.file ? req.file.filename : '';
    const dayTour = await createDayTour({
      name,
      description,
      imageUrl,
      rate: parseFloat(rate),
    });
    res.status(201).json(dayTour);
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
      return res.status(404).json({
        status: 'fail',
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
    const updatedDayTour = await updateDayTour(Number(id), req.body);
    res.status(OK).json({
      status: 'success',
      data: { DayTour: updatedDayTour },
    });
  }
);

export const deleteDayTourHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const dayTour = await getDayTourById(Number(id));
    if (!dayTour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Day Tour not found',
      });
    }

    if (dayTour.service && dayTour.service.imageUrl) {
      const imagePath = path.join(
        __dirname,
        '../../uploads',
        dayTour.service.imageUrl
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
