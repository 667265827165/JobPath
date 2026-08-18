import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { MatchScore } from '../../components/common/MatchScore';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  BookOpen,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const CandidateSkillAnalysis = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await api.get('/analytics/candidate');
        if (res.data.success) setAnalytics(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const radarData = [
    { subject: 'Frontend (React/TS)', A: 94, fullMark: 100 },
    { subject: 'Backend (Node/API)', A: 88, fullMark: 100 },
    { subject: 'Database (SQL/NoSQL)', A: 84, fullMark: 100 },
    { subject: 'Cloud (AWS/GCP)', A: 48, fullMark: 100 },
    { subject: 'System Design', A: 52, fullMark: 100 },
    { subject: 'DevOps & Docker', A: 42, fullMark: 100 },
  ];

  return (
    <DashboardLayout
      title="Skill Gap Radar & Competency Diagnostics"
      subtitle="Detailed analysis of technical proficiencies, market demand alignment, and high-impact learning opportunities."
    >
      <div className="space-y-8">
        {/* Top Summary Card */}
        <div className="glass-card p-6 sm:p-8 border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFD60A] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> AI Evaluation
            </span>
            <h3 className="text-2xl font-extrabold text-white mt-1">Recommended Target Role: Full Stack Architect</h3>
            <p className="text-xs text-text-muted mt-1 max-w-xl leading-relaxed">
              Your strong frontend & backend execution places you in the top 8th percentile of Indian software engineers. Upgrading cloud orchestration skills will unlock senior architectural brackets (₹30L+ CTC).
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-4">
            <MatchScore score={92} size="lg" showLabel={true} />
          </div>
        </div>

        {/* 2-Column: Radar Chart + Strong vs Improvement Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <div className="glass-card p-6 border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFD60A]" /> Multi-Domain Competency Radar
            </h4>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#A7AFBE', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#A7AFBE" />
                  <Radar name="Proficiency" dataKey="A" stroke="#FFD60A" fill="#FFD60A" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strong Skills vs Focus Areas */}
          <div className="space-y-6">
            {/* Strong Skills */}
            <div className="glass-card p-6 border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#22C55E] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Strong Verified Skills (80%+)
                </h4>
                <span className="text-xs text-text-muted font-semibold">High Market Weight</span>
              </div>

              <div className="space-y-3">
                {(analytics?.strongSkills || [
                  { name: 'React', proficiency: 94 },
                  { name: 'JavaScript / ES6', proficiency: 92 },
                  { name: 'Node.js & Express', proficiency: 88 },
                  { name: 'MongoDB', proficiency: 84 },
                ]).map((sk, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{sk.name}</span>
                      <span className="font-bold text-[#22C55E]">{sk.proficiency}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-[#22C55E] rounded-full" style={{ width: `${sk.proficiency}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills to Improve */}
            <div className="glass-card p-6 border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD60A] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> High-Impact Skills to Level Up
                </h4>
                <span className="text-xs text-text-muted font-semibold">High Salary Boost</span>
              </div>

              <div className="space-y-3">
                {(analytics?.skillsToImprove || [
                  { name: 'System Design & High Scale', proficiency: 48 },
                  { name: 'AWS Cloud Architecture', proficiency: 42 },
                  { name: 'Docker & Kubernetes', proficiency: 38 },
                ]).map((sk, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{sk.name}</span>
                      <span className="font-bold text-[#FFD60A]">{sk.proficiency}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-[#FFD60A]" style={{ width: `${sk.proficiency}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
