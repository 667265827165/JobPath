import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { JobCard } from '../components/jobs/JobCard';
import { SkillDemandChart } from '../components/ai/SkillDemandChart';
import api from '../api/axios';
import {
  Search,
  MapPin,
  Sparkles,
  Briefcase,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, compRes] = await Promise.all([
          api.get('/jobs?limit=6'),
          api.get('/companies?limit=8'),
        ]);
        if (jobsRes.data.success) setFeaturedJobs(jobsRes.data.data.jobs);
        if (compRes.data.success) setCompanies(compRes.data.data.companies);
      } catch (err) {
        console.error('Error loading landing data:', err);
      }
    };
    fetchData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle) params.append('search', searchTitle);
    if (searchLocation) params.append('location', searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        {/* Decorative Blurred Gradient Blobs & Particles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD60A]/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-[#38BDF8]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-[#FFE66D]/8 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* AI Badge pill */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#FFD60A]/30 text-xs font-bold text-[#FFD60A] mb-8 shadow-glow-yellow"
          >
            <Sparkles className="w-4 h-4 text-[#FFD60A]" />
            <span>AI-POWERED RECRUITMENT & CAREER ECOSYSTEM 2.0</span>
          </motion.div>

          {/* Master Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]"
          >
            Find the Right Opportunity.{' '}
            <span className="yellow-gradient-text block mt-2">Build the Right Future.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed"
          >
            Discover tech opportunities that precisely match your skills, experience, and career aspirations — powered by neural resume analysis and real-time compatibility scoring.
          </motion.p>

          {/* Search Box */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleHeroSearch}
            className="mt-10 max-w-4xl mx-auto p-2 sm:p-3 rounded-2xl bg-[#151820]/90 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 sm:gap-3"
          >
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-[#08090D]/80 rounded-xl border border-white/5 w-full">
              <Search className="w-5 h-5 text-[#FFD60A] shrink-0" />
              <input
                type="text"
                placeholder="Software Developer, React, Node, AI..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-text-subtle focus:outline-none"
              />
            </div>

            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-[#08090D]/80 rounded-xl border border-white/5 w-full">
              <MapPin className="w-5 h-5 text-[#FFD60A] shrink-0" />
              <input
                type="text"
                placeholder="Hyderabad, Bangalore, Remote..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-text-subtle focus:outline-none"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto shrink-0 font-bold px-8">
              Search Jobs
            </Button>
          </motion.form>

          {/* Quick Search Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-text-muted">
            <span className="font-semibold text-text-subtle">Trending:</span>
            {['React Developer', 'Full Stack', 'Node.js', 'DevOps & AWS', 'Hyderabad', 'Bangalore'].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  if (chip === 'Hyderabad' || chip === 'Bangalore') setSearchLocation(chip);
                  else setSearchTitle(chip);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#FFD60A]/30 text-text-muted hover:text-white transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Animated Statistics */}
      <section className="py-12 border-y border-white/5 bg-[#101217]/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">10K+</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mt-1">Verified Tech Jobs</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#FFD60A]">2K+</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mt-1">Top Tech Companies</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">50K+</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mt-1">Active Candidates</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#22C55E]">95%</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mt-1">AI Match Accuracy</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Discovery */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#FFD60A] flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> High-Compatibility Roles
            </div>
            <h2 className="text-3xl font-extrabold text-white">Featured Tech Vacancies</h2>
          </div>
          <Link to="/jobs">
            <Button variant="outline" size="sm">
              Explore All 10,000+ Jobs <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="py-20 bg-[#101217]/80 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#FFD60A]">Next-Gen Intelligence</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Engineered for Technical Precision</h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Standard job boards look at simple keyword counts. HR-FLOW evaluates deep technical competencies, system design requirements, and squad compatibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-8 border-white/10 space-y-4 hover:border-[#FFD60A]/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#FFD60A]/10 border border-[#FFD60A]/30 text-[#FFD60A] flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Neural Resume Parsing</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Upload your PDF or DOCX resume. Our neural extractor discovers verified skills, calculates exact experience longevity, and auto-builds an investor-ready developer profile.
              </p>
              <Link to="/candidate/resume-ai" className="text-xs font-bold text-[#FFD60A] flex items-center gap-1 hover:underline">
                Try AI Resume Parser <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-8 border-white/10 space-y-4 hover:border-[#FFD60A]/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Match Compatibility Score</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Every vacancy displays a real-time AI Compatibility gauge. View your strong technical overlaps and pinpoint exact skills to brush up on prior to technical interviews.
              </p>
              <Link to="/jobs" className="text-xs font-bold text-[#22C55E] flex items-center gap-1 hover:underline">
                View Matched Roles <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-8 border-white/10 space-y-4 hover:border-[#FFD60A]/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Recruiter AI Ranking & Team Fit</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Employers receive candidate pools ranked by technical synergy, ramp-up speeds, and squad gap analysis, slashing time-to-hire by over 60%.
              </p>
              <Link to="/recruiter/login" className="text-xs font-bold text-[#38BDF8] flex items-center gap-1 hover:underline">
                Employer Dashboard <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top Companies Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-[#FFD60A]">Top Tech Employers</div>
          <h2 className="text-3xl font-extrabold text-white mt-1">Hiring on HR-FLOW</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {companies.map((comp) => (
            <Link
              key={comp._id}
              to={`/companies/${comp._id}`}
              className="glass-card p-5 border-white/10 flex flex-col items-center text-center hover:border-[#FFD60A]/30 transition-all group"
            >
              <img
                src={comp.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80'}
                alt={comp.name}
                className="w-14 h-14 rounded-2xl object-cover border border-white/10 p-1 bg-[#1B1F28] mb-3 group-hover:scale-105 transition-transform"
              />
              <h4 className="text-sm font-bold text-white group-hover:text-[#FFD60A] transition-colors">{comp.name}</h4>
              <p className="text-[11px] text-text-muted mt-0.5">{comp.industry || 'Software'}</p>
              <span className="text-[10px] font-semibold text-[#22C55E] mt-2 bg-[#22C55E]/10 px-2 py-0.5 rounded-full">
                {comp.openJobsCount || 3} Open Roles
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Career Forecasts & Trends Chart Preview */}
      <section className="py-20 bg-[#101217]/50 border-t border-white/5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SkillDemandChart />
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#1B1F28] via-[#151820] to-[#101217] border border-[#FFD60A]/30 p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#FFD60A]/15 border border-[#FFD60A]/30 text-[#FFD60A] flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                Step into Your Next Engineering Chapter
              </h2>
              <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
                Join over 50,000 engineers and 2,000 top companies who have replaced old, noisy job boards with HR-FLOW’s precision intelligence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link to="/register">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold px-8">
                    Create Candidate Profile
                  </Button>
                </Link>
                <Link to="/recruiter/login">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Post a Role as Employer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
