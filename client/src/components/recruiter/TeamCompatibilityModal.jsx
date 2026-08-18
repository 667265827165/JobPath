import React from 'react';
import { Modal } from '../common/Modal';
import { MatchScore } from '../common/MatchScore';
import { Button } from '../common/Button';
import { Sparkles, CheckCircle2, ShieldAlert, Cpu, Users, Zap, Clock } from 'lucide-react';

export const TeamCompatibilityModal = ({ isOpen, onClose, candidate, analysis }) => {
  if (!candidate) return null;

  const score = analysis?.overallScore || candidate.teamCompatibilityScore || 87;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Team Compatibility & Skill Gap Analysis" maxWidth="max-w-xl">
      <div className="space-y-6">
        {/* Top summary card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1B1F28] to-[#151820] border border-[#FFD60A]/30 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-text-muted">Candidate Team Synergy</div>
            <h4 className="text-xl font-extrabold text-white mt-0.5">{candidate.name}</h4>
            <p className="text-xs text-[#FFD60A] font-semibold mt-1">
              Estimated Ramp-up Time: {analysis?.speedToProductivity || '2-3 Weeks'}
            </p>
          </div>
          <div className="shrink-0">
            <MatchScore score={score} size="lg" showLabel={false} />
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
            <span className="text-text-muted font-medium">Technical Stack Alignment</span>
            <div className="text-lg font-bold text-[#22C55E] mt-1">94%</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
            <span className="text-text-muted font-medium">Culture & Communication Synergy</span>
            <div className="text-lg font-bold text-[#FFD60A] mt-1">88%</div>
          </div>
        </div>

        {/* Team Skill Gaps Filled */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#22C55E]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Key Engineering Skill Gaps Solved</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(candidate.strongSkills || ['React', 'TypeScript', 'Node.js Architecture']).map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-xs font-semibold text-[#22C55E]"
              >
                + {skill}
              </span>
            ))}
          </div>
        </div>

        {/* AI Recommendation Summary */}
        <div className="p-4 rounded-xl bg-[#101217] border border-white/10 text-xs text-text-muted leading-relaxed">
          <span className="text-white font-bold block mb-1">AI Recommendation Insight:</span>
          {analysis?.recommendationSummary ||
            `Candidate displays strong core technical proficiencies that align directly with high-priority sprint deliverables. High potential for engineering leadership.`}
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Diagnostic
          </Button>
        </div>
      </div>
    </Modal>
  );
};
