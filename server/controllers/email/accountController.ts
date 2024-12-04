import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../../middleware/auth.js';
import { EmailRepository } from '../../services/database/EmailRepository.js';
import { IMAPService } from '../../services/email/IMAPService.js';
import { SMTPService } from '../../services/email/SMTPService.js';
import { AppError } from '../../middleware/errorHandler.js';

const addAccountSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  imapHost: z.string(),
  imapPort: z.number(),
  imapSecure: z.boolean(),
  smtpHost: z.string(),
  smtpPort: z.number(),
  smtpSecure: z.boolean(),
  password: z.string()
});

export async function addAccount(req: AuthRequest, res: Response) {
  const accountData = addAccountSchema.parse(req.body);
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  // Test connections before saving
  const testAccount = {
    email: accountData.email,
    name: accountData.name,
    imapConfig: {
      host: accountData.imapHost,
      port: accountData.imapPort,
      secure: accountData.imapSecure
    },
    smtpConfig: {
      host: accountData.smtpHost,
      port: accountData.smtpPort,
      secure: accountData.smtpSecure
    },
    credentials: {
      password: accountData.password
    }
  };

  const imapService = new IMAPService(testAccount);
  const smtpService = new SMTPService(testAccount);

  await Promise.all([
    imapService.testConnection(),
    smtpService.testConnection()
  ]);

  const accountId = await EmailRepository.saveAccount(testAccount, userId);

  res.status(201).json({
    id: accountId,
    email: accountData.email,
    name: accountData.name
  });
}

export async function getAccounts(req: AuthRequest, res: Response) {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const accounts = await EmailRepository.findEmailsByUserId(userId);
  res.json(accounts);
}

export async function removeAccount(req: AuthRequest, res: Response) {
  const userId = req.user?.id;
  const accountId = parseInt(req.params.id);

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const success = await EmailRepository.deleteAccount(accountId, userId);
  if (!success) {
    throw new AppError('Account not found', 404);
  }

  res.json({ message: 'Account removed successfully' });
}