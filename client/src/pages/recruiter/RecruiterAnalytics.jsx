import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/common/StatCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { TrendingUp, Users, Award, Clock, Sparkles } from 'lucide-react';

export const RecruiterAnalytics = () => {
  const timeToHireData = [
    { role: 'React Frontend', days: 14 },
    { role: 'Backend Node.js', days: 18 },
    { role: 'DevOps / AWS', days: 16 },
    { role: 'Mobile Engineer', days: 21 },
    { role: 'Data Scientist', days: 24 },
  ];

  const applicantQualityData = [
    { scoreRange: '90-100% Match', candidates: 18 },
    { scoreRange: '80-89% Match', candidates: 24 },
    { scoreRange: '70-79% Match', candidates: 14 },
    { scoreRange: 'Below 70%', candidates: 6 },
  ];

  return (
    <DashboardLayout
      title="Talent Acquisition & Hiring Velocity Analytics"
      subtitle="Metrics tracking source quality, speed-to-offer, and AI candidate matching benchmarks."
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Avg Time to Offer" value="16.4 Days" subtitle="62% faster than industry benchmark" trend="-8 Days" trendPositive={true} icon={Clock} />
          <StatCard title="Offer Acceptance Rate" value="94.2%" subtitle="High engineering alignment" trend="+6.4%" trendPositive={true} icon={Award} accent={true} />
          <StatCard title="High-Match Applicants" value="68%" subtitle="Score above 85% AI match" trend="+14%" trendPositive={true} icon={Sparkles} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Time to hire */}
          <div className="glass-card p-6 border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FFD60A]" /> Average Days to Hire by Role
            </h4>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeToHireData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="role" stroke="#A7AFBE" tick={{ fontSize: 11, fill: '#A7AFBE' }} />
                  <YAxis stroke="#A7AFBE" tick={{ fontSize: 11, fill: '#A7AFBE' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#151820', borderColor: 'rgba(255,214,10,0.3)', borderRadius: '0.75rem', fontSize: '12px' }} />
                  <Bar dataKey="days" fill="#FFD60A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Applicant Match Quality */}
          <div className="glass-card p-6 border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#22C55E]" /> Inbound Candidate Match Distribution
            </h4>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicantQualityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="scoreRange" stroke="#A7AFBE" tick={{ fontSize: 11, fill: '#A7AFBE' }} />
                  <YAxis stroke="#A7AFBE" tick={{ fontSize: 11, fill: '#A7AFBE' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#151820', borderColor: 'rgba(255,214,10,0.3)', borderRadius: '0.75rem', fontSize: '12px' }} />
                  <Bar dataKey="candidates" fill="#22C55E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
