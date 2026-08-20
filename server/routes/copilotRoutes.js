import express from 'express';
import { handleCopilotChat } from '../controllers/copilotController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Copilot Chat endpoints supporting both /api/copilot/chat and /api/ai/copilot
router.post('/chat', optionalAuth, handleCopilotChat);
router.post('/', optionalAuth, handleCopilotChat);

export default router;
