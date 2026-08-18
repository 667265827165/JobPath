import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
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
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    department: {
      type: String,
      default: 'Engineering',
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'],
      default: 'Full-time',
    },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'Hybrid',
    },
    experienceMin: {
      type: Number,
      default: 2,
    },
    experienceMax: {
      type: Number,
      default: 5,
    },
    salaryMin: {
      type: Number,
      required: [true, 'Minimum salary is required'],
    },
    salaryMax: {
      type: Number,
      required: [true, 'Maximum salary is required'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      default: 'Hyderabad, India',
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    preferredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    responsibilities: [
      {
        type: String,
      },
    ],
    requirements: [
      {
        type: String,
      },
    ],
    benefits: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'paused', 'closed'],
      default: 'active',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    },
  },
  { timestamps: true }
);

// Search indexes
JobSchema.index({ title: 'text', description: 'text', requiredSkills: 'text', location: 'text' });
JobSchema.index({ status: 1, createdAt: -1 });
JobSchema.index({ location: 1, workMode: 1, jobType: 1 });

export default mongoose.model('Job', JobSchema);
