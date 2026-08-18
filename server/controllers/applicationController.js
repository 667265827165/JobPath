import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import CandidateProfile from '../models/CandidateProfile.js';
import { calculateJobMatch } from '../services/aiRecommendationService.js';

export const applyForJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter, resumeId } = req.body;
    const candidateId = req.user._id;

    const job = await Job.findById(jobId).populate('companyId');
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job vacancy not found.',
      });
    }

    const existingApp = await Application.findOne({ jobId, candidateId });
    if (existingApp) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this vacancy.',
      });
    }

    // Calculate AI match score
    const candidateProfile = await CandidateProfile.findOne({ userId: candidateId });
    const skills = candidateProfile ? candidateProfile.skills : [];
    const exp = candidateProfile ? candidateProfile.experienceYears : 2;
    const match = calculateJobMatch(skills, exp, job);

    const application = await Application.create({
      jobId,
      candidateId,
      recruiterId: job.recruiterId,
      companyId: job.companyId._id,
      resumeId: resumeId || (candidateProfile ? candidateProfile.resumeId : null),
      coverLetter: coverLetter || '',
      matchScore: match.score,
      matchBreakdown: match,
      status: 'applied',
      timeline: [
        {
          status: 'applied',
          updatedAt: new Date(),
          note: 'Application successfully submitted by candidate.',
          updatedBy: candidateId,
        },
      ],
    });

    // Update job application count
    job.applicationsCount += 1;
    await job.save();

    // Create Notification for Recruiter
    await Notification.create({
      recipientId: job.recruiterId,
      senderId: candidateId,
      type: 'candidate_applied',
      title: 'New Candidate Application Received',
      message: `${req.user.name} applied for "${job.title}" with a ${match.score}% AI Match score.`,
      link: `/recruiter/applications`,
    });

    // Create Confirmation Notification for Candidate
    await Notification.create({
      recipientId: candidateId,
      type: 'application_submitted',
      title: 'Application Submitted Successfully',
      message: `Your application for ${job.title} at ${job.companyId.name} has been received.`,
      link: `/candidate/applications`,
    });

    const populatedApp = await Application.findById(application._id)
      .populate('jobId')
      .populate('companyId');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: { application: populatedApp },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidateId: req.user._id })
      .populate({
        path: 'jobId',
        populate: { path: 'companyId' },
      })
      .populate('companyId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { applications },
    });
  } catch (error) {
    next(error);
  }
};

export const getJobApplicants = async (req, res, next) => {
  try {
    const { jobId, status, minMatch } = req.query;
    const query = {};

    if (jobId) query.jobId = jobId;
    if (status && status !== 'all') query.status = status;
    if (minMatch) query.matchScore = { $gte: Number(minMatch) };

    // Recruiter can view applications assigned to them or their company
    if (req.user.role === 'recruiter') {
      query.recruiterId = req.user._id;
    }

    const applications = await Application.find(query)
      .populate('candidateId', 'name email avatar headline phone location')
      .populate('jobId', 'title department location salaryMin salaryMax requiredSkills')
      .populate('companyId', 'name logo')
      .populate('resumeId')
      .sort({ matchScore: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { applications },
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note, recruiterNotes } = req.body;

    const validStatuses = ['applied', 'under_review', 'shortlisted', 'interview', 'selected', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application status provided.',
      });
    }

    const application = await Application.findById(id).populate('jobId').populate('companyId');
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    application.status = status;
    if (recruiterNotes) {
      application.recruiterNotes = recruiterNotes;
    }

    application.timeline.push({
      status,
      updatedAt: new Date(),
      note: note || `Status updated to ${status.replace('_', ' ').toUpperCase()}`,
      updatedBy: req.user._id,
    });

    await application.save();

    // Notify Candidate of status change
    let notificationTitle = 'Application Status Updated';
    let notificationType = 'application_submitted';

    if (status === 'shortlisted') {
      notificationTitle = '🎉 Congratulations! You have been shortlisted';
      notificationType = 'application_shortlisted';
    } else if (status === 'interview') {
      notificationTitle = '📅 Interview Invitation for ' + application.jobId.title;
      notificationType = 'interview_scheduled';
    } else if (status === 'selected') {
      notificationTitle = '🏆 Offer Extended from ' + application.companyId.name;
    } else if (status === 'rejected') {
      notificationTitle = 'Application Update for ' + application.jobId.title;
      notificationType = 'application_rejected';
    }

    await Notification.create({
      recipientId: application.candidateId,
      senderId: req.user._id,
      type: notificationType,
      title: notificationTitle,
      message: note || `Your application status for "${application.jobId.title}" at ${application.companyId.name} is now: ${status.replace('_', ' ').toUpperCase()}.`,
      link: '/candidate/applications',
    });

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}.`,
      data: { application },
    });
  } catch (error) {
    next(error);
  }
};
