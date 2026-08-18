import React from 'react';
import { motion } from 'framer-motion';
import { MatchScore } from '../common/MatchScore';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  User,
  MapPin,
  Briefcase,
  Sparkles,
  Calendar,
  CheckCircle2,
  XCircle,
  Cpu,
  Mail,
  Phone,
} from 'lucide-react';

export const CandidateRankingCard = ({
  candidate,
  rank,
  onShortlist,
  onReject,
  onScheduleInterview,
  onViewTeamCompatibility,
}) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card p-6 border-white/10 flex flex-col justify-between relative hover:border-[#FFD60A]/30 transition-all duration-200"
    >
      <div>
        {/* Top Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            {/* Rank badge */}
            <div className="w-8 h-8 rounded-xl bg-[#FFD60A]/15 border border-[#FFD60A]/30 text-[#FFD60A] font-extrabold flex items-center justify-center text-xs shrink-0">
              #{rank}
            </div>

            <img
              src={candidate.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={candidate.name}
              className="w-12 h-12 rounded-full object-cover border border-white/20 shrink-0"
            />

            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {candidate.name}
                <span className="text-[11px] font-semibold text-[#22C55E] bg-[#22C55E]/15 border border-[#22C55E]/30 px-2 py-0.2 rounded-md">
                  {candidate.compatibility || 'Strong Match'}
                </span>
              </h3>
              <p className="text-xs text-text-muted">{candidate.headline}</p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <MatchScore score={candidate.matchScore || 88} size="md" showLabel={true} />
          </div>
        </div>

        {/* Details row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-3 text-xs">
          <div className="flex items-center gap-1.5 text-text-muted bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
            <Briefcase className="w-3.5 h-3.5 text-[#FFD60A]" />
            <span>{candidate.experienceYears || 3}+ Years Experience</span>
          </div>

          <div className="flex items-center gap-1.5 text-text-muted bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
            <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="truncate">{candidate.location || 'Hyderabad'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-text-muted bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
            <Cpu className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Notice: {candidate.noticePeriod || '30 Days'}</span>
          </div>
        </div>

        {/* Skills breakdown */}
        <div className="my-3 space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-text-muted uppercase text-[10px] tracking-wider">Strong Skills:</span>
            <div className="flex flex-wrap gap-1">
              {(candidate.strongSkills || ['React', 'JavaScript', 'Node.js']).map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {candidate.missingSkills && candidate.missingSkills.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-text-muted uppercase text-[10px] tracking-wider">Skills to verify:</span>
              <div className="flex flex-wrap gap-1">
                {candidate.missingSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/5 text-text-muted border border-white/10"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recruiter Actions */}
      <div className="pt-4 mt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewTeamCompatibility(candidate)}
          icon={Cpu}
        >
          Team Fit ({candidate.teamCompatibilityScore || 88}%)
        </Button>

        <div className="flex items-center gap-2">
          {onScheduleInterview && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onScheduleInterview(candidate)}
              icon={Calendar}
            >
              Interview
            </Button>
          )}

          {onShortlist && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onShortlist(candidate)}
              icon={CheckCircle2}
            >
              Shortlist
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
