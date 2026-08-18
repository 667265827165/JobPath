import React from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Bell, Sparkles, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardLayout = ({ children, title, subtitle, actions }) => {
  const { user, role } = useAuth();

  return (
    <div className="min-h-screen bg-[#08090D] flex flex-col md:flex-row text-[#F8FAFC]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/10 bg-[#08090D]/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="capitalize">{role} Portal</span>
            <ChevronRight className="w-3 h-3 text-text-subtle" />
            <span className="text-white font-semibold">{title || 'Dashboard'}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* AI Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD60A]/10 border border-[#FFD60A]/30 text-xs font-bold text-[#FFD60A]">
              <span className="w-2 h-2 rounded-full bg-[#FFD60A] animate-pulse" />
              <span>AI Engine Active</span>
            </div>

            {/* Notification Bell */}
            <Link
              to={role === 'candidate' ? '/candidate/applications' : '/recruiter/applications'}
              className="relative p-2 rounded-lg bg-white/5 border border-white/10 text-text-muted hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FFD60A]" />
            </Link>

            {/* Profile Avatar */}
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover border border-[#FFD60A]/40"
            />
          </div>
        </header>

        {/* Sub Header & Actions */}
        {(title || actions) && (
          <div className="px-6 py-6 border-b border-white/5 bg-[#101217]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{title}</h1>
              {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
};
