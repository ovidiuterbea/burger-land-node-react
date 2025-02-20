import { Request, Response, RequestHandler } from 'express';
import { PrismaClient, TicketType } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

const SINGLE_TICKET_PRICE = 50.0;
const FAMILY_TICKET_PRICE = 120.0;

export const purchaseTicket: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    const { ticketDate, type } = req.body;
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
    }

    let price = SINGLE_TICKET_PRICE;
    let ticketType: TicketType = TicketType.SINGLE;

    if (type === TicketType.FAMILY) {
      price = FAMILY_TICKET_PRICE;
      ticketType = TicketType.FAMILY;
    }

    const newTicket = await prisma.ticket.create({
      data: {
        userId: userId as string,
        ticketDate: new Date(ticketDate),
        type: ticketType,
        price,
      },
    });

    res.status(201).json({
      message: 'Ticket purchased successfully',
      ticket: newTicket,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error purchasing ticket' });
  }
};

export const getUserTickets: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req as AuthenticatedRequest;
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
    }

    const tickets = await prisma.ticket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving tickets' });
  }
};
