import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import {
  createBooking,
  getUserBookings,
} from '../controllers/booking.controller';

const router = Router();

router.post('/', isAuthenticated, createBooking);

router.get('/', isAuthenticated, getUserBookings);

export default router;
