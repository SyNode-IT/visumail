import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { TwoFactorService } from '../services/TwoFactorService';
import { AppError } from '../middleware/errorHandler';

export const setupSchema = z.object({
  email: z.string().email()
});

export const verifySchema = z.object({
  token: z.string().length(6)
});

export async function setup2FA(req: AuthRequest, res: Response) {
  const userId = req.user?.id;
  const { email } = req.body;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const secret = await TwoFactorService.generateSecret(userId);
  const qrCode = await TwoFactorService.generateQRCode(email, secret);

  res.json({ qrCode, secret });
}

export async function verify2FA(req: AuthRequest, res: Response) {
  const userId = req.user?.id;
  const { token } = req.body;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  await TwoFactorService.enableTwoFactor(userId, token);
  res.json({ message: 'Two-factor authentication enabled successfully' });
}

export async function validate2FA(req: Request, res: Response) {
  const { userId, token } = req.body;

  const isValid = await TwoFactorService.validateToken(userId, token);
  if (!isValid) {
    throw new AppError('Invalid 2FA token', 401);
  }

  res.json({ valid: true });
}