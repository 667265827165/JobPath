import express from 'express';
import { getAdminOverview, listAllUsers, deleteUser } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/overview', protect, authorize('admin'), getAdminOverview);
router.get('/users', protect, authorize('admin'), listAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

export default router;
