import User from '../models/User.js';
import Job from '../models/Job.js';
import Company from '../models/Company.js';
import Application from '../models/Application.js';

export const getAdminOverview = async (req, res, next) => {
  try {
    const [totalUsers, candidatesCount, recruitersCount, activeJobsCount, totalCompanies, applicationsCount] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'candidate' }),
      User.countDocuments({ role: 'recruiter' }),
      Job.countDocuments({ status: 'active' }),
      Company.countDocuments(),
      Application.countDocuments(),
    ]);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(8);
    const recentJobs = await Job.find().populate('companyId').sort({ createdAt: -1 }).limit(6);

    const platformMonthlyMetrics = [
      { month: 'Jan', candidates: 4200, applications: 12400, hires: 840 },
      { month: 'Feb', candidates: 5800, applications: 18200, hires: 1120 },
      { month: 'Mar', candidates: 7400, applications: 24500, hires: 1680 },
      { month: 'Apr', candidates: 9200, applications: 31000, hires: 2150 },
      { month: 'May', candidates: 12400, applications: 42000, hires: 2900 },
      { month: 'Jun', candidates: 16800, applications: 54000, hires: 3850 },
    ];

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          candidates: candidatesCount,
          recruiters: recruitersCount,
          activeJobs: activeJobsCount,
          companies: totalCompanies,
          totalApplications: applicationsCount,
          matchAccuracyRate: '96.2%',
        },
        recentUsers,
        recentJobs,
        platformMonthlyMetrics,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const listAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const query = {};
    if (role && role !== 'all') query.role = role;
    if (search) {
      query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'User removed successfully by admin.',
    });
  } catch (error) {
    next(error);
  }
};
