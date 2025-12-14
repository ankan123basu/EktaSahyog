import express from 'express';
import { createProject, getProjects, joinProject, leaveProject, donateToProject } from '../controllers/projects.js';

const router = express.Router();

router.get('/', getProjects);
router.post('/', createProject);
router.patch('/:id/join', joinProject);
router.patch('/:id/leave', leaveProject);
router.post('/donate', donateToProject);

export default router;
