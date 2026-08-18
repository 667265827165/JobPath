import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  FileCheck2,
  Sparkles,
  Building2,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { MatchScore } from '../common/MatchScore';

const PIPELINE_STAGES = [
  { id: 'applied', label: 'Applied', icon: FileCheck2 },
  { id: 'under_review', label: 'Under Review', icon: Clock },
  { id: 'shortlisted', label: 'Shortlisted', icon: Sparkles },
  { id: 'interview', label: 'Interview', icon: Calendar },
  { id: 'selected', label: 'Selected / Offer', icon: CheckCircle2 },
];

export const ApplicationTimeline = ({ application }) => {
  const job = application.jobId || {};
  const company = application.companyId || job.companyId || {};
  const currentStatus = application.status || 'applied';

  const getStageIndex = (status) => {
    if (status === 'rejected') return -1;
    return PIPELINE_STAGES.findIndex((s) => s.id === status);
  };

  const activeIndex = getStageIndex(currentStatus);

  return (
    <div className="glass-card p-6 border-white/10 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3.5">
          <img
            src={company.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80'}
            alt={company.name}
            className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-[#1B1F28] p-0.5"
          />
          <div>
            <h3 className="text-base font-bold text-white">{job.title || 'Software Engineer'}</h3>
            <p className="text-xs text-text-muted flex items-center gap-2 mt-0.5">
              <span>{company.name || 'Tech Company'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#FFD60A]" />
                {job.location || 'Hyderabad, India'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MatchScore score={application.matchScore || 88} size="sm" showLabel={false} />
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              currentStatus === 'selected'
                ? 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30'
                : currentStatus === 'rejected'
                ? 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30'
                : currentStatus === 'interview'
                ? 'bg-[#FFD60A]/15 text-[#FFD60A] border-[#FFD60A]/30'
                : 'bg-white/10 text-white border-white/20'
            }`}
          >
            {currentStatus.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Visual Pipeline Bar */}
      {currentStatus !== 'rejected' ? (
        <div className="py-2">
          <div className="relative flex items-center justify-between">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-white/10 z-0" />
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#FFD60A] z-0"
              initial={{ width: '0%' }}
              animate={{ width: `${(activeIndex / (PIPELINE_STAGES.length - 1)) * 100}%` }}
              transition={{ duration: 0.8 }}
            />

            {/* Stages */}
            {PIPELINE_STAGES.map((stage, idx) => {
              const isCompleted = idx <= activeIndex;
              const isCurrent = idx === activeIndex;
              const Icon = stage.icon;

              return (
                <div key={stage.id} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isCurrent
                        ? 'bg-[#FFD60A] text-black border-[#FFD60A] shadow-lg shadow-[#FFD60A]/30 scale-110'
                        : isCompleted
                        ? 'bg-[#151820] text-[#FFD60A] border-[#FFD60A]'
                        : 'bg-[#151820] text-text-subtle border-white/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[11px] font-bold mt-2 whitespace-nowrap ${
                      isCurrent ? 'text-[#FFD60A]' : isCompleted ? 'text-white' : 'text-text-subtle'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Application was not moved forward for this specific role. We encourage exploring other matched vacancies.</span>
        </div>
      )}

      {/* Application Timeline Logs */}
      {application.timeline && application.timeline.length > 0 && (
        <div className="pt-4 border-t border-white/5 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Activity History</h4>
          <div className="space-y-2">
            {application.timeline.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD60A] mt-1.5 shrink-0" />
                <div>
                  <span className="font-semibold text-white capitalize">{item.status?.replace('_', ' ')}</span>: {item.note}
                  <span className="text-[10px] text-text-subtle ml-2">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
