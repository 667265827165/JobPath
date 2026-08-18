import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MatchScore } from '../common/MatchScore';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Building2,
  MapPin,
  Briefcase,
  IndianRupee,
  Bookmark,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const JobCard = ({
  job,
  onSave,
  onApply,
  isSaved = false,
  hasApplied = false,
  showApplyButton = true,
}) => {
  const company = job.companyId || { name: 'Tech Company', logo: '' };

  const formatSalary = (min, max) => {
    if (!min) return 'Competitive CTC';
    const minL = (min / 100000).toFixed(0);
    const maxL = (max / 100000).toFixed(0);
    return `₹${minL}L – ₹${maxL}L`;
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card p-6 flex flex-col justify-between relative group hover:border-[#FFD60A]/30 transition-all duration-300 shadow-xl"
    >
      {/* Top Bar: Company info & Match Badge */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            <img
              src={company.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80'}
              alt={company.name}
              className="w-12 h-12 rounded-xl object-cover border border-white/10 p-0.5 bg-[#1B1F28]"
            />
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-[#FFD60A] transition-colors leading-snug">
                <Link to={`/jobs/${job._id}`}>{job.title}</Link>
              </h3>
              <p className="text-xs text-text-muted font-medium flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-[#FFD60A]" />
                <span>{company.name}</span>
                {job.featured && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#FFD60A]/15 text-[#FFD60A] border border-[#FFD60A]/30 ml-1">
                    Featured
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* AI Match Gauge */}
          <div className="shrink-0">
            <MatchScore score={job.matchScore || 88} size="sm" showLabel={false} />
          </div>
        </div>

        {/* Badges: Location, Work Mode, Experience, Salary */}
        <div className="grid grid-cols-2 gap-2 my-4 text-xs">
          <div className="flex items-center gap-1.5 text-text-muted bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
            <MapPin className="w-3.5 h-3.5 text-[#FFD60A]" />
            <span className="truncate">{job.location} • {job.workMode}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-1.5 rounded-lg border border-[#22C55E]/20 font-bold">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-text-muted bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
            <Briefcase className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>{job.experienceMin}–{job.experienceMax} Years Exp</span>
          </div>

          <div className="flex items-center gap-1.5 text-text-muted bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
            <Calendar className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>{job.jobType}</span>
          </div>
        </div>

        {/* Skills Pills */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {(job.requiredSkills || []).slice(0, 4).map((skill, idx) => (
            <Badge key={idx} variant="default" size="sm">
              {skill}
            </Badge>
          ))}
          {(job.requiredSkills || []).length > 4 && (
            <span className="text-[11px] text-text-muted self-center font-medium">
              +{job.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onSave && (
            <button
              onClick={() => onSave(job._id)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-[#FFD60A]/20 border-[#FFD60A] text-[#FFD60A]'
                  : 'bg-white/5 border-white/10 text-text-muted hover:text-white hover:bg-white/10'
              }`}
              title={isSaved ? 'Saved to bookmarks' : 'Save job'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}
          <Link
            to={`/jobs/${job._id}`}
            className="text-xs font-semibold text-text-muted hover:text-white flex items-center gap-1 px-2.5 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            Details <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {showApplyButton && (
          <div>
            {hasApplied ? (
              <span className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 inline-flex items-center gap-1.5">
                ✓ Applied
              </span>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onApply && onApply(job)}
              >
                Apply Now
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
