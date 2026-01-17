import express from 'express';
import quizController from '../controllers/quizController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// Generate a quiz for a topic
router.post('/generate', requireAuth, quizController.generateQuiz);

// Get a quiz for a specific topic
router.get('/:topic', requireAuth, quizController.getQuiz);

export default router;