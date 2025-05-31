import express from 'express';
import roadmapController from '../controllers/roadmapController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// Route to generate and create a new roadmap
router.post('/', requireAuth, roadmapController.createRoadmap);

// Get all roadmaps for the current user
router.get('/', requireAuth, roadmapController.getUserRoadmaps);

// Get a specific roadmap by ID
router.get('/:id', requireAuth, roadmapController.getRoadmap);

// Update progress for a topic in a roadmap
router.post('/progress', requireAuth, roadmapController.updateTopicProgress);

export default router;