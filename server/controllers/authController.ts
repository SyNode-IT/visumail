import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { emailSchema, passwordSchema } from '../utils/validation.js';
import { hashPassword, comparePasswords } from '../utils/encryption.js';
import { UserRepository } from '../services/database/UserRepository.js';
import { AppError } from '../middleware/errorHandler.js';
import { AUTH } from '../config/constants.js';

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export const loginSchema = registerSchema;

export async function register(req: Request, res: Response) {
  const { email, password } = registerSchema.parse(req.body);

  const existingUser = await UserRepository.findByEmail(email);
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  const hashedPassword = await hashPassword(password);
  const userId = await UserRepository.create(email, hashedPassword);

  const token = jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: AUTH.JWT_EXPIRY }
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

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);
  
  const user = await UserRepository.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isValidPassword = await comparePasswords(password, user.password);
  if (!isValidPassword) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: AUTH.JWT_EXPIRY }
  );

  res.json({ 
    token,
    user: {
      id: user.id,
      email: user.email,
      twoFactorEnabled: user.twoFactorEnabled
    }
  });
}