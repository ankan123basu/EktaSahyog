import express from 'express';
import { getMapData } from '../controllers/map.js';

const router = express.Router();

router.get('/', getMapData);

export default router;
