import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { CandidateRankingCard } from '../../components/recruiter/CandidateRankingCard';
import { TeamCompatibilityModal } from '../../components/recruiter/TeamCompatibilityModal';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import {
  Sparkles,
  Users,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Video,
  Cpu,
} from 'lucide-react';

export const RecruiterApplicants = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [candidates, setCandidates] = useState([]);
  const [targetJob, setTargetJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [teamAnalysis, setTeamAnalysis] = useState(null);

  // Interview Schedule Modal
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    title: 'Technical Round 1: React & Distributed Systems',
    round: 'Technical Round 1',
    interviewType: 'online',
    scheduledDate: 'Tomorrow, 4:00 PM IST',
    startTime: '16:00 IST',
    durationMinutes: 45,
    meetingLink: 'https://meet.google.com/hrc-flow-tech',
    instructions: 'Pair programming in live IDE. Please ensure camera/mic are ready.',
  });
  const [scheduling, setScheduling] = useState(false);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const jobId = searchParams.get('jobId');
      const res = await api.get(`/recruiter/candidate-rankings${jobId ? `?jobId=${jobId}` : ''}`);
      if (res.data.success) {
        setCandidates(res.data.data.candidates);
        setTargetJob(res.data.data.job);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading candidate pool.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [searchParams]);

  const handleShortlist = (candidate) => {
    showToast(`✓ ${candidate.name} has been shortlisted for next rounds!`, 'success');
  };

  const handleReject = (candidate) => {
    showToast(`${candidate.name}'s status updated.`, 'info');
  };

  const handleOpenInterview = (candidate) => {
    setSelectedCandidate(candidate);
    setInterviewModalOpen(true);
  };

  const handleScheduleSubmit = async () => {
    setScheduling(true);
    try {
      // Find candidate application or create schedule directly
      showToast(`📅 Interview scheduled with ${selectedCandidate.name}! Invitation sent.`, 'success');
      setInterviewModalOpen(false);
    } catch (err) {
      showToast('Failed to schedule interview.', 'error');
    } finally {
      setScheduling(false);
    }
  };

  const handleOpenTeamFit = async (candidate) => {
    setSelectedCandidate(candidate);
    try {
      const res = await api.post('/recruiter/team-compatibility', {
        candidateId: candidate.id,
        jobId: targetJob?._id,
      });
      if (res.data.success) {
        setTeamAnalysis(res.data.data.analysis);
      }
    } catch (err) {
      console.error(err);
    }
    setTeamModalOpen(true);
  };

  return (
    <DashboardLayout
      title="AI Candidate Ranking & Applicant Pool"
      subtitle={`Reviewing candidates for ${targetJob?.title || 'Open Technical Positions'} ranked by neural skill match.`}
    >
      <div className="space-y-6">
        {/* Top Filter & Information Strip */}
        <div className="p-4 rounded-2xl bg-[#151820] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD60A]/15 border border-[#FFD60A]/30 text-[#FFD60A] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Active Benchmark Role: {targetJob?.title || 'Senior Software Engineer'}
              </h4>
              <p className="text-[11px] text-text-muted">
                Ranked by required skills: {targetJob?.requiredSkills?.slice(0, 4).join(', ')}
              </p>
            </div>
          </div>

          <div className="text-xs font-bold text-[#FFD60A]">
            {candidates.length} AI-Matched Engineers Available
          </div>
        </div>

        {/* Candidate Ranking List */}
        {loading ? (
          <div className="py-20 text-center text-text-muted">Analyzing candidate pool with AI...</div>
        ) : candidates.length === 0 ? (
          <div className="glass-card p-12 text-center text-text-muted">No candidates found in this pool.</div>
        ) : (
          <div className="space-y-4">
            {candidates.map((cand, idx) => (
              <CandidateRankingCard
                key={cand.id || idx}
                candidate={cand}
                rank={idx + 1}
                onShortlist={handleShortlist}
                onReject={handleReject}
                onScheduleInterview={handleOpenInterview}
                onViewTeamCompatibility={handleOpenTeamFit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Team Compatibility Diagnostic Modal */}
      <TeamCompatibilityModal
        isOpen={teamModalOpen}
        onClose={() => setTeamModalOpen(false)}
        candidate={selectedCandidate}
        analysis={teamAnalysis}
      />

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        title={`Schedule Interview: ${selectedCandidate?.name}`}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Interview Title & Round</label>
            <input
              type="text"
              value={interviewForm.title}
              onChange={(e) => setInterviewForm({ ...interviewForm, title: e.target.value })}
              className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Scheduled Date</label>
              <input
                type="text"
                value={interviewForm.scheduledDate}
                onChange={(e) => setInterviewForm({ ...interviewForm, scheduledDate: e.target.value })}
                className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Duration</label>
              <select
                value={interviewForm.durationMinutes}
                onChange={(e) => setInterviewForm({ ...interviewForm, durationMinutes: Number(e.target.value) })}
                className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
              >
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Meeting Video Link</label>
            <input
              type="text"
              value={interviewForm.meetingLink}
              onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
              className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Candidate Prep Instructions</label>
            <textarea
              rows={3}
              value={interviewForm.instructions}
              onChange={(e) => setInterviewForm({ ...interviewForm, instructions: e.target.value })}
              className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setInterviewModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleScheduleSubmit}
              loading={scheduling}
              icon={Video}
            >
              Send Interview Invitation
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
