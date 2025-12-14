import express from 'express';
import { chatWithAI, translateMessage, summarizeChat } from '../controllers/ai.js';

const router = express.Router();

router.post('/chat', chatWithAI);
router.post('/translate', translateMessage);
router.post('/summarize', summarizeChat);

export default router;
