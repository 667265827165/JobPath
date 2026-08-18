import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SkillDemandChart } from '../components/ai/SkillDemandChart';
import api from '../api/axios';
import {
  TrendingUp,
  IndianRupee,
  MapPin,
  Sparkles,
  ArrowUpRight,
  Briefcase,
  Layers,
} from 'lucide-react';

export const InsightsPage = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarket = async () => {
      setLoading(true);
      try {
        const res = await api.get('/analytics/market-insights');
        if (res.data.success) {
          setMarketData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarket();
  }, []);

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FFD60A] flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4" /> 2026 Tech Market Intelligence
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Engineering Demand & Compensation Benchmarks
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-2xl">
            Real-time telemetry aggregated across 10,000+ active Indian tech vacancies, salary spreads, and fast-rising tech domains.
          </p>
        </div>

        {/* Skill Forecasting Chart */}
        <SkillDemandChart trends={marketData?.trends || []} />

        {/* Role Demand & Salary Spread */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-6 sm:p-8 border-white/10 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#FFD60A]" /> Highest-Growth Software Engineering Roles
            </h3>
            <div className="space-y-3">
              {(marketData?.roleDemand || [
                { role: 'Full Stack Engineer', openJobs: 4200, growth: '+32%', avgSalary: '₹22 LPA' },
                { role: 'Backend / Distributed Systems', openJobs: 3600, growth: '+35%', avgSalary: '₹28 LPA' },
                { role: 'GenAI & LLM Engineer', openJobs: 1900, growth: '+64%', avgSalary: '₹34 LPA' },
                { role: 'DevOps / SRE Specialist', openJobs: 2400, growth: '+22%', avgSalary: '₹24 LPA' },
              ]).map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.role}</h4>
                    <span className="text-[11px] text-text-muted">{item.openJobs} active vacancies</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#22C55E] block">{item.growth} YoY</span>
                    <span className="text-[11px] text-[#FFD60A] font-semibold">{item.avgSalary}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Hubs */}
          <div className="glass-card p-6 sm:p-8 border-white/10 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#38BDF8]" /> Tech Hub Opportunity & CTC Distribution
            </h3>
            <div className="space-y-3">
              {(marketData?.locationHubs || [
                { location: 'Bangalore', activeJobs: 5620, avgSalary: '₹23.0 LPA', growth: '+29%' },
                { location: 'Hyderabad', activeJobs: 3840, avgSalary: '₹19.5 LPA', growth: '+24%' },
                { location: 'Pune', activeJobs: 2150, avgSalary: '₹17.8 LPA', growth: '+18%' },
                { location: 'Remote India', activeJobs: 3100, avgSalary: '₹22.5 LPA', growth: '+41%' },
              ]).map((hub, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#38BDF8]" /> {hub.location}
                    </h4>
                    <span className="text-[11px] text-text-muted">{hub.activeJobs} positions</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">{hub.avgSalary} Avg</span>
                    <span className="text-[11px] text-[#22C55E] font-semibold">{hub.growth} demand</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
