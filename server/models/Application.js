import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
    coverLetter: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['applied', 'under_review', 'shortlisted', 'interview', 'selected', 'rejected'],
      default: 'applied',
    },
    matchScore: {
      type: Number,
      default: 85,
    },
    matchBreakdown: {
      strongSkills: [{ type: String }],
      missingSkills: [{ type: String }],
      experienceMatch: { type: Boolean, default: true },
      overallCompatibility: { type: String, default: 'Strong Match' },
      teamCompatibilityScore: { type: Number, default: 88 },
    },
    timeline: [
      {
        status: { type: String },
        updatedAt: { type: Date, default: Date.now },
        note: { type: String },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    recruiterNotes: {
      type: String,
      default: '',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
ApplicationSchema.index({ recruiterId: 1, status: 1 });
ApplicationSchema.index({ candidateId: 1, status: 1 });

export default mongoose.model('Application', ApplicationSchema);
