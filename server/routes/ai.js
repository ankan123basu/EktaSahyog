import express from 'express';
import { chatWithAI, translateMessage, summarizeChat } from '../controllers/ai.js';
import { aiLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.post('/chat', aiLimiter, chatWithAI);
router.post('/translate', aiLimiter, translateMessage);
router.post('/summarize', aiLimiter, summarizeChat);

export default router;
