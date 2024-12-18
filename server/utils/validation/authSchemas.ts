import { z } from 'zod';

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8);

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export const loginSchema = registerSchema;