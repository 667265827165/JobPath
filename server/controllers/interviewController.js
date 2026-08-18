import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import { generateInterviewAssessment, evaluateInterviewSubmission } from '../services/interviewAgentService.js';

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
    const { applicationId, title, round, interviewType, scheduledDate, startTime, durationMinutes, meetingLink, instructions } = req.body;

    const application = await Application.findById(applicationId).populate('jobId').populate('companyId');
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    const interview = await Interview.create({
      applicationId,
      jobId: application.jobId._id,
      candidateId: application.candidateId,
      recruiterId: req.user._id,
      companyId: application.companyId._id,
      title: title || `Interview for ${application.jobId.title}`,
      round: round || 'Technical Round',
      interviewType: interviewType || 'online',
      scheduledDate,
      startTime,
      durationMinutes: durationMinutes || 45,
      meetingLink: meetingLink || 'https://meet.google.com/hrc-flow-tech',
      instructions: instructions || 'Please join 5 minutes early with working audio/video.',
      status: 'scheduled',
    });

    // Update application status to 'interview'
    application.status = 'interview';
    application.timeline.push({
      status: 'interview',
      updatedAt: new Date(),
      note: `Interview scheduled on ${scheduledDate} at ${startTime} (${round})`,
      updatedBy: req.user._id,
    });
    await application.save();

    // Create Notification for candidate
    await Notification.create({
      recipientId: application.candidateId,
      senderId: req.user._id,
      type: 'interview_scheduled',
      title: `📅 Interview Scheduled: ${round}`,
      message: `You have an upcoming ${round} with ${application.companyId.name} on ${scheduledDate} at ${startTime}.`,
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
