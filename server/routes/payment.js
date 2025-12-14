import express from 'express';
import { createCheckoutSession } from '../controllers/payment.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-checkout-session', verifyToken, createCheckoutSession);

export default router;
