import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  Sparkles,
  FileCheck2,
  Bookmark,
  FileText,
  LineChart,
  Calendar,
  Settings,
  PlusCircle,
  Briefcase,
  Users,
  Building2,
  BarChart3,
  Shield,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export const Sidebar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const candidateLinks = [
    { name: 'Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
    { name: 'Find Jobs', path: '/jobs', icon: Search },
    { name: 'My Applications', path: '/candidate/applications', icon: FileCheck2, badge: 'Pipeline' },
    { name: 'Saved Jobs', path: '/candidate/saved-jobs', icon: Bookmark },
    { name: 'AI Resume Analyzer', path: '/candidate/resume-ai', icon: FileText, highlight: true },
    { name: 'Skill Gap Radar', path: '/candidate/skill-analysis', icon: Sparkles },
    { name: 'Career Forecasts', path: '/insights', icon: LineChart },
    { name: 'Interviews', path: '/candidate/interviews', icon: Calendar },
  ];

  const recruiterLinks = [
    { name: 'Overview', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { name: 'Post New Job', path: '/recruiter/post-job', icon: PlusCircle, highlight: true },
    { name: 'Manage Jobs', path: '/recruiter/manage-jobs', icon: Briefcase },
    { name: 'Applicant Pipeline', path: '/recruiter/applications', icon: Users },
    { name: 'AI Candidate Ranking', path: '/recruiter/candidates', icon: Sparkles },
    { name: 'Interviews Hub', path: '/recruiter/interviews', icon: Calendar },
    { name: 'Company Profile', path: '/recruiter/company-profile', icon: Building2 },
    { name: 'Hiring Analytics', path: '/recruiter/analytics', icon: BarChart3 },
  ];

  const adminLinks = [
    { name: 'Platform Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Job Moderation', path: '/admin/jobs', icon: Briefcase },
  ];

  const links = role === 'recruiter' ? recruiterLinks : role === 'admin' ? adminLinks : candidateLinks;

  return (
    <aside className="w-64 bg-[#101217] border-r border-white/10 flex flex-col min-h-screen sticky top-0 left-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FFD60A] to-[#FFE66D] flex items-center justify-center text-black font-black text-lg shadow-lg shadow-[#FFD60A]/20">
            ⚡
          </div>
          <span className="font-mono text-lg font-extrabold tracking-wider text-white">
            HR<span className="text-[#FFD60A]">-FLOW</span>
          </span>
        </Link>
      </div>

      {/* User Mini Profile Card */}
      <div className="p-4 mx-3 my-4 rounded-xl bg-[#151820] border border-white/5 flex items-center gap-3">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
          alt={user?.name}
          className="w-10 h-10 rounded-full object-cover border border-[#FFD60A]/30"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-white truncate">{user?.name}</h4>
          <span className="inline-block text-[10px] font-semibold text-[#FFD60A] uppercase tracking-wider capitalize">
            {role}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted">
          Navigation
        </div>
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#FFD60A] text-black shadow-lg shadow-[#FFD60A]/20 font-bold'
                    : item.highlight
                    ? 'bg-[#FFD60A]/10 text-[#FFD60A] border border-[#FFD60A]/30 hover:bg-[#FFD60A]/20'
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : item.highlight ? 'text-[#FFD60A]' : 'text-text-muted group-hover:text-white'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-black/20 text-black' : 'bg-[#FFD60A]/20 text-[#FFD60A]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer Sign Out */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-text-muted hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors border border-transparent hover:border-[#EF4444]/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
