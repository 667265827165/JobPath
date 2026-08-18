import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import {
  Sparkles,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Code2,
  Cpu,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  X,
  Award,
  Maximize2,
} from 'lucide-react';

export const InterviewAssessmentModal = ({ isOpen, onClose, roleTitle = 'Full Stack Engineer' }) => {
  const { showToast } = useToast();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [tabSwitches, setTabSwitches] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Tab blur / switch detection for anti-cheating tracking
  useEffect(() => {
    if (!isOpen || result) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => {
          const next = prev + 1;
          showToast(`⚠️ Tab switch detected (${next}). Please remain on the assessment window.`, 'warning');
          return next;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isOpen, result]);

  // Assessment countdown timer
  useEffect(() => {
    if (!isOpen || result || loading) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, result, loading]);

  // Load assessment problems from AI Interview Agent
  useEffect(() => {
    if (!isOpen) return;

    const fetchAssessment = async () => {
      setLoading(true);
      setResult(null);
      setTabSwitches(0);
      setSecondsRemaining(25 * 60);
      try {
        const res = await api.get(`/interviews/assessment?role=${encodeURIComponent(roleTitle)}`);
        if (res.data.success) {
          const data = res.data.data.assessment;
          setAssessment(data);
          // Pre-populate with starter codes
          const initial = {};
          data.questions.forEach((q, idx) => {
            initial[idx] = q.starterCode || '';
          });
          setAnswers(initial);
        }
      } catch (err) {
        console.error(err);
        showToast('Failed to load assessment questions from AI Interview Agent.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [isOpen, roleTitle]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleAnswerChange = (text) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: text }));
  };

  const handleSubmitAssessment = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const formattedAnswers = assessment.questions.map((q, idx) => ({
        questionId: q.id,
        title: q.title,
        response: answers[idx] || '',
      }));

      const elapsed = 25 * 60 - secondsRemaining;
      const res = await api.post('/interviews/submit-assessment', {
        answers: formattedAnswers,
        tabSwitches,
        elapsedSeconds: elapsed,
      });

      if (res.data.success) {
        setResult(res.data.data.evaluation);
        showToast('Assessment evaluated by AI Interview Agent!', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to submit assessment.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentQ = assessment?.questions?.[currentIndex];
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0F1117] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#151820]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD60A]/15 border border-[#FFD60A]/30 flex items-center justify-center text-[#FFD60A]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">AI Interview Agent — Live Assessment</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFD60A]/10 text-[#FFD60A] border border-[#FFD60A]/30 font-bold uppercase">
                  {roleTitle}
                </span>
              </div>
              <p className="text-[11px] text-text-muted">Separate AI Technical Evaluation (Distinct from Resume Score)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!result && (
              <>
                <button
                  onClick={handleFullscreen}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                </button>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#101217] border border-white/10 text-xs font-mono font-bold text-white">
                  <Clock className="w-4 h-4 text-[#FFD60A]" />
                  <span>{formatTime(secondsRemaining)}</span>
                </div>

                {tabSwitches > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 text-xs font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Tab switches: {tabSwitches}</span>
                  </div>
                )}
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-text-muted hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-[#FFD60A] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-text-muted font-bold">AI Interview Agent generating custom technical problems...</p>
            </div>
          ) : result ? (
            /* Results Screen */
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#181B22] to-[#12141A] border border-[#FFD60A]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Assessment Completed & Verified
                  </div>
                  <h3 className="text-2xl font-black text-white">Interview Agent Technical Score</h3>
                  <p className="text-xs text-text-muted max-w-lg leading-relaxed">{result.feedbackSummary}</p>
                </div>

                <div className="shrink-0 text-center p-4 bg-black/40 rounded-2xl border border-[#FFD60A]/30 min-w-[140px]">
                  <div className="text-3xl font-black text-[#FFD60A]">{result.interviewScore}/100</div>
                  <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider mt-1">Interview Score</div>
                </div>
              </div>

              {/* Sub-scores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(result.breakdown || {}).map(([key, item]) => (
                  <div key={key} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="text-xs font-semibold text-text-muted">{item.label}</div>
                    <div className="text-xl font-bold text-white">
                      {item.score} <span className="text-xs text-text-muted font-normal">/ {item.max}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FFD60A] rounded-full"
                        style={{ width: `${(item.score / item.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Strengths and Growth */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#22C55E]/5 border border-[#22C55E]/20 space-y-2">
                  <h4 className="font-bold text-[#22C55E] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Observed Technical Strengths
                  </h4>
                  <ul className="list-disc list-inside text-text-muted space-y-1">
                    {(result.strengthsObserved || []).map((s, idx) => (
                      <li key={idx} className="text-white/90">{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#FFD60A]/5 border border-[#FFD60A]/20 space-y-2">
                  <h4 className="font-bold text-[#FFD60A] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Architectural Growth Opportunities
                  </h4>
                  <ul className="list-disc list-inside text-text-muted space-y-1">
                    {(result.growthObservations || []).map((g, idx) => (
                      <li key={idx} className="text-white/90">{g}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="primary" size="md" onClick={onClose}>
                  Done & Return to Interviews
                </Button>
              </div>
            </motion.div>
          ) : (
            /* Active Question Screen */
            <div className="space-y-5">
              {/* Question selector tabs */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                {assessment?.questions?.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      currentIndex === idx
                        ? 'bg-[#FFD60A] text-black shadow-md shadow-[#FFD60A]/20'
                        : answers[idx] && answers[idx].trim().length > 30
                        ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30'
                        : 'bg-white/5 text-text-muted hover:text-white border border-white/10'
                    }`}
                  >
                    <span>Problem {idx + 1}</span>
                    {answers[idx] && answers[idx].trim().length > 30 && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                ))}
              </div>

              {/* Current Question Info */}
              {currentQ && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 uppercase">
                          {currentQ.type}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#A78BFA]/10 text-[#A78BFA] border border-[#A78BFA]/30 uppercase">
                          {currentQ.difficulty}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1.5">{currentQ.title}</h4>
                    </div>
                    <span className="text-xs text-text-muted font-mono font-bold">~{currentQ.timeLimitMinutes} mins</span>
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed p-4 rounded-xl bg-[#101217] border border-white/10">
                    <strong className="text-white block mb-1">Problem Statement:</strong>
                    {currentQ.question}
                  </p>

                  {/* Code / Solution Editor */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span className="flex items-center gap-1.5 font-bold text-white">
                        <Code2 className="w-4 h-4 text-[#FFD60A]" /> Code Implementation & Rationale
                      </span>
                      <span className="font-mono text-[11px]">Auto-saved locally</span>
                    </div>

                    <textarea
                      rows={10}
                      value={answers[currentIndex] || ''}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      placeholder="Write your production code and architectural rationale here..."
                      className="w-full p-4 bg-[#08090D] border border-white/15 rounded-2xl text-xs font-mono text-[#F8FAFC] placeholder-text-subtle focus:outline-none focus:border-[#FFD60A] leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Navigation and Submit */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  icon={ChevronLeft}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-3">
                  {currentIndex < (assessment?.questions?.length || 0) - 1 ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setCurrentIndex((prev) => prev + 1)}
                    >
                      Next Problem →
                    </Button>
                  ) : null}

                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSubmitAssessment}
                    loading={submitting}
                    disabled={submitting}
                    icon={Sparkles}
                  >
                    {submitting ? 'Evaluating Assessment...' : 'Submit Final Assessment'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
