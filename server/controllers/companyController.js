import Company from '../models/Company.js';
import Job from '../models/Job.js';

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

export const createOrUpdateCompany = async (req, res, next) => {
  try {
    const { id, name, tagline, description, industry, companySize, foundedYear, website, headquarters, locations, benefits, culture, logo, banner } = req.body;

    let company;
    if (id) {
      company = await Company.findByIdAndUpdate(
        id,
        { name, tagline, description, industry, companySize, foundedYear, website, headquarters, locations, benefits, culture, logo, banner },
        { new: true, runValidators: true }
      );
    } else {
      company = await Company.create({
        name,
        tagline,
        description,
        industry,
        companySize,
        foundedYear,
        website,
        headquarters,
        locations: Array.isArray(locations) ? locations : [headquarters],
        benefits,
        culture,
        logo,
        banner,
      });
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
