import { Router } from 'express';
import { login } from '../../controllers/auth/loginController.js';
import { register } from '../../controllers/auth/registerController.js';
import { rateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post('/login',
  rateLimiter('login', 10, 900), // 10 attempts per 15 minutes
  login
);

router.post('/register',
  rateLimiter('register', 5, 3600), // 5 attempts per hour
  register
);

export default router;