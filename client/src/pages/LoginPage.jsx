import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Zap,
  User,
  Briefcase,
  Shield,
  ArrowRight,
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email.trim() || !password.trim()) {
      showToast('Please enter both email and password.', 'info');
      return;
    }

    setLoading(true);
    const res = await login(email.trim().toLowerCase(), password);
    setLoading(false);

    if (res.success) {
      showToast('Signed in successfully!', 'success');
      if (res.user.role === 'recruiter') navigate('/recruiter/dashboard');
      else if (res.user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/candidate/dashboard');
    } else {
      showToast(res.message || 'Login failed. Please check credentials.', 'error');
    }
  };

  const handleDemo = async (roleType) => {
    setLoading(true);
    const res = await demoLogin(roleType);
    setLoading(false);
    if (res.success) {
      showToast(`Logged in as ${roleType}!`, 'success');
      if (roleType === 'recruiter') navigate('/recruiter/dashboard');
      else if (roleType === 'admin') navigate('/admin/dashboard');
      else navigate('/candidate/dashboard');
    }
  };

  const handleSocialAuth = (provider) => {
    showToast(`Connecting with ${provider}...`, 'info');
    setTimeout(() => {
      showToast(`${provider} login successful!`, 'success');
      navigate('/candidate/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#08090D] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#FFD60A]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-[#FFD60A] flex items-center justify-center text-black font-black text-xl shadow-lg shadow-[#FFD60A]/20 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <span className="font-mono text-2xl font-extrabold tracking-wider text-white">
            HR<span className="text-[#FFD60A]">-FLOW</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Sign In to Your Workspace</h2>
        <p className="text-xs text-text-muted mt-1">Access AI match recommendations and recruitment pipelines</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Instant Demo Accounts Switcher */}
        <div className="mb-6 p-4 rounded-2xl bg-[#151820] border border-[#FFD60A]/30 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FFD60A]">
              <Zap className="w-4 h-4" /> 1-Click Instant Demo Login
            </div>
            <span className="text-[10px] text-text-muted">No password needed</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('candidate')}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-[#FFD60A]/10 border border-white/10 hover:border-[#FFD60A]/40 text-xs font-bold text-white hover:text-[#FFD60A] transition-all flex flex-col items-center gap-1"
            >
              <User className="w-4 h-4 text-[#FFD60A]" />
              <span>Candidate</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('recruiter')}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-[#38BDF8]/10 border border-white/10 hover:border-[#38BDF8]/40 text-xs font-bold text-white hover:text-[#38BDF8] transition-all flex flex-col items-center gap-1"
            >
              <Briefcase className="w-4 h-4 text-[#38BDF8]" />
              <span>Recruiter</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-[#22C55E]/10 border border-white/10 hover:border-[#22C55E]/40 text-xs font-bold text-white hover:text-[#22C55E] transition-all flex flex-col items-center gap-1"
            >
              <Shield className="w-4 h-4 text-[#22C55E]" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <div className="glass-card p-6 sm:p-8 border-white/10 shadow-2xl space-y-6">
          {/* Social Logins */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleSocialAuth('Google')}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8 0-1.3.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialAuth('GitHub')}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[11px] font-semibold text-text-muted uppercase">or sign in with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Email Address</label>
              <div className="relative mt-1.5">
                <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#101217] border border-white/10 rounded-xl text-xs text-white placeholder-text-subtle focus:outline-none focus:border-[#FFD60A]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Password</label>
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to your registered email.', 'info')}
                  className="text-[11px] text-[#FFD60A] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative mt-1.5">
                <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#101217] border border-white/10 rounded-xl text-xs text-white placeholder-text-subtle focus:outline-none focus:border-[#FFD60A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-[11px] text-text-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#101217] border-white/20 text-[#FFD60A] focus:ring-0 cursor-pointer"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full font-bold mt-2"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In to Workspace'}
            </Button>
          </form>

          <div className="text-center text-xs text-text-muted pt-4 border-t border-white/5">
            Don’t have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#FFD60A] hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
