import Job from '../models/Job.js';
import Company from '../models/Company.js';
import SavedJob from '../models/SavedJob.js';
import Application from '../models/Application.js';
import CandidateProfile from '../models/CandidateProfile.js';
import { calculateJobMatch } from '../services/aiRecommendationService.js';

export const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      keyword,
      location,
      workMode,
      jobType,
      experience,
      minSalary,
      maxSalary,
      skills,
      industry,
      company,
      sort = 'latest',
      page = 1,
      limit = 12,
    } = req.query;

    const searchTerm = search || keyword;
    const query = { status: 'active' };

    // Keyword Search
    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { requiredSkills: { $in: [searchRegex] } },
        { location: searchRegex },
      ];
    }

    // Location Filter
    if (location && location !== 'All Locations') {
      query.location = new RegExp(location, 'i');
    }

    // Work Mode Filter
    if (workMode && workMode !== 'All Modes') {
      query.workMode = workMode;
    }

    // Job Type Filter
    if (jobType && jobType !== 'All Types') {
      query.jobType = jobType;
    }

    // Experience Filter
    if (experience && experience !== 'All Experience') {
      if (experience === '0-2 Years' || experience === '0') {
        query.experienceMin = { $lte: 2 };
      } else if (experience === '3-5 Years' || experience === '3') {
        query.experienceMin = { $lte: 5 };
        query.experienceMax = { $gte: 3 };
      } else if (experience === '6-10 Years' || experience === '6') {
        query.experienceMin = { $lte: 10 };
        query.experienceMax = { $gte: 6 };
      } else if (experience === '10+ Years') {
        query.experienceMin = { $gte: 8 };
      }
    }

    // Salary Filters
    if (minSalary) {
      query.salaryMax = { $gte: Number(minSalary) };
    }
    if (maxSalary) {
      query.salaryMin = { $lte: Number(maxSalary) };
    }

    // Skills Filter
    if (skills) {
      const skillArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
      query.requiredSkills = { $in: skillArray.map((s) => new RegExp(s, 'i')) };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'salary_high') {
      sortOption = { salaryMax: -1 };
    } else if (sort === 'salary_low') {
      sortOption = { salaryMin: 1 };
    } else if (sort === 'popular') {
      sortOption = { viewsCount: -1, applicationsCount: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('companyId', 'name logo tagline industry headquarters rating reviewsCount verified')
      .populate('recruiterId', 'name email avatar headline')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // If user is candidate, compute live AI match percentage and applied/saved states
    let candidateProfile = null;
    let savedJobIds = new Set();
    let appliedJobIds = new Set();

    if (req.user && req.user.role === 'candidate') {
      candidateProfile = await CandidateProfile.findOne({ userId: req.user._id });
      const [saved, applied] = await Promise.all([
        SavedJob.find({ candidateId: req.user._id }),
        Application.find({ candidateId: req.user._id }),
      ]);
      savedJobIds = new Set(saved.map((s) => s.jobId.toString()));
      appliedJobIds = new Set(applied.map((a) => a.jobId.toString()));
    }

    const candidateSkills = candidateProfile?.skills || ['React', 'JavaScript', 'Node.js', 'MongoDB'];
    const candidateExp = candidateProfile?.experienceYears || 3;
    const expectedSalary = candidateProfile?.expectedSalary?.min || 1200000;

    const jobsWithScores = jobs.map((j) => {
      const match = calculateJobMatch(candidateSkills, candidateExp, j);
      
      // Compute package match percentage against expected salary
      let packageScore = 85;
      let packageLabel = 'Competitive';
      if (j.salaryMax >= expectedSalary && j.salaryMin <= expectedSalary) {
        packageScore = 95;
        packageLabel = 'Excellent Match';
      } else if (j.salaryMin > expectedSalary) {
        packageScore = 98;
        packageLabel = 'Above Expectation';
      } else {
        const ratio = ((j.salaryMin + j.salaryMax) / 2) / expectedSalary;
        packageScore = Math.max(30, Math.round(ratio * 75));
        packageLabel = packageScore >= 70 ? 'Moderate Match' : 'Package Mismatch';
      }

      // Compute coordinate latitude and longitude for map
      let lat = 17.385;
      let lng = 78.4867;
      const locLower = (j.location || '').toLowerCase();
      if (locLower.includes('bangalore') || locLower.includes('bengaluru')) {
        lat = 12.9716;
        lng = 77.5946;
      } else if (locLower.includes('pune')) {
        lat = 18.5204;
        lng = 73.8567;
      } else if (locLower.includes('gurgaon') || locLower.includes('delhi')) {
        lat = 28.4595;
        lng = 77.0266;
      } else if (locLower.includes('chennai')) {
        lat = 13.0827;
        lng = 80.2707;
      } else if (locLower.includes('mumbai')) {
        lat = 19.076;
        lng = 72.8777;
      }

      return {
        ...j.toObject(),
        latitude: lat,
        longitude: lng,
        matchScore: match.score,
        matchBreakdown: {
          ...match,
          packageScore,
          packageLabel,
        },
        isSaved: savedJobIds.has(j._id.toString()),
        hasApplied: appliedJobIds.has(j._id.toString()),
      };
    });

    res.status(200).json({
      success: true,
      data: {
        jobs: jobsWithScores,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const searchAggregatedJobs = async (req, res, next) => {
  try {
    const { jobAggregationService } = await import('../services/jobAggregationService.js');
    let candidateProfile = null;
    if (req.user) {
      candidateProfile = await CandidateProfile.findOne({ userId: req.user._id });
    }

    const results = await jobAggregationService.searchJobs(req.query, candidateProfile);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobProviders = async (req, res, next) => {
  try {
    const { jobAggregationService } = await import('../services/jobAggregationService.js');
    res.status(200).json({
      success: true,
      data: {
        providers: jobAggregationService.getProvidersStatus(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('companyId')
      .populate('recruiterId', 'name email avatar headline');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job vacancy not found.',
      });
    }

    // Increment view count
    job.viewsCount = (job.viewsCount || 0) + 1;
    await job.save();

    let candidateSkills = [];
    let candidateExp = 3;
    let isSaved = false;
    let hasApplied = false;

    if (req.user && req.user.role === 'candidate') {
      const profile = await CandidateProfile.findOne({ userId: req.user._id });
      if (profile) {
        candidateSkills = profile.skills || [];
        candidateExp = profile.experienceYears || 3;
      }
      const [saved, applied] = await Promise.all([
        SavedJob.findOne({ candidateId: req.user._id, jobId: job._id }),
        Application.findOne({ candidateId: req.user._id, jobId: job._id }),
      ]);
      isSaved = !!saved;
      hasApplied = !!applied;
    }

    const match = calculateJobMatch(candidateSkills, candidateExp, job);

    const similarJobs = await Job.find({
      _id: { $ne: job._id },
      department: job.department,
      status: 'active',
    })
      .populate('companyId', 'name logo headquarters')
      .limit(3);

    res.status(200).json({
      success: true,
      data: {
        job: {
          ...job.toObject(),
          matchScore: match.score,
          matchBreakdown: match,
          isSaved,
          hasApplied,
        },
        similarJobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      department,
      jobType,
      workMode,
      experienceMin,
      experienceMax,
      salaryMin,
      salaryMax,
      currency,
      location,
      requiredSkills,
      preferredSkills,
      description,
      responsibilities,
      requirements,
      benefits,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid job title.',
      });
    }

    const minSal = Number(salaryMin) || 0;
    const maxSal = Number(salaryMax) || 0;

    if (minSal < 0 || maxSal < 0) {
      return res.status(400).json({
        success: false,
        message: 'Salary amounts cannot be negative.',
      });
    }

    if (maxSal > 0 && maxSal < minSal) {
      return res.status(400).json({
        success: false,
        message: 'Maximum salary must be greater than or equal to minimum salary.',
      });
    }

    const parsedSkills = Array.isArray(requiredSkills)
      ? requiredSkills.filter(Boolean)
      : (requiredSkills || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

    if (parsedSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one required skill for the position.',
      });
    }

    // Get recruiter's company
    const recruiterUser = req.user;
    let companyId = req.body.companyId;

    if (!companyId) {
      const recruiterProfile = await import('../models/RecruiterProfile.js').then((m) =>
        m.default.findOne({ userId: recruiterUser._id })
      );
      if (recruiterProfile && recruiterProfile.companyId) {
        companyId = recruiterProfile.companyId;
      } else {
        const company = await Company.findOne({});
        companyId = company ? company._id : null;
      }
    }

    const job = await Job.create({
      recruiterId: recruiterUser._id,
      companyId,
      title: title.trim(),
      department: department || 'Engineering',
      jobType: jobType || 'Full-time',
      workMode: workMode || 'Hybrid',
      experienceMin: Number(experienceMin) || 0,
      experienceMax: Number(experienceMax) || 5,
      salaryMin: minSal || 1200000,
      salaryMax: maxSal || 2400000,
      currency: currency || 'INR',
      location: location || 'Hyderabad, India',
      requiredSkills: parsedSkills,
      preferredSkills: Array.isArray(preferredSkills)
        ? preferredSkills.filter(Boolean)
        : (preferredSkills || '').split(',').map((s) => s.trim()).filter(Boolean),
      description:
        description && description.trim().length >= 20
          ? description.trim()
          : 'Exciting growth opportunity to build high-scale modern engineering applications with an exceptional engineering team.',
      responsibilities: Array.isArray(responsibilities)
        ? responsibilities.filter(Boolean)
        : (responsibilities || '').split('\n').filter(Boolean),
      requirements: Array.isArray(requirements)
        ? requirements.filter(Boolean)
        : (requirements || '').split('\n').filter(Boolean),
      benefits: Array.isArray(benefits)
        ? benefits.filter(Boolean)
        : (benefits || '').split('\n').filter(Boolean),
    });

    const populatedJob = await Job.findById(job._id).populate('companyId');

    res.status(201).json({
      success: true,
      message: 'Job vacancy published successfully.',
      data: { job: populatedJob },
    });
  } catch (error) {
    next(error);
  }
};

export const getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id })
      .populate('companyId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { jobs },
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job vacancy not found.',
      });
    }

    // Recruiter can only update their own job unless admin
    if (req.user.role !== 'admin' && job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this job posting.',
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('companyId');

    res.status(200).json({
      success: true,
      message: 'Job posting updated successfully.',
      data: { job: updatedJob },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job vacancy not found.',
      });
    }

    if (req.user.role !== 'admin' && job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job posting.',
      });
    }

    await Job.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Job vacancy deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const toggleSaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    const candidateId = req.user._id;

    const existing = await SavedJob.findOne({ candidateId, jobId });
    if (existing) {
      await SavedJob.findByIdAndDelete(existing._id);
      return res.status(200).json({
        success: true,
        message: 'Job removed from saved list.',
        data: { isSaved: false },
      });
    }

    await SavedJob.create({ candidateId, jobId });
    res.status(201).json({
      success: true,
      message: 'Job saved to your bookmarks.',
      data: { isSaved: true },
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedJobs = async (req, res, next) => {
  try {
    const saved = await SavedJob.find({ candidateId: req.user._id }).populate({
      path: 'jobId',
      populate: { path: 'companyId' },
    });

    const jobs = saved.map((s) => s.jobId).filter(Boolean);

    res.status(200).json({
      success: true,
      data: { jobs },
    });
  } catch (error) {
    next(error);
  }
};
