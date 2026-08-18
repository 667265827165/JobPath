import mongoose from 'mongoose';

const CandidateProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    title: {
      type: String,
      default: 'Full Stack Engineer',
    },
    summary: {
      type: String,
      default: '',
    },
    skills: [
      {
        name: { type: String, required: true },
        level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' },
        proficiency: { type: Number, min: 0, max: 100, default: 80 },
        verified: { type: Boolean, default: false },
      },
    ],
    experienceYears: {
      type: Number,
      default: 3,
    },
    experience: [
      {
        title: String,
        company: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        fieldOfStudy: String,
        startYear: String,
        endYear: String,
        grade: String,
      },
    ],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
        link: String,
        github: String,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        issueDate: String,
        credentialUrl: String,
      },
    ],
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
    expectedSalary: {
      min: { type: Number, default: 1200000 },
      max: { type: Number, default: 2000000 },
      currency: { type: String, default: 'INR' },
    },
    noticePeriod: {
      type: String,
      enum: ['Immediate', '15 Days', '30 Days', '60 Days', '90 Days'],
      default: '30 Days',
    },
    preferredLocations: [{ type: String }],
    preferredWorkModes: [{ type: String, enum: ['Remote', 'Hybrid', 'On-site'] }],
    preferredJobTypes: [{ type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'] }],
    profileCompletionPercentage: {
      type: Number,
      default: 85,
    },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('CandidateProfile', CandidateProfileSchema);
