/**
 * Abstract Base Class for Job Providers in HIREX
 */
export class JobProvider {
  constructor(name) {
    this.name = name;
  }

  /**
   * Search jobs from provider
   * @param {Object} query - { keyword, location, experience, minSalary, maxSalary, remote, page, limit }
   * @returns {Promise<{ jobs: Array, total: Number, source: String, error?: String }>}
   */
  async searchJobs(query) {
    throw new Error('searchJobs() must be implemented by JobProvider subclass.');
  }

  /**
   * Check if provider credentials / configuration are active
   * @returns {Boolean}
   */
  isConfigured() {
    return false;
  }

  /**
   * Normalize external job item into standard HIREX job format
   */
  normalizeJob(rawJob) {
    return {
      title: rawJob.title || 'Software Engineer',
      company: rawJob.company || 'Tech Enterprise',
      location: rawJob.location || 'Hyderabad, India',
      description: rawJob.description || '',
      skills: rawJob.skills || [],
      experienceMin: rawJob.experienceMin ?? 0,
      experienceMax: rawJob.experienceMax ?? 5,
      salaryMin: rawJob.salaryMin ?? 1000000,
      salaryMax: rawJob.salaryMax ?? 2000000,
      currency: rawJob.currency || 'INR',
      jobType: rawJob.jobType || 'Full-time',
      remote: !!rawJob.remote,
      latitude: rawJob.latitude ?? null,
      longitude: rawJob.longitude ?? null,
      source: this.name,
      sourceUrl: rawJob.sourceUrl || '',
      postedAt: rawJob.postedAt || new Date().toISOString(),
    };
  }
}
