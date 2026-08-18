import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import {
  Briefcase,
  PlusCircle,
  Users,
  Eye,
  MapPin,
  IndianRupee,
  ExternalLink,
  Calendar,
} from 'lucide-react';

export const RecruiterManageJobs = () => {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await api.get('/jobs?limit=50');
        if (res.data.success) {
          setJobs(res.data.data.jobs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <DashboardLayout
      title="Manage Job Postings"
      subtitle="Overview of all published roles, applicant counts, and live job status."
      actions={
        <Link to="/recruiter/post-job">
          <Button variant="primary" size="sm" icon={PlusCircle}>
            Post New Role
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center text-text-muted">Loading postings...</div>
        ) : jobs.length === 0 ? (
          <div className="glass-card p-12 text-center border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white">No Active Job Postings</h3>
            <p className="text-xs text-text-muted">Create your first role to start receiving applicants.</p>
            <Link to="/recruiter/post-job">
              <Button variant="primary" size="sm">
                Create First Job
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="glass-card p-6 border-white/10 flex flex-col justify-between space-y-4 shadow-xl">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 uppercase">
                      {job.status}
                    </span>
                    <span className="text-xs text-text-muted">{job.jobType}</span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">{job.title}</h3>
                  <p className="text-xs text-text-muted flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FFD60A]" /> {job.location} ({job.workMode})
                  </p>

                  <div className="flex items-center gap-3 my-3 text-xs">
                    <span className="text-[#22C55E] font-bold">
                      ₹{(job.salaryMin / 100000).toFixed(0)}L – ₹{(job.salaryMax / 100000).toFixed(0)}L
                    </span>
                    <span className="text-text-muted">•</span>
                    <span className="text-text-muted">{job.experienceMin}–{job.experienceMax} Yrs Exp</span>
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1">
                    {(job.requiredSkills || []).slice(0, 3).map((sk, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-text-muted border border-white/5">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Metrics & Actions */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1 text-white font-bold">
                      <Users className="w-3.5 h-3.5 text-[#FFD60A]" /> {job.applicationsCount || 12} Applicants
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/jobs/${job._id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to={`/recruiter/candidates?jobId=${job._id}`}>
                      <Button variant="outline" size="sm">
                        Review AI Pool
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
