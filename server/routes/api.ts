import express from 'express';
import { authMiddleware, validateSchema } from '../middleware/auth';
import * as emailController from '../controllers/emailController';
import * as authController from '../controllers/authController';
import * as twoFactorController from '../controllers/twoFactorController';
import { rateLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Auth routes with rate limiting
router.post('/auth/register', 
  rateLimiter('register', 5, 3600), // 5 attempts per hour
  validateSchema(authController.registerSchema), 
  authController.register
);

router.post('/auth/login',
  rateLimiter('login', 10, 900), // 10 attempts per 15 minutes
  validateSchema(authController.loginSchema),
  authController.login
);

// 2FA routes
router.post('/auth/2fa/setup',
  authMiddleware,
  validateSchema(twoFactorController.setupSchema),
  twoFactorController.setup2FA
);

router.post('/auth/2fa/verify',
  authMiddleware,
  validateSchema(twoFactorController.verifySchema),
  twoFactorController.verify2FA
);

router.post('/auth/2fa/validate',
  validateSchema(twoFactorController.verifySchema),
  twoFactorController.validate2FA
);

// Protected email routes
router.use(authMiddleware);

router.get('/emails',
  rateLimiter('fetch_emails', 30, 60), // 30 requests per minute
  emailController.getEmails
);

router.post('/emails',
  rateLimiter('send_email', 60, 3600), // 60 emails per hour
  emailController.sendEmail
);

router.post('/accounts',
  rateLimiter('add_account', 5, 3600), // 5 new accounts per hour
  emailController.addAccount
);

router.get('/accounts/:id/emails',
  rateLimiter('fetch_account_emails', 30, 60),
  emailController.getAccountEmails
);

router.delete('/accounts/:id',
  rateLimiter('remove_account', 5, 3600),
  emailController.removeAccount
);

export default router;