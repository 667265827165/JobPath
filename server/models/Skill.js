import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Full Stack', 'DevOps & Cloud', 'Data Science & AI', 'Mobile', 'Security', 'Database', 'Architecture', 'Other'],
      default: 'Full Stack',
    },
    demandScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },
    growthRate: {
      type: Number,
      default: 15.4, // percentage
    },
    avgSalaryINR: {
      type: Number,
      default: 1800000,
    },
    trend: {
      type: String,
      enum: ['Rising', 'Stable', 'Declining', 'Hot'],
      default: 'Rising',
    },
    relatedSkills: [String],
  },
  { timestamps: true }
);

export default mongoose.model('Skill', SkillSchema);
