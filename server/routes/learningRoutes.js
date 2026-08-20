import express from 'express';
import { getYouTubeResources, getCareerRoadmap } from '../controllers/learningController.js';

const router = express.Router();

router.get('/youtube', getYouTubeResources);
router.get('/resources', getYouTubeResources);
router.get('/roadmap/:role', getCareerRoadmap);

export default router;
