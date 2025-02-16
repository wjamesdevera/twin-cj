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
    const { name, description, rate, quantity } = req.body;
    const imageUrl = req.file ? req.file.filename : '';

    // Validation
    if (!name || !description || !rate || !quantity || !imageUrl) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (typeof name !== 'string' || typeof description !== 'string') {
      return res
        .status(400)
        .json({ error: 'Name and description must be strings' });
    }

    if (isNaN(parseFloat(rate)) || parseFloat(rate) <= 0) {
      return res.status(400).json({ error: 'Rate must be a positive number' });
    }

    if (isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
      return res
        .status(400)
        .json({ error: 'quantity should be a positive number' });
    }

    const dayTour = await createDayTour({
      name,
      description,
      imageUrl,
      rate: parseFloat(rate),
      quantity: parseInt(quantity),
    });
    res.status(CREATED).json(dayTour);
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
    const { name, description, rate, quantity } = req.body;
    let imageUrl = req.body.imageUrl;

    // Validation
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ status: 'error', message: 'Invalid ID' });
    }
    if (!name || name.trim() === '') {
      return res
        .status(400)
        .json({ status: 'error', message: 'Name is required' });
    }
    if (!description || description.trim() === '') {
      return res
        .status(400)
        .json({ status: 'error', message: 'Description is required' });
    }
    if (!rate || isNaN(parseFloat(rate)) || parseFloat(rate) <= 0) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Rate must be a positive number' });
    }
    if (!quantity || isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'quantity must be a positive integer',
      });
    }

    if (req.file) {
      imageUrl = req.file.filename;
      const existingDayTour = await getDayTourById(Number(id));
      if (
        existingDayTour &&
        existingDayTour.service &&
        existingDayTour.service.imageUrl
      ) {
        const oldImagePath = path.join(
          __dirname,
          '../../uploads',
          existingDayTour.service.imageUrl
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error('Failed to delete old image file:', err);
          }
        });
      }
    }

    const updatedDayTour = await updateDayTour(Number(id), {
      name,
      description,
      imageUrl,
      rate: parseFloat(rate),
      quantity: quantity ? parseInt(quantity) : 0,
    });

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
