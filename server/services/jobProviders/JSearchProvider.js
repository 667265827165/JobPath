import { JobProvider } from './JobProvider.js';

export class JSearchProvider extends JobProvider {
  constructor() {
    super('JSearch');
    this.apiKey = process.env.JSEARCH_API_KEY;
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey !== 'your_jsearch_api_key');
  }

  async searchJobs(query = {}) {
    if (!this.isConfigured()) {
      return {
        jobs: [],
        total: 0,
        source: this.name,
        configured: false,
        message: 'JSearch API key not configured in environment.',
      };
    }

    try {
      const { keyword, location, page = 1, limit = 15 } = query;
      const searchQuery = `${keyword || 'Developer'} in ${location || 'India'}`;
      console.log(`[Jobs] Provider=JSearch — Searching: ${searchQuery}`);

      const res = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=${page}&num_pages=1`, {
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'jsearch.p.rapidapi.com',
        },
      });

      if (!res.ok) {
        throw new Error(`JSearch API responded with status ${res.status}`);
      }

      const data = await res.json();
      const items = data.data || [];

      const normalized = items.slice(0, limit).map((item) =>
        this.normalizeJob({
          title: item.job_title,
          company: item.employer_name,
          location: `${item.job_city || 'Hyderabad'}, ${item.job_country || 'India'}`,
          description: item.job_description,
          skills: item.job_required_skills || [],
          experienceMin: item.job_required_experience?.required_experience_in_months
            ? Math.round(item.job_required_experience.required_experience_in_months / 12)
            : 0,
          experienceMax: 5,
          salaryMin: item.job_min_salary || 1200000,
          salaryMax: item.job_max_salary || 2200000,
          jobType: item.job_employment_type || 'Full-time',
          remote: !!item.job_is_remote,
          latitude: item.job_latitude || null,
          longitude: item.job_longitude || null,
          sourceUrl: item.job_apply_link,
          postedAt: item.job_posted_at_datetime_utc,
        })
      );

      return {
        jobs: normalized,
        total: normalized.length,
        source: this.name,
        configured: true,
      };
    } catch (error) {
      console.error('[Jobs] JSearch API Error:', error.message);
      return {
        jobs: [],
        total: 0,
        source: this.name,
        error: error.message,
      };
    }
  }
}
