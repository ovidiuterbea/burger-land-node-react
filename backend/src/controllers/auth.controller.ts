import { Request, Response, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { signToken } from '../utils/jwt';
import bcrypt from 'bcrypt';
import { registerSchema } from '../validation-schemas/registerSchema';
import { loginSchema } from '../validation-schemas/loginSchema';

const prisma = new PrismaClient();

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const { error } = registerSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName },
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { error } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = signToken({ userId: user.id });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Logged out successfully' });
};
