import express from 'express';
import { getJobs, getJobById, createJob, toggleSaveJob, getSavedJobs } from '../controllers/jobController.js';
import { protect, optionalAuth, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getJobs);
router.get('/saved', protect, authorize('candidate'), getSavedJobs);
router.post('/saved/toggle', protect, authorize('candidate'), toggleSaveJob);
router.get('/:id', optionalAuth, getJobById);
router.post('/', protect, authorize('recruiter', 'admin'), createJob);

export default router;
