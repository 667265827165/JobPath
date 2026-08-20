import { NaukriProvider } from './jobProviders/NaukriProvider.js';
import { AdzunaProvider } from './jobProviders/AdzunaProvider.js';
import { JSearchProvider } from './jobProviders/JSearchProvider.js';
import { DatabaseJobProvider } from './jobProviders/DatabaseJobProvider.js';

class JobAggregationService {
  constructor() {
    this.naukri = new NaukriProvider();
    this.adzuna = new AdzunaProvider();
    this.jsearch = new JSearchProvider();
    this.database = new DatabaseJobProvider();

    this.cache = new Map();
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes cache
  }

  getProvidersStatus() {
    return [
      { name: 'Naukri (Authorized Partner)', configured: this.naukri.isConfigured() },
      { name: 'Adzuna API', configured: this.adzuna.isConfigured() },
      { name: 'JSearch API', configured: this.jsearch.isConfigured() },
      { name: 'HIREX Verified Internal Database', configured: true },
    ];
  }

  async searchJobs(query = {}, candidateProfile = null) {
    const cacheKey = JSON.stringify(query);
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return this.applyMatchingScores(cached.data, candidateProfile);
    }

    let results = [];
    let activeSource = 'HIREX-Internal';

    // 1. Try authorized partner Naukri first
    if (this.naukri.isConfigured()) {
      const res = await this.naukri.searchJobs(query);
      if (res.jobs && res.jobs.length > 0) {
        results = res.jobs;
        activeSource = 'Naukri';
      }
    }

    // 2. Try Adzuna fallback
    if (results.length === 0 && this.adzuna.isConfigured()) {
      const res = await this.adzuna.searchJobs(query);
      if (res.jobs && res.jobs.length > 0) {
        results = res.jobs;
        activeSource = 'Adzuna';
      }
    }

    // 3. Try JSearch fallback
    if (results.length === 0 && this.jsearch.isConfigured()) {
      const res = await this.jsearch.searchJobs(query);
      if (res.jobs && res.jobs.length > 0) {
        results = res.jobs;
        activeSource = 'JSearch';
      }
    }

    // 4. Default to HIREX Verified Internal Database
    if (results.length === 0) {
      const res = await this.database.searchJobs(query);
      results = res.jobs;
      activeSource = 'HIREX-Internal';
    }

    this.cache.set(cacheKey, {
      timestamp: Date.now(),
      data: { jobs: results, source: activeSource },
    });

    return this.applyMatchingScores({ jobs: results, source: activeSource }, candidateProfile);
  }

  /**
   * Deterministic matching engine (Skills, Experience, Package, Location)
   */
  applyMatchingScores(data, candidateProfile) {
    const { jobs, source } = data;
    if (!candidateProfile) {
      return { jobs, source, total: jobs.length };
    }

    const candidateSkills = (candidateProfile.skills || []).map((s) =>
      (typeof s === 'string' ? s : s.name).toLowerCase()
    );
    const candidateExp = candidateProfile.experienceYears || 0;
    const expectedSalaryINR =
      candidateProfile.expectedSalary?.min ||
      candidateProfile.expectedSalaryINR ||
      1200000; // default 12 LPA
    const candidateCity = (candidateProfile.location || 'Hyderabad').toLowerCase();

    const scoredJobs = jobs.map((job) => {
      // 1. Skill Match Score (Max 100)
      const reqSkills = (job.skills || []).map((s) => s.toLowerCase());
      let matchedSkills = [];
      let missingSkills = [];

      if (reqSkills.length > 0) {
        reqSkills.forEach((s) => {
          if (candidateSkills.some((cs) => cs.includes(s) || s.includes(cs))) {
            matchedSkills.push(s);
          } else {
            missingSkills.push(s);
          }
        });
      } else {
        matchedSkills = candidateSkills.slice(0, 3);
      }

      const skillsScore = reqSkills.length > 0 ? Math.round((matchedSkills.length / reqSkills.length) * 100) : 85;

      // 2. Experience Match Score
      let expScore = 90;
      if (candidateExp === 0 && (job.experienceMin <= 1 || job.experienceMin === 0)) {
        expScore = 98; // High consideration for freshers on entry-level jobs
      } else if (candidateExp >= job.experienceMin && candidateExp <= (job.experienceMax || 15)) {
        expScore = 95;
      } else if (candidateExp < job.experienceMin) {
        const gap = job.experienceMin - candidateExp;
        expScore = Math.max(40, 90 - gap * 15);
      } else {
        expScore = 85;
      }

      // 3. Package / Salary Compatibility Match
      let packageScore = 85;
      let packageLabel = 'Competitive';
      const jobMidSalary = (job.salaryMin + job.salaryMax) / 2;

      if (job.salaryMax >= expectedSalaryINR && job.salaryMin <= expectedSalaryINR) {
        packageScore = 95;
        packageLabel = 'Excellent Match';
      } else if (job.salaryMin > expectedSalaryINR) {
        packageScore = 98;
        packageLabel = 'Above Expectation';
      } else {
        // Job offers less than candidate expectation
        const ratio = jobMidSalary / expectedSalaryINR;
        if (ratio >= 0.8) {
          packageScore = 75;
          packageLabel = 'Moderate Match';
        } else {
          packageScore = Math.max(30, Math.round(ratio * 70));
          packageLabel = 'Package Mismatch';
        }
      }

      // 4. Location Match Score
      let locationScore = 70;
      const jobLoc = (job.location || '').toLowerCase();
      if (job.remote || job.workMode === 'Remote') {
        locationScore = 100;
      } else if (jobLoc.includes(candidateCity) || candidateCity.includes(jobLoc)) {
        locationScore = 95;
      } else {
        locationScore = 65;
      }

      // 5. Overall Weighted Match Score
      const overallMatch = Math.min(
        100,
        Math.round(skillsScore * 0.45 + expScore * 0.2 + packageScore * 0.2 + locationScore * 0.15)
      );

      return {
        ...job,
        matchScore: overallMatch,
        matchBreakdown: {
          skillsScore,
          experienceScore: expScore,
          packageScore,
          packageLabel,
          locationScore,
          matchedSkills,
          missingSkills,
          overallCompatibility: overallMatch >= 88 ? 'Exceptional Match' : overallMatch >= 75 ? 'Strong Match' : 'Potential Match',
        },
      };
    });

    // Sort by match score descending
    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

    return {
      jobs: scoredJobs,
      source,
      total: scoredJobs.length,
    };
  }
}

export const jobAggregationService = new JobAggregationService();
