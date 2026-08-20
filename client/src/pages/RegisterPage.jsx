import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import {
  Sparkles,
  User,
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, register, socialLogin } = useAuth();
  const { showToast } = useToast();

  const [role, setRole] = useState('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [headline, setHeadline] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('Hyderabad, India');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'recruiter') navigate('/recruiter/dashboard', { replace: true });
      else if (user.role === 'admin') navigate('/admin/dashboard', { replace: true });
      else navigate('/candidate/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Password strength computation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: 'bg-white/10' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-[#EF4444]' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-[#F59E0B]' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-[#38BDF8]' };
    return { score: 100, label: 'Strong', color: 'bg-[#22C55E]' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      showToast('Please fill all mandatory fields.', 'info');
      return;
    }

    if (trimmedName.length < 2) {
      showToast('Please enter your full name.', 'info');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      showToast('Please enter a valid email address (e.g. name@domain.com).', 'info');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'info');
      return;
    }

    if (!agreeTerms) {
      showToast('Please accept the Terms of Service to continue.', 'info');
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        name: trimmedName,
        email: trimmedEmail.toLowerCase(),
        password,
        role,
        headline: headline || (role === 'candidate' ? 'Full Stack Developer' : 'Talent Acquisition Specialist'),
        companyName: role === 'recruiter' ? companyName || `${trimmedName} Ventures` : undefined,
        location: location || 'Hyderabad, India',
      });

      if (res.success && res.user) {
        showToast('Account created successfully! Welcome to HR-FLOW.', 'success');
        if (role === 'recruiter') navigate('/recruiter/dashboard');
        else navigate('/candidate/dashboard');
      } else {
        showToast(res.message || 'Registration failed. Please try again.', 'error');
      }
    } catch {
      showToast('Unable to complete registration. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    if (loading) return;
    try {
      setLoading(true);
      showToast(`Connecting with ${provider}...`, 'info');
      const res = await socialLogin(provider, role);
      if (res.success && res.user) {
        showToast(`${provider} account linked successfully!`, 'success');
        if (res.user.role === 'recruiter') navigate('/recruiter/dashboard');
        else navigate('/candidate/dashboard');
      } else {
        showToast(res.message || `${provider} authorization failed.`, 'error');
      }
    } catch {
      showToast(`Failed to link ${provider} account.`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Glow */}
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
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Create Your Account</h2>
        <p className="text-xs text-text-muted mt-1">Join the next generation of AI recruitment intelligence</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="glass-card p-6 sm:p-8 border-white/10 shadow-2xl space-y-6">
          {/* Role selector tab */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2">
              Are you registering as:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('candidate')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  role === 'candidate'
                    ? 'bg-[#FFD60A] text-black border-[#FFD60A] shadow-md shadow-[#FFD60A]/20'
                    : 'bg-white/5 text-text-muted border-white/10 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Job Seeker</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  role === 'recruiter'
                    ? 'bg-[#FFD60A] text-black border-[#FFD60A] shadow-md shadow-[#FFD60A]/20'
                    : 'bg-white/5 text-text-muted border-white/10 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Employer / Recruiter</span>
              </button>
            </div>
          </div>

          {/* Social Auth Buttons */}
          <div className="space-y-2 pt-1">
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
            <span className="text-[11px] font-semibold text-text-muted uppercase">or register with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Full Name *</label>
              <div className="relative mt-1.5">
                <User className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder={role === 'candidate' ? 'e.g. Rahul Sharma' : 'e.g. Ananya Deshmukh'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#101217] border border-white/10 rounded-xl text-xs text-white placeholder-text-subtle focus:outline-none focus:border-[#FFD60A]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Email Address *</label>
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

            {role === 'recruiter' && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Company Name *</label>
                <div className="relative mt-1.5">
                  <Building2 className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. TechNova Labs"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#101217] border border-white/10 rounded-xl text-xs text-white placeholder-text-subtle focus:outline-none focus:border-[#FFD60A]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Password *</label>
              <div className="relative mt-1.5">
                <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimum 6 characters"
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

              {/* Password strength meter */}
              {password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-text-muted">Strength</span>
                    <span className="font-bold text-white">{strength.label}</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Primary Location</label>
              <div className="relative mt-1.5">
                <MapPin className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Hyderabad, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#101217] border border-white/10 rounded-xl text-xs text-white placeholder-text-subtle focus:outline-none focus:border-[#FFD60A]"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms-check"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded bg-[#101217] border-white/20 text-[#FFD60A] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="terms-check" className="text-[11px] text-text-muted cursor-pointer">
                I agree to the <span className="text-white hover:underline">Terms of Service</span> and{' '}
                <span className="text-white hover:underline">Privacy Policy</span>
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
              {loading
                ? `Creating ${role === 'candidate' ? 'Candidate' : 'Recruiter'} Profile...`
                : `Create ${role === 'candidate' ? 'Candidate' : 'Recruiter'} Profile`}
            </Button>
          </form>

          <div className="text-center text-xs text-text-muted pt-4 border-t border-white/5">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#FFD60A] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
