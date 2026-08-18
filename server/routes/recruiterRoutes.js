import express from 'express';
import { getRecruiterDashboardStats, getCandidateRankings, getTeamCompatibility } from '../controllers/recruiterController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard-stats', protect, authorize('recruiter', 'admin'), getRecruiterDashboardStats);
router.get('/candidate-rankings', protect, authorize('recruiter', 'admin'), getCandidateRankings);
router.post('/team-compatibility', protect, authorize('recruiter', 'admin'), getTeamCompatibility);

export default router;
