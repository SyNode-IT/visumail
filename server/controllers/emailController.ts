import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { emailAccountSchema, sendEmailSchema } from '../utils/validation/emailSchemas.js';
import { EmailRepository } from '../services/database/EmailRepository.js';
import { IMAPService } from '../services/email/IMAPService.js';
import { SMTPService } from '../services/email/SMTPService.js';
import { detectEmailProvider } from '../config/email.js';
import { EMAIL } from '../config/constants.js';
import { AppError } from '../middleware/errorHandler.js';

export async function addAccount(req: AuthRequest, res: Response) {
  const accountData = emailAccountSchema.parse(req.body);
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  // Auto-detect email provider settings if not provided
  const provider = detectEmailProvider(accountData.email);
  if (provider) {
    accountData.imapHost = accountData.imapHost || provider.config.imap.host;
    accountData.imapPort = accountData.imapPort || provider.config.imap.port;
    accountData.imapSecure = accountData.imapSecure ?? provider.config.imap.secure;
    accountData.smtpHost = accountData.smtpHost || provider.config.smtp.host;
    accountData.smtpPort = accountData.smtpPort || provider.config.smtp.port;
    accountData.smtpSecure = accountData.smtpSecure ?? provider.config.smtp.secure;
  }

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

  // Test connections before saving
  const imapService = new IMAPService(testAccount);
  const smtpService = new SMTPService(testAccount);

  await Promise.all([
    imapService.testConnection(),
    smtpService.testConnection()
  ]);

  const accountId = await EmailRepository.saveAccount(testAccount, userId);

  // Fetch initial emails
  const emails = await imapService.fetchEmails('INBOX', EMAIL.FETCH_LIMIT);
  for (const email of emails) {
    await EmailRepository.saveEmail({
      ...email,
      accountId,
      status: 'todo',
      priority: 'medium'
    });
  }

  res.status(201).json({
    id: accountId,
    email: accountData.email,
    name: accountData.name,
    emailCount: emails.length
  });
}

export async function sendEmail(req: AuthRequest, res: Response) {
  const emailData = sendEmailSchema.parse(req.body);
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  if (emailData.to.length + (emailData.cc?.length || 0) + (emailData.bcc?.length || 0) > EMAIL.MAX_RECIPIENTS) {
    throw new AppError(`Maximum number of recipients is ${EMAIL.MAX_RECIPIENTS}`, 400);
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