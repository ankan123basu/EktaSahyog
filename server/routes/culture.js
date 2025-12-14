import express from 'express';
import { createCulture, getCulture, likeCulture } from '../controllers/culture.js';

const router = express.Router();

router.get('/', getCulture);
router.post('/', createCulture);
router.put('/:id/like', likeCulture);

export default router;
