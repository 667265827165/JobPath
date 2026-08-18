import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { JobCard } from '../components/jobs/JobCard';
import { JobFilters } from '../components/jobs/JobFilters';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import { Search, SlidersHorizontal, Sparkles, AlertCircle, ArrowUpDown, CheckCircle2 } from 'lucide-react';

export const JobListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Quick Apply Modal State
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || 'All Locations',
    workMode: searchParams.get('workMode') || 'All Modes',
    jobType: searchParams.get('jobType') || 'All Types',
    experience: searchParams.get('experience') || 'All Experience',
    minSalary: 0,
    sort: 'latest',
    page: 1,
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.location && filters.location !== 'All Locations') queryParams.append('location', filters.location);
      if (filters.workMode && filters.workMode !== 'All Modes') queryParams.append('workMode', filters.workMode);
      if (filters.jobType && filters.jobType !== 'All Types') queryParams.append('jobType', filters.jobType);
      if (filters.experience && filters.experience !== 'All Experience') queryParams.append('experience', filters.experience);
      if (filters.minSalary > 0) queryParams.append('minSalary', filters.minSalary);
      if (filters.sort) queryParams.append('sort', filters.sort);
      queryParams.append('page', filters.page);
      queryParams.append('limit', 12);

      const res = await api.get(`/jobs?${queryParams.toString()}`);
      if (res.data.success) {
        setJobs(res.data.data.jobs);
        setTotalJobs(res.data.data.total);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading jobs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleSaveToggle = async (jobId) => {
    if (!isAuthenticated) {
      showToast('Please sign in to save jobs.', 'info');
      return;
    }
    try {
      const res = await api.post('/jobs/saved/toggle', { jobId });
      if (res.data.success) {
        showToast(res.data.message, 'success');
        setJobs((prev) =>
          prev.map((j) => (j._id === jobId ? { ...j, isSaved: res.data.data.isSaved } : j))
        );
      }
    } catch (err) {
      showToast('Error updating saved job.', 'error');
    }
  };

  const handleOpenApply = (job) => {
    if (!isAuthenticated) {
      showToast('Please sign in to apply for this vacancy.', 'info');
      return;
    }
    setSelectedJob(job);
    setCoverLetter(`Hi ${job.companyId?.name || 'Hiring Team'},\n\nI am thrilled to apply for the ${job.title} role. My hands-on background in ${job.requiredSkills?.slice(0, 3).join(', ')} directly matches your engineering requirements.`);
    setApplyModalOpen(true);
  };

  const handleSubmitApplication = async () => {
    if (!selectedJob) return;
    setApplying(true);
    try {
      const res = await api.post('/applications', {
        jobId: selectedJob._id,
        coverLetter,
      });
      if (res.data.success) {
        showToast('🎉 Application submitted successfully!', 'success');
        setAppliedJobIds((prev) => new Set([...prev, selectedJob._id]));
        setApplyModalOpen(false);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit application.', 'error');
    } finally {
      setApplying(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      location: 'All Locations',
      workMode: 'All Modes',
      jobType: 'All Types',
      experience: 'All Experience',
      minSalary: 0,
      sort: 'latest',
      page: 1,
    });
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Explore Tech Opportunities
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Showing <span className="text-[#FFD60A] font-bold">{totalJobs}</span> verified open positions tailored to your engineering stack.
            </p>
          </div>

          {/* Sort & Mobile filter trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#151820] border border-white/10 text-xs font-semibold text-white"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#FFD60A]" />
              Filters
            </button>

            <div className="flex items-center gap-2 bg-[#151820] border border-white/10 px-3 py-1.5 rounded-xl text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#FFD60A]" />
              <select
                value={filters.sort}
                onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
                className="bg-transparent text-white focus:outline-none cursor-pointer"
              >
                <option value="latest" className="bg-[#151820]">Latest Published</option>
                <option value="salary_high" className="bg-[#151820]">Salary: High → Low</option>
                <option value="salary_low" className="bg-[#151820]">Salary: Low → High</option>
                <option value="popular" className="bg-[#151820]">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout: Filter Sidebar + Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block md:col-span-1">
            <div className="sticky top-28">
              <JobFilters filters={filters} setFilters={setFilters} onReset={handleResetFilters} />
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {showMobileFilters && (
            <div className="md:hidden mb-6">
              <JobFilters filters={filters} setFilters={setFilters} onReset={handleResetFilters} />
            </div>
          )}

          {/* Job Cards Grid */}
          <div className="md:col-span-3 space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="glass-card p-6 border-white/5 space-y-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/5 rounded-xl" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-white/10 rounded w-3/4" />
                        <div className="h-3 bg-white/5 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-6 bg-white/5 rounded" />
                      <div className="h-6 bg-white/5 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              /* Empty State */
              <div className="glass-card p-12 text-center border-white/10 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#FFD60A]">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">No Vacancies Matched Your Exact Filter</h3>
                <p className="text-xs text-text-muted max-w-sm mx-auto">
                  Try adjusting your keywords, salary brackets, or expanding to other locations.
                </p>
                <Button variant="secondary" size="sm" onClick={handleResetFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onSave={handleSaveToggle}
                    onApply={handleOpenApply}
                    isSaved={job.isSaved}
                    hasApplied={appliedJobIds.has(job._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Quick Application Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title="Submit Application via AI Profile"
        maxWidth="max-w-xl"
      >
        {selectedJob && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-[#101217] border border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{selectedJob.title}</h4>
                <p className="text-xs text-text-muted">{selectedJob.companyId?.name} • {selectedJob.location}</p>
              </div>
              <span className="text-xs font-bold text-[#FFD60A] px-2.5 py-1 rounded-lg bg-[#FFD60A]/10 border border-[#FFD60A]/30">
                {selectedJob.matchScore || 90}% AI Match
              </span>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Candidate Note / Quick Pitch
              </label>
              <textarea
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full mt-1.5 p-3.5 bg-[#101217] border border-white/10 rounded-xl text-xs text-white placeholder-text-subtle focus:outline-none focus:border-[#FFD60A]"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-text-muted flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
              <span>Your verified skills & resume profile will be automatically attached.</span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setApplyModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmitApplication}
                loading={applying}
                icon={Sparkles}
              >
                Submit Application
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
};
