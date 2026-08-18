import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ResumeUploader } from '../../components/candidate/ResumeUploader';
import { Sparkles, ShieldCheck, Zap, Cpu, Award } from 'lucide-react';

export const CandidateResumeAI = () => {
  return (
    <DashboardLayout
      title="Neural AI Resume Parser & Match Diagnostics"
      subtitle="Extract verified skills, calculate cross-role compatibility, and auto-upgrade your developer profile."
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Intro banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1B1F28] via-[#151820] to-[#101217] border border-[#FFD60A]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFD60A]/15 text-[#FFD60A] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> High-Accuracy Neural Parsing
            </div>
            <h3 className="text-xl font-extrabold text-white">How HR-FLOW Analyzes Resumes</h3>
            <p className="text-xs text-text-muted leading-relaxed max-w-lg">
              Our model inspects technical stacks, calculates active tenure on core frameworks, detects hidden engineering competencies, and benchmarks you against 10,000+ active roles.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-xl font-black text-[#FFD60A]">96.2%</div>
              <div className="text-[10px] text-text-muted font-bold">Extraction Score</div>
            </div>
          </div>
        </div>

        {/* Uploader Core */}
        <ResumeUploader />
      </div>
    </DashboardLayout>
  );
};
