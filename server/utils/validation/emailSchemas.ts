import { z } from 'zod';
import { emailSchema } from './authSchemas.js';

export const emailAccountSchema = z.object({
  email: emailSchema,
  name: z.string().min(1),
  imapHost: z.string(),
  imapPort: z.number(),
  imapSecure: z.boolean(),
  smtpHost: z.string(),
  smtpPort: z.number(),
  smtpSecure: z.boolean(),
  password: z.string()
});

export const sendEmailSchema = z.object({
  accountId: z.number(),
  to: z.array(emailSchema),
  cc: z.array(emailSchema).optional(),
  bcc: z.array(emailSchema).optional(),
  subject: z.string(),
  body: z.string()
});