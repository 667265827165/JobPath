import { chatWithGemini } from '../services/geminiService.js';
import CandidateProfile from '../models/CandidateProfile.js';

export const handleCopilotChat = async (req, res, next) => {
  try {
    const { message, conversationId, conversationHistory } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid message prompt.',
      });
    }

    let candidateContext = {
      role: 'Full Stack Engineer',
      skills: ['React', 'JavaScript', 'Node.js', 'MongoDB'],
      experienceYears: 2,
    };

    if (req.user) {
      candidateContext.role = req.user.headline || req.user.role || 'Full Stack Engineer';
      const profile = await CandidateProfile.findOne({ userId: req.user._id });
      if (profile) {
        candidateContext.skills = profile.skills || [];
        candidateContext.experienceYears = profile.experienceYears || 2;
        if (profile.expectedSalary?.min) {
          candidateContext.expectedSalary = `${profile.expectedSalary.min / 100000} - ${profile.expectedSalary.max / 100000} LPA`;
        }
      }
    }

    const { reply, source } = await chatWithGemini({
      message,
      conversationHistory: conversationHistory || [],
      candidateContext,
    });

    res.status(200).json({
      success: true,
      data: {
        reply,
        source,
        conversationId: conversationId || `conv_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Co-Pilot chat error:', error);
    res.status(200).json({
      success: true,
      data: {
        reply: 'I encountered a brief telemetry synchronization issue. How can I assist with your target job search, resume scoring, or career roadmap today?',
        source: 'HIREX-Fallback',
      },
    });
  }
};
