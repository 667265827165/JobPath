import { JobProvider } from './JobProvider.js';

export class NaukriProvider extends JobProvider {
  constructor() {
    super('Naukri');
    this.apiKey = process.env.NAUKRI_API_KEY;
    this.clientId = process.env.NAUKRI_CLIENT_ID;
    this.clientSecret = process.env.NAUKRI_CLIENT_SECRET;
    this.baseUrl = process.env.NAUKRI_BASE_URL || 'https://api.naukri.com/v1';
  }

  isConfigured() {
    return Boolean(this.apiKey && this.clientId && this.clientSecret && this.apiKey !== 'your_naukri_api_key_here');
  }

  async searchJobs(query = {}) {
    if (!this.isConfigured()) {
      console.log('[Jobs] Provider=Naukri — Authorized API credentials not provided. Falling back to configured providers.');
      return {
        jobs: [],
        total: 0,
        source: this.name,
        configured: false,
        message: 'Naukri integration requires authorized partner API credentials/access.',
      };
    }

    try {
      console.log(`[Jobs] Provider=Naukri — Querying authorized partner endpoint: ${this.baseUrl}/jobs/search`);
      const { keyword, location, experience, page = 1, limit = 20 } = query;

      const params = new URLSearchParams({
        keywords: keyword || 'Software Engineer',
        location: location || 'India',
        experience: String(experience || 0),
        pageNo: String(page),
        pageSize: String(limit),
      });

      const res = await fetch(`${this.baseUrl}/jobs/search?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Client-Id': this.clientId,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Naukri API responded with status ${res.status}`);
      }

      const data = await res.json();
      const rawJobs = data.jobDetails || data.jobs || [];

      const normalized = rawJobs.map((item) =>
        this.normalizeJob({
          title: item.title || item.jobTitle,
          company: item.companyName || item.company,
          location: item.location || item.city || 'Hyderabad, India',
          description: item.jobDescription || item.description,
          skills: item.keySkills || item.skills || [],
          experienceMin: item.minExp,
          experienceMax: item.maxExp,
          salaryMin: item.minSalary,
          salaryMax: item.maxSalary,
          jobType: item.employmentType || 'Full-time',
          remote: item.isRemote || false,
          sourceUrl: item.applyUrl || item.jdUrl,
          postedAt: item.createdDate,
        })
      );

      return {
        jobs: normalized,
        total: data.totalJobs || normalized.length,
        source: this.name,
        configured: true,
      };
    } catch (error) {
      console.error('[Jobs] Naukri API Error:', error.message);
      return {
        jobs: [],
        total: 0,
        source: this.name,
        error: error.message,
      };
    }
  }
}
