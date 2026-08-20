import express from 'express';
import {
  getJobs,
  searchAggregatedJobs,
  getJobProviders,
  getJobById,
  createJob,
  toggleSaveJob,
  getSavedJobs,
  getRecruiterJobs,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';
import { protect, optionalAuth, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getJobs);
router.get('/search', optionalAuth, searchAggregatedJobs);
router.get('/recommended', optionalAuth, searchAggregatedJobs);
router.get('/providers', getJobProviders);
router.get('/saved', protect, authorize('candidate'), getSavedJobs);
router.post('/saved/toggle', protect, authorize('candidate'), toggleSaveJob);
router.get('/recruiter/posted', protect, authorize('recruiter', 'admin'), getRecruiterJobs);
router.get('/:id', optionalAuth, getJobById);
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

export default router;
