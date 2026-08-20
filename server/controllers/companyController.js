import Company from '../models/Company.js';
import Job from '../models/Job.js';
import RecruiterProfile from '../models/RecruiterProfile.js';

export const getCompanies = async (req, res, next) => {
  try {
    const { search, industry, location } = req.query;
    const query = {};

    if (search) {
      query.name = new RegExp(search, 'i');
    }
    if (industry && industry !== 'All') {
      query.industry = industry;
    }
    if (location) {
      query.headquarters = new RegExp(location, 'i');
    }

    const companies = await Company.find(query).sort({ rating: -1 });

    // Attach open positions count
    const companyList = await Promise.all(
      companies.map(async (c) => {
        const openJobsCount = await Job.countDocuments({ companyId: c._id, status: 'active' });
        return {
          ...c.toObject(),
          openJobsCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: { companies: companyList },
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyByIdOrSlug = async (req, res, next) => {
  try {
    const { id } = req.params;
    let company;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      company = await Company.findById(id);
    } else {
      company = await Company.findOne({ slug: id });
    }

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found.',
      });
    }

    const openJobs = await Job.find({ companyId: company._id, status: 'active' });

    res.status(200).json({
      success: true,
      data: {
        company,
        openJobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRecruiterCompanyProfile = async (req, res, next) => {
  try {
    const recruiterProfile = await RecruiterProfile.findOne({ userId: req.user._id }).populate('companyId');

    let company = recruiterProfile?.companyId;
    if (!company) {
      company = await Company.findOne({});
    }

    res.status(200).json({
      success: true,
      data: { company },
    });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateCompany = async (req, res, next) => {
  try {
    const {
      id,
      name,
      tagline,
      description,
      industry,
      companySize,
      foundedYear,
      website,
      headquarters,
      locations,
      benefits,
      culture,
      logo,
      banner,
    } = req.body;

    let company;
    if (id) {
      company = await Company.findByIdAndUpdate(
        id,
        {
          name,
          tagline,
          description,
          industry,
          companySize,
          foundedYear,
          website,
          headquarters,
          locations: Array.isArray(locations) ? locations : [headquarters].filter(Boolean),
          benefits,
          culture,
          logo,
          banner,
        },
        { new: true, runValidators: true }
      );
    } else {
      company = await Company.create({
        name: name || `${req.user.name} Labs`,
        tagline: tagline || 'Scaling high-performance engineering',
        description: description || 'Modern tech product engineering squad.',
        industry: industry || 'Software & Cloud',
        companySize: companySize || '100-500',
        foundedYear: foundedYear || 2021,
        website: website || 'https://technova.io',
        headquarters: headquarters || 'Hyderabad, India',
        locations: Array.isArray(locations) ? locations : [headquarters || 'Hyderabad, India'],
        benefits,
        culture,
        logo: logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        banner,
      });
    }

    // Link company to recruiter profile
    if (req.user && req.user.role === 'recruiter') {
      await RecruiterProfile.findOneAndUpdate(
        { userId: req.user._id },
        { companyId: company._id },
        { upsert: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Company profile saved successfully.',
      data: { company },
    });
  } catch (error) {
    next(error);
  }
};
