import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { InterviewAssessmentModal } from '../../components/candidate/InterviewAssessmentModal';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  MapPin,
  CheckCircle2,
  ExternalLink,
  User,
  Sparkles,
  Cpu,
} from 'lucide-react';

export const CandidateInterviews = () => {
  const { showToast } = useToast();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);

  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true);
      try {
        const res = await api.get('/interviews/my');
        if (res.data.success) {
          setInterviews(res.data.data.interviews);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  return (
    <DashboardLayout
      title="Scheduled Technical Interviews & Assessments"
      subtitle="View your upcoming rounds, live pair-programming video links, and take AI technical assessments."
    >
      <div className="space-y-6">
        {/* Assessment CTA banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#181B22] via-[#14171E] to-[#101217] border border-[#FFD60A]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFD60A]/15 text-[#FFD60A] text-[11px] font-bold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" /> AI Interview Agent (Agent 2)
            </div>
            <h3 className="text-xl font-extrabold text-white">Live AI Technical Assessment & Scoring</h3>
            <p className="text-xs text-text-muted leading-relaxed max-w-xl">
              Take our interactive technical assessment to benchmark your coding, architectural problem-solving, and system design. Generates a separate verified <strong>Interview Score (/100)</strong> for recruiters.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={Sparkles}
            onClick={() => setAssessmentModalOpen(true)}
            className="shrink-0"
          >
            Launch AI Technical Assessment
          </Button>
        </div>
        {loading ? (
          <div className="py-20 text-center text-text-muted">Loading interview schedules...</div>
        ) : interviews.length === 0 ? (
          <div className="glass-card p-12 text-center border-white/10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#FFD60A]">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No Upcoming Interviews Scheduled</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              When employers shortlist your profile for technical discussions, the meeting invites and calendar links will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {interviews.map((item) => {
              const job = item.jobId || {};
              const company = item.companyId || {};
              const recruiter = item.recruiterId || {};

              return (
                <div key={item._id} className="glass-card p-6 sm:p-8 border-white/10 space-y-6 shadow-xl">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={company.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80'}
                        alt={company.name}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10 p-0.5 bg-[#1B1F28]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#FFD60A] uppercase tracking-wider">{company.name}</span>
                        <h3 className="text-lg font-extrabold text-white">{item.title}</h3>
                        <p className="text-xs text-text-muted">{job.title} • {item.round}</p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 self-start sm:self-auto">
                      Confirmed Call
                    </span>
                  </div>

                  {/* Details row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-[#FFD60A]" />
                      <div>
                        <span className="text-text-muted block text-[10px]">Date & Time</span>
                        <span className="font-bold text-white">{item.scheduledDate} ({item.startTime})</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#38BDF8]" />
                      <div>
                        <span className="text-text-muted block text-[10px]">Estimated Duration</span>
                        <span className="font-bold text-white">{item.durationMinutes} Minutes</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                      <User className="w-4 h-4 text-[#A78BFA]" />
                      <div>
                        <span className="text-text-muted block text-[10px]">Interviewer / Talent Partner</span>
                        <span className="font-bold text-white">{recruiter.name || 'Lead Engineering Manager'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  {item.instructions && (
                    <div className="p-4 rounded-xl bg-[#101217] border border-white/10 text-xs text-text-muted">
                      <span className="font-bold text-white block mb-1">Preparation Note:</span>
                      {item.instructions}
                    </div>
                  )}

                  {/* Video Call CTA */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="text-xs text-text-muted flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                      <span>Calendar invite dispatched to your email address</span>
                    </div>

                    <a
                      href={item.meetingLink || 'https://meet.google.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="primary" size="md" icon={Video}>
                        Join Video Meeting
                      </Button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <InterviewAssessmentModal
        isOpen={assessmentModalOpen}
        onClose={() => setAssessmentModalOpen(false)}
        roleTitle="Full Stack Engineer"
      />
    </DashboardLayout>
  );
};
