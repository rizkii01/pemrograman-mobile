import { Router } from 'express';
import * as ctrl from '../controllers/project.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.get('/', ctrl.getProjects);
router.get('/:id', ctrl.getProjectById);
router.post('/', authMiddleware, ctrl.createProject);
router.put('/:id', authMiddleware, ctrl.updateProject);
router.delete('/:id', authMiddleware, ctrl.deleteProject);
router.post('/:id/submit', authMiddleware, ctrl.submitProject);
router.get('/user/submissions', authMiddleware, ctrl.getSubmissions);
router.put('/submissions/:id/review', authMiddleware, ctrl.reviewSubmission);
router.get('/user/portfolio', authMiddleware, ctrl.getPortfolio);
export default router;
