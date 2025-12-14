import express from 'express';
import { getDashboardSummary, getChartData } from '../controllers/dashboard.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get Summary Stats
router.get('/summary', getDashboardSummary);

// Get Chart Data
router.get('/charts', getChartData);

export default router;
