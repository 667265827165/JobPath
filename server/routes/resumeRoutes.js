import express from 'express';
import { uploadAndParseResume, parseRawResumeText, getMyResumes } from '../controllers/resumeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', protect, authorize('candidate'), uploadResume.single('resume'), uploadAndParseResume);
router.post('/parse-text', protect, authorize('candidate'), parseRawResumeText);
router.get('/my', protect, authorize('candidate'), getMyResumes);

export default router;
