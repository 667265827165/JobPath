import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    banner: {
      type: String,
      default: '',
    },
    tagline: {
      type: String,
      default: 'Innovating for the future of tech',
    },
    description: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      default: 'Software & Technology',
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
      default: '51-200',
    },
    foundedYear: {
      type: Number,
      default: 2018,
    },
    website: {
      type: String,
      default: '',
    },
    headquarters: {
      type: String,
      default: 'Hyderabad, India',
    },
    locations: [
      {
        type: String,
      },
    ],
    benefits: [
      {
        title: String,
        description: String,
        icon: String,
      },
    ],
    culture: [
      {
        title: String,
        description: String,
      },
    ],
    verified: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.6,
    },
    reviewsCount: {
      type: Number,
      default: 142,
    },
  },
  { timestamps: true }
);

CompanySchema.pre('save', function (next) {
  if (this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

export default mongoose.model('Company', CompanySchema);
