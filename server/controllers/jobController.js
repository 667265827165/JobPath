import Job from '../models/Job.js';
import Company from '../models/Company.js';
import SavedJob from '../models/SavedJob.js';
import CandidateProfile from '../models/CandidateProfile.js';
import { calculateJobMatch } from '../services/aiRecommendationService.js';

export const getJobs = async (req, res, next) => {
  try {
    const {
      search,
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

    const query = { status: 'active' };

    // Keyword Search
    if (search) {
      const searchRegex = new RegExp(search, 'i');
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
      if (experience === '0-2 Years') {
        query.experienceMin = { $lte: 2 };
      } else if (experience === '3-5 Years') {
        query.experienceMin = { $lte: 5 };
        query.experienceMax = { $gte: 3 };
      } else if (experience === '6-10 Years') {
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
      const skillArray = skills.split(',').map((s) => s.trim());
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
      .populate('companyId', 'name logo tagline industry headquarters rating rating reviewsCount')
      .populate('recruiterId', 'name email avatar headline')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // If user is candidate, compute live AI match percentage
    let candidateSkills = [];
    let candidateExp = 3;
    let savedJobIds = new Set();

    if (req.user && req.user.role === 'candidate') {
      const profile = await CandidateProfile.findOne({ userId: req.user._id });
      if (profile) {
        candidateSkills = profile.skills || [];
        candidateExp = profile.experienceYears || 3;
      }
      const saved = await SavedJob.find({ candidateId: req.user._id });
      savedJobIds = new Set(saved.map((s) => s.jobId.toString()));
    }

    const jobsWithScores = jobs.map((j) => {
      const match = calculateJobMatch(candidateSkills, candidateExp, j);
      return {
        ...j.toObject(),
        matchScore: match.score,
        matchBreakdown: match,
        isSaved: savedJobIds.has(j._id.toString()),
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
    job.viewsCount += 1;
    await job.save();

    let candidateSkills = [];
    let candidateExp = 3;
    let isSaved = false;

    if (req.user && req.user.role === 'candidate') {
      const profile = await CandidateProfile.findOne({ userId: req.user._id });
      if (profile) {
        candidateSkills = profile.skills || [];
        candidateExp = profile.experienceYears || 3;
      }
      const saved = await SavedJob.findOne({ candidateId: req.user._id, jobId: job._id });
      isSaved = !!saved;
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
      const company = await Company.findOne({});
      companyId = company ? company._id : null;
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
      description: description && description.trim().length >= 20
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
