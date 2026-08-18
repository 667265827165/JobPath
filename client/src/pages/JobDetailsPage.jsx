import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { MatchScore } from '../components/common/MatchScore';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { JobCard } from '../components/jobs/JobCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import {
  Building2,
  MapPin,
  Briefcase,
  IndianRupee,
  Calendar,
  Bookmark,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Share2,
  ArrowLeft,
  ShieldCheck,
  Check,
  TrendingUp,
} from 'lucide-react';

export const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Apply modal
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.data.job);
          setIsSaved(res.data.data.job.isSaved);
          setSimilarJobs(res.data.data.similarJobs || []);
        }
      } catch (err) {
        console.error(err);
        showToast('Error loading job details.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to save jobs.', 'info');
      return;
    }
    try {
      const res = await api.post('/jobs/saved/toggle', { jobId: job._id });
      if (res.data.success) {
        setIsSaved(res.data.data.isSaved);
        showToast(res.data.message, 'success');
      }
    } catch (err) {
      showToast('Error saving job.', 'error');
    }
  };

  const handleOpenApply = () => {
    if (!isAuthenticated) {
      showToast('Please sign in to apply for this vacancy.', 'info');
      return;
    }
    setCoverLetter(`Hi ${company.name} Talent Team,\n\nI am eager to apply for the ${job.title} role. My hands-on engineering experience and proficiency in ${job.requiredSkills?.slice(0, 3).join(', ')} make me an ideal technical fit.`);
    setApplyModalOpen(true);
  };

  const handleSubmitApplication = async () => {
    setApplying(true);
    try {
      const res = await api.post('/applications', {
        jobId: job._id,
        coverLetter,
      });
      if (res.data.success) {
        showToast('🎉 Application submitted successfully!', 'success');
        setHasApplied(true);
        setApplyModalOpen(false);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit application.', 'error');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090D] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FFD60A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#08090D] text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold">Job Vacancy Not Found</h2>
        <p className="text-xs text-text-muted mt-2 mb-6">The role may have expired or been fulfilled.</p>
        <Link to="/jobs">
          <Button variant="primary">Browse Other Opportunities</Button>
        </Link>
      </div>
    );
  }

  const company = job.companyId || {};
  const match = job.matchBreakdown || { strongSkills: [], missingSkills: [] };

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Job Discovery
        </Link>

        {/* Job Header Hero Card */}
        <div className="glass-card p-6 sm:p-8 border-white/10 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src={company.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80'}
                alt={company.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-white/10 p-1 bg-[#1B1F28] shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#FFD60A] uppercase tracking-wider">{company.name}</span>
                  {company.verified && (
                    <ShieldCheck className="w-4 h-4 text-[#22C55E]" title="Verified Company" />
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{job.title}</h1>
                <p className="text-xs text-text-muted flex flex-wrap items-center gap-3 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FFD60A]" /> {job.location} ({job.workMode})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#22C55E] font-bold">
                    <IndianRupee className="w-3.5 h-3.5" /> ₹{(job.salaryMin / 100000).toFixed(0)}L – ₹{(job.salaryMax / 100000).toFixed(0)}L CTC
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-[#38BDF8]" /> {job.experienceMin}–{job.experienceMax} Years Experience
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleSaveToggle}
                className={`p-3 rounded-xl border transition-colors ${
                  isSaved
                    ? 'bg-[#FFD60A]/20 border-[#FFD60A] text-[#FFD60A]'
                    : 'bg-white/5 border-white/10 text-text-muted hover:text-white'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              {hasApplied ? (
                <span className="px-6 py-3 text-sm font-bold rounded-xl bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Application Submitted
                </span>
              ) : (
                <Button variant="primary" size="lg" onClick={handleOpenApply} icon={Sparkles}>
                  Apply with AI Match
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Job Details, Responsibilities, Requirements */}
          <div className="lg:col-span-2 space-y-8">
            {/* Required Skills */}
            <div className="glass-card p-6 sm:p-8 border-white/10 space-y-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFD60A]" /> Required Technical Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {(job.requiredSkills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-[#FFD60A]/10 border border-[#FFD60A]/30 text-xs font-bold text-[#FFD60A]"
                  >
                    {skill}
                  </span>
                ))}
                {(job.preferredSkills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-text-muted"
                  >
                    {skill} (Preferred)
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="glass-card p-6 sm:p-8 border-white/10 space-y-4 leading-relaxed text-xs sm:text-sm text-text-muted">
              <h3 className="text-base font-extrabold text-white">About the Opportunity</h3>
              <p>{job.description}</p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="glass-card p-6 sm:p-8 border-white/10 space-y-4">
                <h3 className="text-base font-extrabold text-white">Key Responsibilities</h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-text-muted">
                  {job.responsibilities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD60A] mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="glass-card p-6 sm:p-8 border-white/10 space-y-4">
                <h3 className="text-base font-extrabold text-white">Qualifications & Requirements</h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-text-muted">
                  {job.requirements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Company Benefits */}
            {company.benefits && company.benefits.length > 0 && (
              <div className="glass-card p-6 sm:p-8 border-white/10 space-y-4">
                <h3 className="text-base font-extrabold text-white">Company Perks & Benefits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {company.benefits.map((b, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white">
                      <span className="font-semibold">{b.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky "Your AI Match" Card & Similar Jobs */}
          <div className="space-y-6">
            {/* Sticky Match Card */}
            <div className="glass-card p-6 border-white/10 sticky top-28 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FFD60A] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Neural Compatibility
                </span>
                <span className="text-xs font-semibold text-text-muted">Live Analysis</span>
              </div>

              <div className="py-2 flex justify-center">
                <MatchScore score={job.matchScore || 92} size="lg" showLabel={true} />
              </div>

              {/* Strong Skills */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#22C55E] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Strong Skill Overlaps:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(match.strongSkills || ['React', 'TypeScript', 'Node.js']).map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills to Improve */}
              {match.missingSkills && match.missingSkills.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#FFD60A]" /> Recommended Prep:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {match.missingSkills.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-white/5 text-text-muted border border-white/10 font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Apply CTA */}
              <div className="pt-4 border-t border-white/10">
                {hasApplied ? (
                  <Button variant="secondary" className="w-full" disabled>
                    ✓ Application Received
                  </Button>
                ) : (
                  <Button variant="primary" size="lg" className="w-full font-bold" onClick={handleOpenApply}>
                    Apply for Position Now
                  </Button>
                )}
              </div>
            </div>

            {/* Similar Roles */}
            {similarJobs.length > 0 && (
              <div className="glass-card p-6 border-white/10 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Similar Openings</h4>
                <div className="space-y-3">
                  {similarJobs.map((simJob) => (
                    <Link
                      key={simJob._id}
                      to={`/jobs/${simJob._id}`}
                      className="block p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#FFD60A]/30 transition-colors"
                    >
                      <h5 className="text-xs font-bold text-white hover:text-[#FFD60A]">{simJob.title}</h5>
                      <p className="text-[11px] text-text-muted mt-0.5">{simJob.companyId?.name} • {simJob.location}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply to ${job.title}`}
        maxWidth="max-w-xl"
      >
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-[#101217] border border-white/10 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">{company.name}</h4>
              <p className="text-xs text-text-muted">{job.location} • ₹{(job.salaryMin / 100000).toFixed(0)}L - ₹{(job.salaryMax / 100000).toFixed(0)}L CTC</p>
            </div>
            <span className="text-xs font-bold text-[#FFD60A] px-2.5 py-1 rounded-lg bg-[#FFD60A]/10 border border-[#FFD60A]/30">
              {job.matchScore || 92}% Match
            </span>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Introduction Pitch / Note for Recruiter
            </label>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full mt-1.5 p-3.5 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmitApplication} loading={applying} icon={Sparkles}>
              Submit Application
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};
