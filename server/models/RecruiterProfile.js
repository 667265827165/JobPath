import mongoose from 'mongoose';

const RecruiterProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    designation: {
      type: String,
      default: 'Technical Talent Acquisition Specialist',
    },
    department: {
      type: String,
      default: 'Human Resources & Engineering Talent',
    },
    contactPhone: {
      type: String,
      default: '',
    },
    hiringPermissions: {
      canPostJobs: { type: Boolean, default: true },
      canScheduleInterviews: { type: Boolean, default: true },
      canExtendOffers: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model('RecruiterProfile', RecruiterProfileSchema);
