import express from 'express';
import userRoutes from './userRoutes.js';
import roadmapRoutes from './roadmapRoutes.js';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/roadmap', roadmapRoutes);

export default router;