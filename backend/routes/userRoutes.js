import express from 'express';
import userController from '../controllers/userController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);

router.get('/me', requireAuth, userController.getProfile); // Add verification endpoint
router.get('/profile', requireAuth, userController.getProfile);
router.put('/profile', requireAuth, userController.updateProfile);
router.put('/password', requireAuth, userController.changePassword);
router.delete('/', requireAuth, userController.deleteAccount);
router.put('/activity', requireAuth, userController.updateLastActive);

export default router;