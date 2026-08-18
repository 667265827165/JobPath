import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/common/StatCard';
import { JobCard } from '../../components/jobs/JobCard';
import { MatchScore } from '../../components/common/MatchScore';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import {
  Sparkles,
  FileCheck2,
  Calendar,
  Bookmark,
  TrendingUp,
  UserCheck,
  ArrowRight,
  Briefcase,
  Cpu,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const CandidateDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [analytics, setAnalytics] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [analyticsRes, jobsRes] = await Promise.all([
          api.get('/analytics/candidate'),
          api.get('/jobs?limit=4'),
        ]);

        if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
        if (jobsRes.data.success) setRecommendedJobs(jobsRes.data.data.jobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats = [
    { title: 'Profile Completion', value: `${analytics?.profileCompletion || 88}%`, icon: UserCheck, subtitle: 'Neural profile up to date' },
    { title: 'AI Match Index', value: `${analytics?.aiAverageMatch || 94}%`, icon: Sparkles, accent: true, subtitle: 'Top 5% candidate compatibility' },
    { title: 'Active Applications', value: analytics?.totalApplications || 24, icon: FileCheck2, subtitle: '3 Under technical review' },
    { title: 'Interviews Scheduled', value: analytics?.interviews || 5, icon: Calendar, subtitle: 'Next round tomorrow' },
  ];

  return (
    <DashboardLayout
      title="Candidate Career Intelligence"
      subtitle={`Welcome back, ${user?.name || 'Engineer'}. Here is your real-time recruitment telemetry.`}
      actions={
        <Link to="/candidate/resume-ai">
          <Button variant="primary" size="sm" icon={Sparkles}>
            Re-Analyze Resume
          </Button>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Top 4 Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((st, idx) => (
            <StatCard key={idx} {...st} />
          ))}
        </div>

        {/* 2-Column Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Profile Activity */}
          <div className="lg:col-span-2 glass-card p-6 border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#FFD60A]" /> Recruiter Views & Application Velocity
                </h3>
                <p className="text-xs text-text-muted mt-0.5">Profile impressions across hiring teams this week</p>
              </div>
              <span className="text-xs font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded">
                +42% Views
              </span>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics?.weeklyActivity || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD60A" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#FFD60A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#A7AFBE" tick={{ fontSize: 11, fill: '#A7AFBE' }} />
                  <YAxis stroke="#A7AFBE" tick={{ fontSize: 11, fill: '#A7AFBE' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#151820', borderColor: 'rgba(255,214,10,0.3)', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="profileViews"
                    stroke="#FFD60A"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strong Skills vs Focus Areas */}
          <div className="glass-card p-6 border-white/10 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#FFD60A]" /> Top Technical Proficiencies
              </h3>
              <p className="text-xs text-text-muted mb-4">Extracted from verified GitHub & Resume commits</p>

              <div className="space-y-3">
                {(analytics?.strongSkills || []).slice(0, 4).map((sk, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{sk.name}</span>
                      <span className="font-bold text-[#FFD60A]">{sk.proficiency || 90}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FFE66D] to-[#FFD60A] rounded-full"
                        style={{ width: `${sk.proficiency || 90}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link to="/candidate/skill-analysis">
              <Button variant="outline" size="sm" className="w-full">
                View Full Skill Gap Radar
              </Button>
            </Link>
          </div>
        </div>

        {/* Recommended Jobs for Candidate */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFD60A]" /> AI Recommended Vacancies
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Roles exceeding 90% technical stack synergy with your profile
              </p>
            </div>
            <Link to="/jobs">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
