import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import api from '../api/axios';
import {
  Building2,
  MapPin,
  Users,
  Star,
  Search,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const CompaniesListPage = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/companies${search ? `?search=${search}` : ''}`);
        if (res.data.success) {
          setCompanies(res.data.data.companies);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [search]);

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Top Tech Employers</h1>
            <p className="text-xs text-text-muted mt-1">Explore engineering cultures, perks, and live vacancies.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search companies by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#151820] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-text-muted">Loading verified companies...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((comp) => (
              <Link
                key={comp._id}
                to={`/companies/${comp._id}`}
                className="glass-card p-6 border-white/10 flex flex-col justify-between hover:border-[#FFD60A]/30 transition-all group shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <img
                      src={comp.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80'}
                      alt={comp.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-white/10 p-1 bg-[#1B1F28] group-hover:scale-105 transition-transform"
                    />
                    <span className="text-xs font-bold text-[#FFD60A] bg-[#FFD60A]/10 px-2 py-0.5 rounded-lg border border-[#FFD60A]/20">
                      ★ {comp.rating || 4.8}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#FFD60A] transition-colors">
                      {comp.name}
                    </h3>
                    <p className="text-xs text-text-muted font-medium mt-0.5 line-clamp-1">{comp.tagline}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#FFD60A]" /> {comp.headquarters}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-[#38BDF8]" /> {comp.companySize}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#22C55E]">
                    {comp.openJobsCount || 3} Open Vacancies
                  </span>
                  <span className="text-xs font-semibold text-text-muted group-hover:text-white flex items-center gap-1">
                    View <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
