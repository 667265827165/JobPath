import express from 'express';
import { getCompanies, getCompanyByIdOrSlug, createOrUpdateCompany } from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCompanies);
router.get('/:id', getCompanyByIdOrSlug);
router.post('/', protect, authorize('recruiter', 'admin'), createOrUpdateCompany);

export default router;
