import express from 'express';
import { handleStripeWebhook } from '../controllers/webhook.js';

const router = express.Router();

// CRITICAL: Use raw body for Stripe signature verification
router.post('/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
