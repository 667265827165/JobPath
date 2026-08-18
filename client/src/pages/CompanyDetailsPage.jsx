import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { JobCard } from '../components/jobs/JobCard';
import { Button } from '../components/common/Button';
import api from '../api/axios';
import {
  Building2,
  MapPin,
  Globe,
  Users,
  ShieldCheck,
  Star,
  ArrowLeft,
  Briefcase,
  Sparkles,
} from 'lucide-react';

export const CompanyDetailsPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [openJobs, setOpenJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/companies/${id}`);
        if (res.data.success) {
          setCompany(res.data.data.company);
          setOpenJobs(res.data.data.openJobs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090D] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FFD60A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-[#08090D] text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold">Company Profile Not Found</h2>
        <Link to="/companies" className="mt-4">
          <Button variant="primary">Browse Top Companies</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F8FAFC]">
      <Navbar />

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/companies"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Top Companies
        </Link>

        {/* Company Header Banner */}
        <div className="glass-card p-8 border-white/10 mb-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={company.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80'}
                alt={company.name}
                className="w-20 h-20 rounded-2xl object-cover border border-white/10 p-1 bg-[#1B1F28]"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{company.name}</h1>
                  {company.verified && <ShieldCheck className="w-5 h-5 text-[#22C55E]" />}
                </div>
                <p className="text-xs text-[#FFD60A] font-semibold">{company.tagline}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted pt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#FFD60A]" /> {company.headquarters}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-[#38BDF8]" /> {company.companySize} Employees</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#FFD60A] font-bold"><Star className="w-3.5 h-3.5 fill-current" /> {company.rating || 4.8} / 5</span>
                </div>
              </div>
            </div>

            {company.website && (
              <a href={company.website} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" icon={Globe}>
                  Visit Website
                </Button>
              </a>
            )}
          </div>

          <div className="pt-4 border-t border-white/5 text-xs sm:text-sm text-text-muted leading-relaxed">
            {company.description}
          </div>
        </div>

        {/* Open Positions List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#FFD60A]" /> Open Technical Positions ({openJobs.length})
            </h3>
          </div>

          {openJobs.length === 0 ? (
            <div className="glass-card p-12 text-center text-text-muted text-xs">
              No active job vacancies published currently for this company.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {openJobs.map((job) => (
                <JobCard key={job._id} job={{ ...job, companyId: company }} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
