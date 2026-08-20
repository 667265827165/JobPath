import { JobProvider } from './JobProvider.js';
import Job from '../../models/Job.js';

export class DatabaseJobProvider extends JobProvider {
  constructor() {
    super('HIREX-Internal');
  }

  isConfigured() {
    return true;
  }

  async searchJobs(query = {}) {
    try {
      const { keyword, location, experience, role, remote, page = 1, limit = 20 } = query;
      const mongoQuery = { status: 'active' };

      if (keyword) {
        mongoQuery.$or = [
          { title: { $regex: keyword, $options: 'i' } },
          { requiredSkills: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ];
      }

      if (location) {
        mongoQuery.location = { $regex: location, $options: 'i' };
      }

      if (role) {
        mongoQuery.title = { $regex: role, $options: 'i' };
      }

      if (remote === 'true' || remote === true) {
        mongoQuery.workMode = 'Remote';
      }

      if (experience !== undefined && experience !== '') {
        const expNum = Number(experience);
        mongoQuery.experienceMin = { $lte: expNum };
      }

      const skip = (Number(page) - 1) * Number(limit);
      const [jobs, total] = await Promise.all([
        Job.find(mongoQuery)
          .populate('companyId', 'name logo rating headquarters locations')
          .populate('recruiterId', 'name email avatar')
          .sort({ featured: -1, createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),
        Job.countDocuments(mongoQuery),
      ]);

      const normalized = jobs.map((j) => {
        // Map locations to approximate coordinates in India
        let lat = 17.385;
        let lng = 78.4867;
        const locLower = (j.location || '').toLowerCase();
        if (locLower.includes('bangalore') || locLower.includes('bengaluru')) {
          lat = 12.9716;
          lng = 77.5946;
        } else if (locLower.includes('pune')) {
          lat = 18.5204;
          lng = 73.8567;
        } else if (locLower.includes('gurgaon') || locLower.includes('delhi')) {
          lat = 28.4595;
          lng = 77.0266;
        } else if (locLower.includes('chennai')) {
          lat = 13.0827;
          lng = 80.2707;
        } else if (locLower.includes('mumbai')) {
          lat = 19.076;
          lng = 72.8777;
        }

        return {
          id: j._id,
          _id: j._id,
          title: j.title,
          company: j.companyId?.name || 'TechNova Labs',
          companyDetails: j.companyId,
          recruiter: j.recruiterId,
          location: j.location,
          department: j.department,
          description: j.description,
          responsibilities: j.responsibilities,
          requirements: j.requirements,
          benefits: j.benefits,
          skills: j.requiredSkills || [],
          preferredSkills: j.preferredSkills || [],
          experienceMin: j.experienceMin,
          experienceMax: j.experienceMax,
          salaryMin: j.salaryMin,
          salaryMax: j.salaryMax,
          currency: j.currency || 'INR',
          jobType: j.jobType,
          workMode: j.workMode,
          remote: j.workMode === 'Remote',
          featured: !!j.featured,
          latitude: lat,
          longitude: lng,
          source: this.name,
          sourceUrl: `/jobs/${j._id}`,
          postedAt: j.createdAt,
        };
      });

      return {
        jobs: normalized,
        total,
        source: this.name,
        configured: true,
      };
    } catch (error) {
      console.error('[Jobs] Database Provider Error:', error.message);
      return {
        jobs: [],
        total: 0,
        source: this.name,
        error: error.message,
      };
    }
  }
}
