import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../../middleware/auth.js';
import { EmailRepository } from '../../services/database/EmailRepository.js';
import { SMTPService } from '../../services/email/SMTPService.js';
import { AppError } from '../../middleware/errorHandler.js';

const sendEmailSchema = z.object({
  accountId: z.number(),
  to: z.array(z.string().email()),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  subject: z.string(),
  body: z.string()
});

export async function sendEmail(req: AuthRequest, res: Response) {
  const emailData = sendEmailSchema.parse(req.body);
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const account = await EmailRepository.findAccountById(emailData.accountId, userId);
  if (!account) {
    throw new AppError('Email account not found', 404);
  }

  const smtpService = new SMTPService(account);
  await smtpService.sendEmail({
    from: `${account.name} <${account.email}>`,
    to: emailData.to.join(', '),
    cc: emailData.cc?.join(', '),
    bcc: emailData.bcc?.join(', '),
    subject: emailData.subject,
    text: emailData.body
  });

  const emailId = await EmailRepository.saveEmail({
    accountId: account.id,
    messageId: `sent-${Date.now()}`,
    subject: emailData.subject,
    from: account.email,
    to: emailData.to,
    cc: emailData.cc,
    bcc: emailData.bcc,
    body: emailData.body,
    receivedDate: new Date(),
    status: 'done'
  });

  res.json({ 
    id: emailId,
    message: 'Email sent successfully' 
  });
}

export async function getEmails(req: AuthRequest, res: Response) {
  const userId = req.user?.id;
  const { status, priority, label } = req.query;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const emails = await EmailRepository.findEmailsByUserId(userId, {
    status: status as string,
    priority: priority as string,
    label: label as string
  });

  res.json(emails);
}

export async function updateEmailStatus(req: AuthRequest, res: Response) {
  const userId = req.user?.id;
  const emailId = parseInt(req.params.id);
  const { status } = req.body;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  await EmailRepository.updateEmailStatus(emailId, status);
  res.json({ message: 'Email status updated successfully' });
}