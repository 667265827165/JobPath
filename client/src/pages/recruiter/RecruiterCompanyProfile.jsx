import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Building2, Globe, MapPin, Sparkles, Check, Save } from 'lucide-react';

export const RecruiterCompanyProfile = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [company, setCompany] = useState({
    name: 'TechNova Labs',
    tagline: 'Architecting next-gen distributed cloud systems and AI infrastructure',
    industry: 'Cloud Infrastructure & AI',
    companySize: '501-1000',
    headquarters: 'Hyderabad, India',
    website: 'https://technovalabs.io',
    description:
      'TechNova Labs is a high-growth deep-tech unicorn building autonomous cloud orchestration and enterprise microservice scaling tools for millions of users globally.',
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      showToast('✓ Employer brand profile updated successfully!', 'success');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      title="Company Brand & Employer Profile"
      subtitle="Customize how prospective engineering candidates experience your company culture and tech stacks."
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <form onSubmit={handleSave} className="glass-card p-8 border-white/10 space-y-6 shadow-2xl">
          <div className="flex items-center gap-4 border-b border-white/10 pb-6">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80"
              alt="Logo"
              className="w-16 h-16 rounded-2xl object-cover border border-white/10 p-1 bg-[#1B1F28]"
            />
            <div>
              <h3 className="text-xl font-extrabold text-white">{company.name}</h3>
              <p className="text-xs text-text-muted">{company.headquarters} • {company.industry}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Company Name</label>
              <input
                type="text"
                value={company.name}
                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Industry Domain</label>
              <input
                type="text"
                value={company.industry}
                onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Tagline</label>
              <input
                type="text"
                value={company.tagline}
                onChange={(e) => setCompany({ ...company, tagline: e.target.value })}
                className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Company Overview</label>
              <textarea
                rows={4}
                value={company.description}
                onChange={(e) => setCompany({ ...company, description: e.target.value })}
                className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Headquarters</label>
              <input
                type="text"
                value={company.headquarters}
                onChange={(e) => setCompany({ ...company, headquarters: e.target.value })}
                className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Website URL</label>
              <input
                type="text"
                value={company.website}
                onChange={(e) => setCompany({ ...company, website: e.target.value })}
                className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <Button type="submit" variant="primary" size="md" loading={saving} icon={Save}>
              Save Brand Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
