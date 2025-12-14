import express from 'express';
import { createProduct, getProducts, buyWithPoints, updateShipping } from '../controllers/marketplace.js'; // Added updateShipping
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/* READ */
router.get('/', getProducts);

/* WRITE */
router.post('/create', verifyToken, createProduct);
router.post('/buy-with-points', verifyToken, buyWithPoints);
router.post('/shipping/:orderId', updateShipping); // New Route

export default router;
