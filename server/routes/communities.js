import express from 'express';
import { getRecommendedCommunities, createCommunity } from '../controllers/communities.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/* READ */
router.get('/recommended', verifyToken, getRecommendedCommunities);

/* WRITE */
router.post('/', verifyToken, createCommunity);

export default router;
