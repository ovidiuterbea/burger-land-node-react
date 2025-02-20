import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import {
  purchaseTicket,
  getUserTickets,
} from '../controllers/ticket.controller';

const router = Router();

router.post('/', isAuthenticated, purchaseTicket);

router.get('/', isAuthenticated, getUserTickets);

export default router;
