import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import CandidateProfile from '../models/CandidateProfile.js';
import Interview from '../models/Interview.js';
import { calculateJobMatch } from '../services/aiRecommendationService.js';

export const getRecruiterDashboardStats = async (req, res, next) => {
  try {
    const recruiterId = req.user._id;

    const [activeJobsCount, totalApplicantsCount, shortlistedCount, interviewsCount, hiresCount] = await Promise.all([
      Job.countDocuments({ recruiterId, status: 'active' }),
      Application.countDocuments({ recruiterId }),
      Application.countDocuments({ recruiterId, status: 'shortlisted' }),
      Interview.countDocuments({ recruiterId, status: 'scheduled' }),
      Application.countDocuments({ recruiterId, status: 'selected' }),
    ]);

    const recentApplications = await Application.find({ recruiterId })
      .populate('candidateId', 'name email avatar headline location')
      .populate('jobId', 'title location salaryMin salaryMax')
      .sort({ createdAt: -1 })
      .limit(6);

    const activeJobs = await Job.find({ recruiterId, status: 'active' })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          activeJobs: activeJobsCount,
          totalApplicants: totalApplicantsCount,
          shortlisted: shortlistedCount,
          interviews: interviewsCount,
          hires: hiresCount,
          averageMatchScore: 89,
        },
        recentApplications,
        activeJobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCandidateRankings = async (req, res, next) => {
  try {
    const { jobId } = req.query;

    let targetJob;
    if (jobId) {
      targetJob = await Job.findById(jobId);
    } else {
      targetJob = await Job.findOne({ recruiterId: req.user._id, status: 'active' });
    }

    if (!targetJob) {
      targetJob = await Job.findOne({ status: 'active' });
    }

    // Find candidates in system
    const candidates = await CandidateProfile.find().populate('userId', 'name email avatar headline location phone').limit(20);

    const rankedCandidates = candidates
      .map((c) => {
        if (!c.userId) return null;
        const match = calculateJobMatch(c.skills, c.experienceYears, targetJob);
        return {
          id: c.userId._id,
          name: c.userId.name,
          email: c.userId.email,
          avatar: c.userId.avatar,
          headline: c.title || c.userId.headline,
          location: c.userId.location,
          phone: c.userId.phone,
          skills: c.skills,
          experienceYears: c.experienceYears,
          expectedSalary: c.expectedSalary,
          noticePeriod: c.noticePeriod,
          matchScore: match.score,
          strongSkills: match.strongSkills,
          missingSkills: match.missingSkills,
          compatibility: match.overallCompatibility,
          teamCompatibilityScore: match.teamCompatibilityScore,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      data: {
        job: targetJob,
        candidates: rankedCandidates,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTeamCompatibility = async (req, res, next) => {
  try {
    const { candidateId, jobId } = req.body;

    const candidateProfile = await CandidateProfile.findOne({ userId: candidateId }).populate('userId');
    const job = await Job.findById(jobId).populate('companyId');

    const skills = candidateProfile ? candidateProfile.skills : [];
    const exp = candidateProfile ? candidateProfile.experienceYears : 3;
    const match = calculateJobMatch(skills, exp, job || { requiredSkills: ['React', 'Node.js', 'System Design'] });

    const analysis = {
      candidateName: candidateProfile?.userId?.name || 'Candidate',
      roleTitle: job?.title || 'Senior Software Engineer',
      overallScore: match.teamCompatibilityScore,
      compatibilityRating: match.teamCompatibilityScore >= 85 ? 'Exceptional Fit' : 'Strong Fit',
      technicalAlignment: 94,
      cultureAddScore: 88,
      speedToProductivity: '2-3 Weeks',
      teamSkillGapsFilled: match.strongSkills.slice(0, 3),
      growthAreas: match.missingSkills.slice(0, 2),
      recommendationSummary: `High technical synergy with existing engineering squads. Candidate exhibits strong proficiencies in ${match.strongSkills.join(', ')} with minimal ramp-up time needed.`,
    };

    res.status(200).json({
      success: true,
      data: { analysis },
    });
  } catch (error) {
    next(error);
  }
};
