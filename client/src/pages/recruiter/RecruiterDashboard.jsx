import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { MatchScore } from '../../components/common/MatchScore';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  Award,
  Sparkles,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Building2,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiterStats = async () => {
      setLoading(true);
      try {
        const res = await api.get('/recruiter/dashboard-stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecruiterStats();
  }, []);

  const metrics = [
    { title: 'Active Openings', value: stats?.metrics?.activeJobs || 8, icon: Briefcase, subtitle: 'Live across platform' },
    { title: 'Total Applicants', value: stats?.metrics?.totalApplicants || 46, icon: Users, subtitle: 'Across all active roles' },
    { title: 'Shortlisted Pool', value: stats?.metrics?.shortlisted || 12, icon: CheckCircle2, accent: true, subtitle: 'Ranked by AI match' },
    { title: 'Interviews Scheduled', value: stats?.metrics?.interviews || 4, icon: Calendar, subtitle: 'Upcoming this week' },
  ];

  const hiringPipelineData = [
    { stage: 'Applicants', count: stats?.metrics?.totalApplicants || 46 },
    { stage: 'Under Review', count: 28 },
    { stage: 'Shortlisted', count: stats?.metrics?.shortlisted || 12 },
    { stage: 'Interviewing', count: stats?.metrics?.interviews || 4 },
    { stage: 'Offers Extended', count: stats?.metrics?.hires || 2 },
  ];

  return (
    <DashboardLayout
      title="Employer Talent Acquisition Hub"
      subtitle={`Welcome, ${user?.name || 'Recruiter'}. Monitor applicant velocity and AI candidate compatibility.`}
      actions={
        <div className="flex items-center gap-2.5">
          <Link to="/recruiter/candidates">
            <Button variant="outline" size="sm" icon={Sparkles}>
              AI Candidate Ranking
            </Button>
          </Link>
          <Link to="/recruiter/post-job">
            <Button variant="primary" size="sm" icon={PlusCircle}>
              Post New Job
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Top 4 Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, idx) => (
            <StatCard key={idx} {...m} />
          ))}
        </div>

        {/* 2-Column: Pipeline Funnel + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Funnel Chart */}
          <div className="lg:col-span-2 glass-card p-6 border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#FFD60A]" /> Active Hiring Pipeline Funnel
                </h3>
                <p className="text-xs text-text-muted mt-0.5">Candidate progression from submission to offer</p>
              </div>
              <span className="text-xs font-bold text-[#FFD60A] bg-[#FFD60A]/10 px-2 py-0.5 rounded">
                Avg Match: 89%
              </span>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hiringPipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="stage" stroke="#A7AFBE" tick={{ fontSize: 11, fill: '#A7AFBE' }} />
                  <YAxis stroke="#A7AFBE" tick={{ fontSize: 11, fill: '#A7AFBE' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#151820', borderColor: 'rgba(255,214,10,0.3)', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#FFD60A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick AI Matching Banner */}
          <div className="glass-card p-6 border-white/10 flex flex-col justify-between space-y-4 bg-gradient-to-br from-[#1B1F28] to-[#151820]">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FFD60A]/15 border border-[#FFD60A]/30 text-[#FFD60A] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">AI Candidate Ranking Engine</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Automatically sort all inbound engineering applicants by technical stack alignment and team gap compatibility.
              </p>
            </div>

            <Link to="/recruiter/candidates">
              <Button variant="primary" size="sm" className="w-full font-bold" icon={Sparkles}>
                Launch Candidate Ranking
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Applications Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FFD60A]" /> Recent Engineering Inquiries
            </h3>
            <Link to="/recruiter/applications" className="text-xs font-bold text-[#FFD60A] hover:underline flex items-center gap-1">
              View All Applications <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats?.recentApplications && stats.recentApplications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.recentApplications.map((app) => (
                <div key={app._id} className="glass-card p-5 border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={app.candidateId?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={app.candidateId?.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{app.candidateId?.name}</h4>
                      <p className="text-[11px] text-text-muted">{app.jobId?.title || 'Engineer'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MatchScore score={app.matchScore || 90} size="sm" showLabel={false} />
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded uppercase bg-white/5 text-white capitalize">
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center text-xs text-text-muted">
              No recent applications recorded. Post roles to start receiving applicant pipelines.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
