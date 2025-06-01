import express from 'express';
import moduleContentController from '../controllers/moduleContentController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// Generate content for a topic
router.post('/generate', requireAuth, moduleContentController.generateContent);

// Get content for a specific topic
router.get('/:topic', requireAuth, moduleContentController.getContent);

export default router;