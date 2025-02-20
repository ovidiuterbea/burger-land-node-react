import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import ticketRoutes from './routes/ticket.routes';
import bookingRoutes from './routes/booking.routes';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tickets', ticketRoutes);
app.use('/bookings', bookingRoutes);

export default app;
