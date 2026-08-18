import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import {
  Sparkles,
  Briefcase,
  Building2,
  TrendingUp,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronDown,
  Layers,
  Shield,
  Zap,
} from 'lucide-react';

export const Navbar = () => {
  const { user, role, isAuthenticated, logout, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDemoSwitch = async (roleType) => {
    setDemoMenuOpen(false);
    await demoLogin(roleType);
    if (roleType === 'candidate') navigate('/candidate/dashboard');
    else if (roleType === 'recruiter') navigate('/recruiter/dashboard');
    else if (roleType === 'admin') navigate('/admin/dashboard');
  };

  const getDashboardPath = () => {
    if (role === 'recruiter') return '/recruiter/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/candidate/dashboard';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08090D]/90 backdrop-blur-xl border-b border-white/10 shadow-xl'
          : 'bg-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FFD60A] to-[#FFE66D] flex items-center justify-center text-black font-black text-xl shadow-lg shadow-[#FFD60A]/20 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xl font-extrabold tracking-wider text-white flex items-center gap-1.5">
              HR<span className="text-[#FFD60A]">-FLOW</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#FFD60A]/15 text-[#FFD60A] border border-[#FFD60A]/30">
                AI
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            to="/jobs"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/jobs'
                ? 'text-[#FFD60A] bg-white/5 font-semibold'
                : 'text-text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            Find Jobs
          </Link>
          <Link
            to="/companies"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/companies'
                ? 'text-[#FFD60A] bg-white/5 font-semibold'
                : 'text-text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            Top Companies
          </Link>
          <Link
            to="/insights"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/insights'
                ? 'text-[#FFD60A] bg-white/5 font-semibold'
                : 'text-text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            Career Insights
          </Link>
          <Link
            to="/recruiter/login"
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-[#FFE66D]/90 hover:text-[#FFD60A] transition-colors"
          >
            For Employers
          </Link>
        </nav>

        {/* Right Action Bar */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quick Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#FFD60A]/10 text-[#FFD60A] border border-[#FFD60A]/30 hover:bg-[#FFD60A]/20 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>1-Click Demo Login</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {demoMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#151820] border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-text-muted border-b border-white/10">
                  Instant Test Accounts
                </div>
                <button
                  onClick={() => handleDemoSwitch('candidate')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left hover:bg-white/5 text-white hover:text-[#FFD60A] transition-colors"
                >
                  <User className="w-4 h-4 text-[#FFD60A]" />
                  <div>
                    <div className="font-semibold">Candidate Demo</div>
                    <div className="text-[10px] text-text-muted">Rahul Sharma (Full Stack)</div>
                  </div>
                </button>
                <button
                  onClick={() => handleDemoSwitch('recruiter')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left hover:bg-white/5 text-white hover:text-[#FFD60A] transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-[#38BDF8]" />
                  <div>
                    <div className="font-semibold">Recruiter Demo</div>
                    <div className="text-[10px] text-text-muted">TechNova Labs Hiring</div>
                  </div>
                </button>
                <button
                  onClick={() => handleDemoSwitch('admin')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left hover:bg-white/5 text-white hover:text-[#FFD60A] transition-colors"
                >
                  <Shield className="w-4 h-4 text-[#22C55E]" />
                  <div>
                    <div className="font-semibold">Admin Portal</div>
                    <div className="text-[10px] text-text-muted">Platform Oversight</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10 hover:border-[#FFD60A]/40 transition-colors"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                />
                <span className="text-xs font-semibold text-white max-w-[100px] truncate">{user?.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#151820] border border-white/10 rounded-xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                    <p className="text-[11px] text-text-muted capitalize">{user?.role} Portal</p>
                  </div>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Layers className="w-4 h-4 text-[#FFD60A]" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 text-text-muted hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#101217] border-b border-white/10 px-6 py-6 space-y-4">
          <div className="flex flex-col gap-2">
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-white font-medium hover:bg-white/5"
            >
              Find Jobs
            </Link>
            <Link
              to="/companies"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-white font-medium hover:bg-white/5"
            >
              Top Companies
            </Link>
            <Link
              to="/insights"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-white font-medium hover:bg-white/5"
            >
              Career Insights
            </Link>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <div className="text-xs font-semibold uppercase text-text-muted tracking-wider mb-1">Demo Logins</div>
            <div className="grid grid-cols-3 gap-2">
              <Button size="sm" variant="secondary" onClick={() => handleDemoSwitch('candidate')}>
                Candidate
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleDemoSwitch('recruiter')}>
                Recruiter
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleDemoSwitch('admin')}>
                Admin
              </Button>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
