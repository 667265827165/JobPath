import React from 'react';
import { Search, MapPin, Briefcase, Filter, RefreshCw, IndianRupee } from 'lucide-react';
import { Button } from '../common/Button';

export const JobFilters = ({ filters, setFilters, onReset }) => {
  const locations = [
    'All Locations',
    'Hyderabad',
    'Bangalore',
    'Pune',
    'Mumbai',
    'Chennai',
    'Delhi NCR',
    'Remote',
  ];

  const workModes = ['All Modes', 'Remote', 'Hybrid', 'On-site'];
  const jobTypes = ['All Types', 'Full-time', 'Part-time', 'Internship', 'Contract'];
  const expBrackets = ['All Experience', '0-2 Years', '3-5 Years', '6-10 Years', '10+ Years'];

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  return (
    <div className="glass-card p-6 border-white/10 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
          <Filter className="w-4 h-4 text-[#FFD60A]" />
          <span>Filters & Refine</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-text-muted hover:text-[#FFD60A] flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Keyword Search */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Keywords / Skills</label>
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="e.g. React, Node, Python, AWS"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#101217] border border-white/10 rounded-xl text-xs text-white placeholder-text-subtle focus:outline-none focus:border-[#FFD60A]/60 transition-colors"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Location</label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={filters.location || 'All Locations'}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]/60 appearance-none cursor-pointer"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc} className="bg-[#151820]">
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Work Mode */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Work Mode</label>
        <div className="grid grid-cols-2 gap-1.5">
          {workModes.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => handleChange('workMode', mode)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left truncate ${
                filters.workMode === mode
                  ? 'bg-[#FFD60A] text-black border-[#FFD60A] shadow-md shadow-[#FFD60A]/20'
                  : 'bg-[#101217] text-text-muted border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Experience Level</label>
        <select
          value={filters.experience || 'All Experience'}
          onChange={(e) => handleChange('experience', e.target.value)}
          className="w-full px-3.5 py-2.5 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]/60 appearance-none cursor-pointer"
        >
          {expBrackets.map((exp) => (
            <option key={exp} value={exp} className="bg-[#151820]">
              {exp}
            </option>
          ))}
        </select>
      </div>

      {/* Job Type */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Job Type</label>
        <select
          value={filters.jobType || 'All Types'}
          onChange={(e) => handleChange('jobType', e.target.value)}
          className="w-full px-3.5 py-2.5 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]/60 appearance-none cursor-pointer"
        >
          {jobTypes.map((type) => (
            <option key={type} value={type} className="bg-[#151820]">
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Minimum CTC / Salary Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold uppercase tracking-wider text-text-muted">Min Salary (INR)</label>
          <span className="font-bold text-[#FFD60A]">
            {filters.minSalary ? `₹${(filters.minSalary / 100000).toFixed(0)} LPA+` : 'Any CTC'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="5000000"
          step="200000"
          value={filters.minSalary || 0}
          onChange={(e) => handleChange('minSalary', Number(e.target.value))}
          className="w-full accent-[#FFD60A] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-text-subtle">
          <span>₹0</span>
          <span>₹25L</span>
          <span>₹50L+</span>
        </div>
      </div>
    </div>
  );
};
