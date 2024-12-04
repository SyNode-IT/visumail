import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { UserRepository } from '../../services/database/UserRepository.js';
import { AppError } from '../../middleware/errorHandler.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function register(req: Request, res: Response) {
  const { email, password } = registerSchema.parse(req.body);

  const existingUser = await UserRepository.findByEmail(email);
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await UserRepository.create(email, hashedPassword);

  const token = jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  res.status(201).json({ 
    token,
    user: {
      id: userId,
      email,
      twoFactorEnabled: false
    }
  });
}