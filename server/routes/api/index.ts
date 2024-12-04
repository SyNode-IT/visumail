import { Router } from 'express';
import authRoutes from './auth.js';
import emailRoutes from './email.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/emails', emailRoutes);

export default router;