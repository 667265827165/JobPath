import express from 'express';
import {
  getCompanies,
  getCompanyByIdOrSlug,
  createOrUpdateCompany,
  getRecruiterCompanyProfile,
} from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCompanies);
router.get('/my/profile', protect, authorize('recruiter', 'admin'), getRecruiterCompanyProfile);
router.get('/:id', getCompanyByIdOrSlug);
router.post('/', protect, authorize('recruiter', 'admin'), createOrUpdateCompany);

export default router;
