import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
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
    title: {
      type: String,
      required: true,
      default: 'Technical Assessment & Architecture Round',
    },
    round: {
      type: String,
      default: 'Technical Round 1',
    },
    interviewType: {
      type: String,
      enum: ['online', 'in_person', 'phone'],
      default: 'online',
    },
    scheduledDate: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 45,
    },
    meetingLink: {
      type: String,
      default: 'https://meet.google.com/hrc-flow-tech',
    },
    instructions: {
      type: String,
      default: 'Please ensure a quiet environment, stable internet connection, and your IDE ready for live pair programming.',
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'rescheduled', 'cancelled'],
      default: 'scheduled',
    },
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      strengths: [String],
      weaknesses: [String],
      recommendation: { type: String, enum: ['Strong Hire', 'Hire', 'Hold', 'Reject'] },
      notes: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Interview', InterviewSchema);
