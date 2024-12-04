import { z } from 'zod';

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8);

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

export const emailSchema = z.object({
  to: z.array(emailSchema),
  cc: z.array(emailSchema).optional(),
  bcc: z.array(emailSchema).optional(),
  subject: z.string(),
  body: z.string()
});