import { Router } from 'express';
import { getProfile, updateProfile, deleteProfile, getStats, getDashboard, getEnrolledCourses } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.delete('/profile', authMiddleware, deleteProfile);
router.get('/stats', authMiddleware, getStats);
router.get('/dashboard', authMiddleware, getDashboard);
router.get('/enrollments', authMiddleware, getEnrolledCourses);
export default router;
