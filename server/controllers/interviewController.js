import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import CandidateProfile from '../models/CandidateProfile.js';
import { generateInterviewAssessment, evaluateInterviewSubmission } from '../services/interviewAgentService.js';
import { calculateJobMatch } from '../services/aiRecommendationService.js';

export const getInterviewAssessment = async (req, res, next) => {
  try {
    const { role = 'Full Stack Engineer' } = req.query;
    const assessment = generateInterviewAssessment(role);
    res.status(200).json({
      success: true,
      data: { assessment },
    });
  } catch (error) {
    next(error);
  }
};

export const submitInterviewAssessment = async (req, res, next) => {
  try {
    const { answers, tabSwitches, elapsedSeconds } = req.body;
    const evaluation = evaluateInterviewSubmission(answers, tabSwitches, elapsedSeconds);

    // Save notification
    await Notification.create({
      recipientId: req.user._id,
      type: 'interview_assessment_completed',
      title: '🎯 AI Technical Assessment Evaluated',
      message: `Your technical evaluation score is ${evaluation.interviewScore}/100. Check your detailed diagnostics.`,
      link: '/candidate/interviews',
    });

    res.status(200).json({
      success: true,
      message: 'Assessment evaluated successfully by AI Interview Agent.',
      data: { evaluation },
    });
  } catch (error) {
    next(error);
  }
};

export const scheduleInterview = async (req, res, next) => {
  try {
    const {
      applicationId,
      candidateId,
      jobId,
      title,
      round,
      interviewType,
      scheduledDate,
      startTime,
      durationMinutes,
      meetingLink,
      instructions,
    } = req.body;

    let targetApplication = null;

    if (applicationId) {
      targetApplication = await Application.findById(applicationId).populate('jobId').populate('companyId');
    } else if (candidateId && jobId) {
      targetApplication = await Application.findOne({ candidateId, jobId }).populate('jobId').populate('companyId');

      if (!targetApplication) {
        // Automatically scaffold application when recruiter initiates interview from discovery pool
        const job = await Job.findById(jobId).populate('companyId');
        if (!job) {
          return res.status(404).json({ success: false, message: 'Job not found.' });
        }
        const profile = await CandidateProfile.findOne({ userId: candidateId });
        const match = calculateJobMatch(profile?.skills || [], profile?.experienceYears || 3, job);

        targetApplication = await Application.create({
          jobId,
          candidateId,
          recruiterId: req.user._id,
          companyId: job.companyId._id,
          matchScore: match.score,
          matchBreakdown: match,
          status: 'interview',
          timeline: [
            {
              status: 'interview',
              updatedAt: new Date(),
              note: `Direct interview invite by ${req.user.name}`,
              updatedBy: req.user._id,
            },
          ],
        });
        targetApplication = await Application.findById(targetApplication._id).populate('jobId').populate('companyId');
      }
    }

    if (!targetApplication) {
      return res.status(404).json({
        success: false,
        message: 'Could not find or create application for interview scheduling.',
      });
    }

    const interview = await Interview.create({
      applicationId: targetApplication._id,
      jobId: targetApplication.jobId._id,
      candidateId: targetApplication.candidateId,
      recruiterId: req.user._id,
      companyId: targetApplication.companyId._id,
      title: title || `Interview for ${targetApplication.jobId.title}`,
      round: round || 'Technical Round',
      interviewType: interviewType || 'online',
      scheduledDate: scheduledDate || 'Upcoming',
      startTime: startTime || '16:00 IST',
      durationMinutes: durationMinutes || 45,
      meetingLink: meetingLink || 'https://meet.google.com/hrc-flow-tech',
      instructions: instructions || 'Please join 5 minutes early with working audio/video.',
      status: 'scheduled',
    });

    // Update application status to 'interview'
    targetApplication.status = 'interview';
    targetApplication.timeline.push({
      status: 'interview',
      updatedAt: new Date(),
      note: `Interview scheduled on ${scheduledDate || 'Upcoming'} (${round || 'Technical Round'})`,
      updatedBy: req.user._id,
    });
    await targetApplication.save();

    // Create Notification for candidate
    await Notification.create({
      recipientId: targetApplication.candidateId,
      senderId: req.user._id,
      type: 'interview_scheduled',
      title: `📅 Interview Scheduled: ${round || 'Technical Round'}`,
      message: `You have an upcoming ${round || 'Technical Round'} with ${targetApplication.companyId.name} on ${scheduledDate || 'the scheduled date'}.`,
      link: '/candidate/interviews',
    });

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully and invitation dispatched.',
      data: { interview },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyInterviews = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role === 'candidate') {
      query.candidateId = req.user._id;
    } else if (req.user.role === 'recruiter') {
      query.recruiterId = req.user._id;
    }

    const interviews = await Interview.find(query)
      .populate('jobId', 'title location workMode department salaryMin salaryMax')
      .populate('companyId', 'name logo headquarters')
      .populate('candidateId', 'name email avatar headline phone')
      .populate('recruiterId', 'name email avatar headline')
      .sort({ scheduledDate: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      data: { interviews },
    });
  } catch (error) {
    next(error);
  }
};

export const updateInterviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, scheduledDate, startTime, feedback } = req.body;

    const interview = await Interview.findById(id).populate('companyId').populate('jobId');
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found.',
      });
    }

    if (status) interview.status = status;
    if (scheduledDate) interview.scheduledDate = scheduledDate;
    if (startTime) interview.startTime = startTime;
    if (feedback) interview.feedback = feedback;

    await interview.save();

    // Notify candidate if rescheduled or completed
    if (status === 'rescheduled') {
      await Notification.create({
        recipientId: interview.candidateId,
        senderId: req.user._id,
        type: 'interview_rescheduled',
        title: 'Interview Rescheduled',
        message: `Your interview for ${interview.jobId.title} has been moved to ${scheduledDate} at ${startTime}.`,
        link: '/candidate/interviews',
      });
    }

    res.status(200).json({
      success: true,
      message: `Interview ${status} successfully.`,
      data: { interview },
    });
  } catch (error) {
    next(error);
  }
};
