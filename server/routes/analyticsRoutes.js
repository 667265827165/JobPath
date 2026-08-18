import express from 'express';
import { getCandidateAnalytics, getMarketInsights } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/candidate', protect, getCandidateAnalytics);
router.get('/market-insights', getMarketInsights);

export default router;
