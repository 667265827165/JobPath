import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import {
  Briefcase,
  IndianRupee,
  Cpu,
  FileText,
  Eye,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Save,
} from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Job Information', icon: Briefcase },
  { id: 2, name: 'Compensation', icon: IndianRupee },
  { id: 3, name: 'Skills & Tech', icon: Cpu },
  { id: 4, name: 'Description & Scope', icon: FileText },
  { id: 5, name: 'Review & Preview', icon: Eye },
  { id: 6, name: 'Publish', icon: CheckCircle2 },
];

export const PostJobWizard = ({ onJobCreated }) => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('hrflow_postjob_draft');
    return saved
      ? JSON.parse(saved)
      : {
          title: 'Senior Full Stack Engineer',
          department: 'Core Engineering',
          jobType: 'Full-time',
          workMode: 'Hybrid',
          experienceMin: 3,
          experienceMax: 6,
          location: 'Hyderabad, India',
          salaryMin: 1800000,
          salaryMax: 3000000,
          currency: 'INR',
          benefits: 'Comprehensive Health Cover, Hybrid Work Schedule, Learning Stipend ₹1.5L',
          requiredSkills: 'React, TypeScript, Node.js, PostgreSQL, AWS',
          preferredSkills: 'Next.js, Docker, Microservices, Redis',
          description:
            'We are seeking an ambitious Senior Full Stack Engineer to lead architecture across customer-facing web apps and high-throughput backend services.',
          responsibilities:
            'Design scalable React and TypeScript UI components\nBuild modular REST/GraphQL microservices in Node.js\nOptimize database performance and caching strategies\nLead code reviews and mentor junior engineering colleagues',
          requirements:
            '3-6 years of production web development experience\nStrong expertise in React, TypeScript, and modern state architectures\nProficiency in backend API design and SQL databases',
        };
  });

  // Autosave Draft
  useEffect(() => {
    localStorage.setItem('hrflow_postjob_draft', JSON.stringify(formData));
  }, [formData]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePublish = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map((s) => s.trim()),
        preferredSkills: formData.preferredSkills.split(',').map((s) => s.trim()),
        responsibilities: formData.responsibilities.split('\n').filter(Boolean),
        requirements: formData.requirements.split('\n').filter(Boolean),
        benefits: formData.benefits.split(',').map((s) => s.trim()),
      };

      const res = await api.post('/jobs', payload);
      if (res.data.success) {
        showToast('🚀 Job Vacancy Published Successfully!', 'success');
        localStorage.removeItem('hrflow_postjob_draft');
        if (onJobCreated) onJobCreated(res.data.data.job);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to publish job vacancy.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 border-white/10 space-y-8">
      {/* Wizard Steps Navigation Bar */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div
                key={step.id}
                onClick={() => isCompleted && setCurrentStep(step.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isCurrent
                    ? 'bg-[#FFD60A] text-black shadow-lg shadow-[#FFD60A]/20'
                    : isCompleted
                    ? 'bg-white/5 text-[#FFD60A] border border-[#FFD60A]/30'
                    : 'text-text-subtle'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>
                  STEP {step.id}: {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Step Forms */}
      <div>
        {currentStep === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-lg font-bold text-white">Step 1: Job Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Job Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => updateField('department', e.target.value)}
                  className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Job Type</label>
                <select
                  value={formData.jobType}
                  onChange={(e) => updateField('jobType', e.target.value)}
                  className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Work Mode</label>
                <select
                  value={formData.workMode}
                  onChange={(e) => updateField('workMode', e.target.value)}
                  className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Min Exp (Yrs)</label>
                  <input
                    type="number"
                    value={formData.experienceMin}
                    onChange={(e) => updateField('experienceMin', Number(e.target.value))}
                    className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Max Exp (Yrs)</label>
                  <input
                    type="number"
                    value={formData.experienceMax}
                    onChange={(e) => updateField('experienceMax', Number(e.target.value))}
                    className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-lg font-bold text-white">Step 2: Compensation & Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Min Salary (INR / Annum)</label>
                <input
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => updateField('salaryMin', Number(e.target.value))}
                  placeholder="e.g. 1800000 (18 LPA)"
                  className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Max Salary (INR / Annum)</label>
                <input
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => updateField('salaryMax', Number(e.target.value))}
                  placeholder="e.g. 3000000 (30 LPA)"
                  className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Benefits & Perks (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.benefits}
                  onChange={(e) => updateField('benefits', e.target.value)}
                  className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-lg font-bold text-white">Step 3: Skills & AI Compatibility Index</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Required Core Skills * (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.requiredSkills}
                  onChange={(e) => updateField('requiredSkills', e.target.value)}
                  placeholder="e.g. React, TypeScript, Node.js, PostgreSQL"
                  className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Preferred / Nice-to-Have Skills (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.preferredSkills}
                  onChange={(e) => updateField('preferredSkills', e.target.value)}
                  placeholder="e.g. AWS, Docker, Kubernetes, GraphQL"
                  className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-lg font-bold text-white">Step 4: Role Description & Responsibilities</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Overview / Summary</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Key Responsibilities (One per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.responsibilities}
                  onChange={(e) => updateField('responsibilities', e.target.value)}
                  className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Requirements & Qualifications (One per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.requirements}
                  onChange={(e) => updateField('requirements', e.target.value)}
                  className="w-full mt-1.5 p-3 bg-[#101217] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD60A]"
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 5 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#FFD60A]" />
              Step 5: Review Job Vacancy Preview
            </h3>
            <div className="p-6 rounded-2xl bg-[#101217] border border-white/10 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xl font-extrabold text-white">{formData.title}</h4>
                  <p className="text-xs text-text-muted mt-0.5">
                    {formData.location} • {formData.workMode} • {formData.jobType} • {formData.experienceMin}–{formData.experienceMax} Yrs Exp
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-[#22C55E]">
                    ₹{(formData.salaryMin / 100000).toFixed(0)}L – ₹{(formData.salaryMax / 100000).toFixed(0)}L CTC
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="text-xs font-bold uppercase text-text-muted">Required Skills:</div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.requiredSkills.split(',').map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-[#FFD60A]/10 text-[#FFD60A] border border-[#FFD60A]/30">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-1">
                <div className="text-xs font-bold uppercase text-text-muted">Overview:</div>
                <p className="text-xs text-text-muted leading-relaxed">{formData.description}</p>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 6 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FFD60A]/15 border border-[#FFD60A]/30 text-[#FFD60A] flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">Ready to Go Live!</h3>
            <p className="text-xs text-text-muted max-w-md mx-auto">
              Your vacancy will immediately be matched across top candidates in India with AI compatibility scoring.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handlePublish}
              loading={submitting}
              icon={CheckCircle2}
            >
              Publish Job Vacancy Now
            </Button>
          </motion.div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-white/10">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
          icon={ChevronLeft}
        >
          Previous Step
        </Button>

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Save className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>Autosaved draft</span>
        </div>

        {currentStep < 6 && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 6))}
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};
