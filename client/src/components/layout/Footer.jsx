import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, Terminal, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#08090D] border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFD60A] flex items-center justify-center text-black font-black text-base shadow-md shadow-[#FFD60A]/20">
                ⚡
              </div>
              <span className="font-mono text-xl font-bold tracking-wider text-white">
                HR<span className="text-[#FFD60A]">-FLOW</span>
              </span>
            </Link>
            <p className="text-xs text-text-muted leading-relaxed">
              Next-generation AI recruitment ecosystem uniting elite technical talent with world-class engineering teams.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FFD60A]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Matching Accuracy: 96.2%</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">For Candidates</h4>
            <ul className="space-y-2.5 text-xs text-text-muted">
              <li><Link to="/jobs" className="hover:text-[#FFD60A] transition-colors">Explore Tech Jobs</Link></li>
              <li><Link to="/candidate/resume-ai" className="hover:text-[#FFD60A] transition-colors">AI Resume Parser</Link></li>
              <li><Link to="/candidate/skill-analysis" className="hover:text-[#FFD60A] transition-colors">Skill Radar Diagnostics</Link></li>
              <li><Link to="/insights" className="hover:text-[#FFD60A] transition-colors">Salary & Tech Forecasts</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">For Recruiters</h4>
            <ul className="space-y-2.5 text-xs text-text-muted">
              <li><Link to="/recruiter/post-job" className="hover:text-[#FFD60A] transition-colors">Post a Role</Link></li>
              <li><Link to="/recruiter/candidates" className="hover:text-[#FFD60A] transition-colors">AI Candidate Ranking</Link></li>
              <li><Link to="/recruiter/company-profile" className="hover:text-[#FFD60A] transition-colors">Employer Branding</Link></li>
              <li><Link to="/recruiter/analytics" className="hover:text-[#FFD60A] transition-colors">Hiring Pipeline Analytics</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Popular Hubs</h4>
            <ul className="space-y-2.5 text-xs text-text-muted">
              <li><Link to="/jobs?location=Hyderabad" className="hover:text-white flex items-center justify-between">Hyderabad Jobs <ArrowUpRight className="w-3 h-3 text-[#FFD60A]" /></Link></li>
              <li><Link to="/jobs?location=Bangalore" className="hover:text-white flex items-center justify-between">Bangalore Jobs <ArrowUpRight className="w-3 h-3 text-[#FFD60A]" /></Link></li>
              <li><Link to="/jobs?location=Pune" className="hover:text-white flex items-center justify-between">Pune & Mumbai Jobs <ArrowUpRight className="w-3 h-3 text-[#FFD60A]" /></Link></li>
              <li><Link to="/jobs?workMode=Remote" className="hover:text-white flex items-center justify-between">Remote India <ArrowUpRight className="w-3 h-3 text-[#FFD60A]" /></Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div>© 2026 HR-FLOW Technologies Inc. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-[#22C55E]" /> Enterprise Grade Security</span>
            <span className="text-[#FFD60A]">Midnight & Yellow Theme</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
