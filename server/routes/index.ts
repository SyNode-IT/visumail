import express from 'express';
import { register, login } from '../controllers/authController';
import { addEmailAccount, fetchEmails } from '../controllers/emailController';
import { authMiddleware, validateSchema } from '../middleware/auth';
import { registerSchema, loginSchema } from '../controllers/authController';
import { addAccountSchema } from '../controllers/emailController';

const router = express.Router();

// Auth routes
router.post('/auth/register', validateSchema(registerSchema), register);
router.post('/auth/login', validateSchema(loginSchema), login);

// Email routes (protected)
router.use('/emails', authMiddleware);
router.post('/emails/accounts', validateSchema(addAccountSchema), addEmailAccount);
router.get('/emails/accounts/:accountId', fetchEmails);

export default router;