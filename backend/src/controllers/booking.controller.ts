import { Request, RequestHandler, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

export const createBooking: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
    }

    const { bookingType, bookingDate } = req.body;

    const newBooking = await prisma.booking.create({
      data: {
        userId: userId as string,
        bookingType,
        bookingDate: new Date(bookingDate),
      },
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking: newBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating booking' });
  }
};

export const getUserBookings: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving bookings' });
  }
};
