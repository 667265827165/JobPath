import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    fileType: {
      type: String,
      default: 'application/pdf',
    },
    rawText: {
      type: String,
      default: '',
    },
    parsedData: {
      extractedSkills: [
        {
          name: String,
          category: String,
          confidence: Number,
        },
      ],
      experienceYears: {
        type: Number,
        default: 0,
      },
      education: [
        {
          degree: String,
          institution: String,
          year: String,
        },
      ],
      experience: [
        {
          role: String,
          company: String,
          duration: String,
          summary: String,
        },
      ],
      projects: [
        {
          name: String,
          techStack: [String],
          description: String,
        },
      ],
      certifications: [String],
      recommendedRoles: [
        {
          role: String,
          matchPercentage: Number,
        },
      ],
      strongAreas: [String],
      skillGaps: [String],
      recommendedImprovements: [String],
      scoreBreakdown: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
      overallResumeScore: {
        type: Number,
        default: 85,
      },
    },
    isDefault: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Resume', ResumeSchema);
