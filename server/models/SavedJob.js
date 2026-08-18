import mongoose from 'mongoose';

const SavedJobSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

SavedJobSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

export default mongoose.model('SavedJob', SavedJobSchema);
