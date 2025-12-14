import express from 'express';
import { createResource, getResources } from '../controllers/resources.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/* READ */
router.get('/', getResources);

/* WRITE */
router.post('/', verifyToken, createResource);

export default router;
