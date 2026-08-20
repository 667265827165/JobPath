import { JobProvider } from './JobProvider.js';

export class AdzunaProvider extends JobProvider {
  constructor() {
    super('Adzuna');
    this.appId = process.env.ADZUNA_APP_ID;
    this.appKey = process.env.ADZUNA_APP_KEY;
    this.baseUrl = process.env.ADZUNA_BASE_URL || 'https://api.adzuna.com/v1/api/jobs/in/search';
  }

  isConfigured() {
    return Boolean(this.appId && this.appKey && this.appId !== 'your_adzuna_app_id');
  }

  async searchJobs(query = {}) {
    if (!this.isConfigured()) {
      return {
        jobs: [],
        total: 0,
        source: this.name,
        configured: false,
        message: 'Adzuna API credentials not configured in environment.',
      };
    }

    try {
      const { keyword, location, page = 1, limit = 20 } = query;
      const url = `${this.baseUrl}/${page}?app_id=${this.appId}&app_key=${this.appKey}&results_per_page=${limit}&what=${encodeURIComponent(
        keyword || 'software engineer'
      )}&where=${encodeURIComponent(location || 'India')}&content-type=application/json`;

      console.log(`[Jobs] Provider=Adzuna — Searching: ${keyword || 'software engineer'} in ${location || 'India'}`);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Adzuna API responded with status ${res.status}`);
      }

      const data = await res.json();
      const results = data.results || [];

      const normalized = results.map((item) =>
        this.normalizeJob({
          title: item.title,
          company: item.company?.display_name || 'Tech Company',
          location: item.location?.display_name || 'India',
          description: item.description,
          skills: [item.category?.label || 'Software Development'],
          experienceMin: 0,
          experienceMax: 5,
          salaryMin: item.salary_min ? Math.round(item.salary_min) : 1000000,
          salaryMax: item.salary_max ? Math.round(item.salary_max) : 2000000,
          jobType: item.contract_time === 'full_time' ? 'Full-time' : 'Contract',
          latitude: item.latitude || null,
          longitude: item.longitude || null,
          sourceUrl: item.redirect_url,
          postedAt: item.created,
        })
      );

      return {
        jobs: normalized,
        total: data.count || normalized.length,
        source: this.name,
        configured: true,
      };
    } catch (error) {
      console.error('[Jobs] Adzuna API Error:', error.message);
      return {
        jobs: [],
        total: 0,
        source: this.name,
        error: error.message,
      };
    }
  }
}
