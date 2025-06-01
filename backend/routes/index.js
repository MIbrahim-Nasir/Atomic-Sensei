import express from 'express';
import userRoutes from './userRoutes.js';
import roadmapRoutes from './roadmapRoutes.js';
import moduleContentRoutes from './moduleContentRoutes.js';
import quizRoutes from './quizRoutes.js';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/roadmap', roadmapRoutes);
router.use('/module-content', moduleContentRoutes);
router.use('/quiz', quizRoutes);

export default router;