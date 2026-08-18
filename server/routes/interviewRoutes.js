import express from 'express';
import {
  scheduleInterview,
  getMyInterviews,
  updateInterviewStatus,
  getInterviewAssessment,
  submitInterviewAssessment,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/assessment', protect, getInterviewAssessment);
router.post('/submit-assessment', protect, submitInterviewAssessment);
router.post('/', protect, scheduleInterview);
router.get('/my', protect, getMyInterviews);
router.put('/:id', protect, updateInterviewStatus);

export default router;
