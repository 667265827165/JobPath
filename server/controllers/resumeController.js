import path from 'path';
import Resume from '../models/Resume.js';
import CandidateProfile from '../models/CandidateProfile.js';
import { parseResumeFile, analyzeResumeText } from '../services/resumeParserService.js';

export const uploadAndParseResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a valid professional resume in PDF/DOC/DOCX format. No score generated.',
      });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileUrl = `/uploads/${req.file.filename}`;

    // Perform AI analysis with zero-bias & explainable scoring
    const parsedData = await parseResumeFile(filePath, req.file.mimetype);

    // Save resume in MongoDB
    const resume = await Resume.create({
      candidateId: req.user._id,
      fileName,
      fileUrl,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      rawText: parsedData.rawText,
      parsedData,
      isDefault: true,
    });

    // Update candidate profile with extracted skills & experience
    const mappedSkills = parsedData.extractedSkills.map((s) => ({
      name: s.name,
      level: s.confidence > 90 ? 'Advanced' : 'Intermediate',
      proficiency: s.confidence,
      verified: true,
    }));

    await CandidateProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        resumeId: resume._id,
        skills: mappedSkills,
        experienceYears: parsedData.experienceYears,
        profileCompletionPercentage: 95,
      },
      { upsert: true }
    );

    res.status(201).json({
      success: true,
      message: 'Resume parsed & candidate profile upgraded successfully with Explainable AI analysis.',
      data: {
        resume,
        parsedData,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Unable to process resume file. Please upload a valid document.',
    });
  }
};

export const parseRawResumeText = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid resume text to parse.',
      });
    }

    const parsedData = analyzeResumeText(text);

    // Save text-based resume
    const resume = await Resume.create({
      candidateId: req.user._id,
      fileName: 'Pasted_Resume_Text.txt',
      fileUrl: '#',
      fileSize: Buffer.byteLength(text, 'utf8'),
      fileType: 'text/plain',
      rawText: text,
      parsedData,
      isDefault: true,
    });

    const mappedSkills = parsedData.extractedSkills.map((s) => ({
      name: s.name,
      level: s.confidence > 90 ? 'Advanced' : 'Intermediate',
      proficiency: s.confidence,
      verified: true,
    }));

    await CandidateProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        resumeId: resume._id,
        skills: mappedSkills,
        experienceYears: parsedData.experienceYears,
        profileCompletionPercentage: 95,
      },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'AI Resume text analyzed successfully.',
      data: { resume, parsedData },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ candidateId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: { resumes },
    });
  } catch (error) {
    next(error);
  }
};
