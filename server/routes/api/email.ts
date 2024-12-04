import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { rateLimiter } from '../../middleware/rateLimiter.js';
import * as emailController from '../../controllers/email/emailController.js';
import * as accountController from '../../controllers/email/accountController.js';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Email routes
router.get('/',
  rateLimiter('fetch_emails', 30, 60),
  emailController.getEmails
);

router.post('/',
  rateLimiter('send_email', 60, 3600),
  emailController.sendEmail
);

router.patch('/:id/status',
  rateLimiter('update_status', 60, 60),
  emailController.updateEmailStatus
);

// Account routes
router.get('/accounts',
  rateLimiter('fetch_accounts', 30, 60),
  accountController.getAccounts
);

router.post('/accounts',
  rateLimiter('add_account', 5, 3600),
  accountController.addAccount
);

router.delete('/accounts/:id',
  rateLimiter('remove_account', 5, 3600),
  accountController.removeAccount
);

export default router;