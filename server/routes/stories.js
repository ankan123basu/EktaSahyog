import express from 'express';
import { createStory, getStories, likeStory, addComment, deleteComment } from '../controllers/stories.js';

const router = express.Router();

router.get('/', getStories);
router.post('/', createStory);
router.put('/:id/like', likeStory);
router.post('/:id/comment', addComment);
router.delete('/:id/comment/:commentId', deleteComment);

export default router;
