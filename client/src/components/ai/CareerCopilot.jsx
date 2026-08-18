import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Zap,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Minimize2,
  RefreshCw,
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'Which jobs suit me?',
  'What skills am I missing?',
  'Improve my resume',
  'Prepare me for a React interview',
  'Give me a 3-month learning roadmap',
];

export const CareerCopilot = () => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I'm your HR-FLOW Career Copilot ⚡. I can help benchmark your skills, recommend matching vacancies, improve your resume, and create a targeted learning roadmap. How can I assist your career journey today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const generateAIResponse = async (userPrompt) => {
    const prompt = userPrompt.toLowerCase();
    const candidateSkills = user?.profile?.skills?.map((s) => s.name) || ['React', 'JavaScript', 'Node.js', 'MongoDB'];
    const skillsListStr = candidateSkills.join(', ');

    // Realistic contextual AI logic powered by verified candidate stack
    if (prompt.includes('job') && (prompt.includes('suit') || prompt.includes('which') || prompt.includes('recommend'))) {
      return `Based on your verified skills in **${skillsListStr}**, you are an exceptional match for:
• **Senior Frontend Developer (React & TypeScript)** at *TechNova Labs* (94% Match)
• **Full Stack Engineer (Payments)** at *Razorpay Infra* (88% Match)
• **React Specialist** at *CRED Core* (91% Match)

Would you like to review application requirements or practice interview questions for these roles?`;
    }

    if (prompt.includes('missing') || prompt.includes('skill') || prompt.includes('gap')) {
      return `### 🔍 Skill Gap & Market Diagnostics:
Your core foundation in **${skillsListStr}** is strong. However, top Indian unicorns currently prioritize:

1. **System Design & Distributed Caching (Redis/Kafka)** — +24% salary premium
2. **AWS Cloud Architecture & EKS Orchestration** — Unlocks Staff Engineer bands
3. **TypeScript Strict Typing** — Recommended for 90%+ modern codebases

Investing 3–4 weeks in distributed system patterns will significantly boost recruiter shortlist conversions.`;
    }

    if (prompt.includes('resume') || prompt.includes('improve')) {
      return `### 📄 3 High-Impact Resume Upgrades:
1. **Quantify Engineering Impact:** Instead of *"Built React frontend"*, write *"Architected React 18 component design system, reducing initial bundle size by 38% and optimizing LCP to 1.1s"*.
2. **Highlight Cloud & Production Deployments:** Link live GitHub repositories with automated CI/CD workflows (Docker / GitHub Actions).
3. **Tailor Keywords:** Ensure your headline explicitly lists your primary stack (e.g. *Senior Full Stack Engineer | React, Node.js, PostgreSQL*).`;
    }

    if (prompt.includes('interview') || prompt.includes('react') || prompt.includes('prepare')) {
      return `### 🎯 React Technical Interview Prep:
Key topics hiring managers test for your seniority level:
• **Concurrent Rendering & Transitions:** When to use \`useTransition\` vs \`useDeferredValue\`.
• **Custom Hook Architecture:** Writing resilient \`AbortController\` cancellation hooks.
• **State Management Tradeoffs:** Zustand vs Redux Toolkit vs React Query for server cache.

You can also test these in our **Live AI Technical Assessment** under your Interviews portal!`;
    }

    if (prompt.includes('roadmap') || prompt.includes('month') || prompt.includes('learning')) {
      return `### 🗺️ 3-Month Accelerated Career Roadmap:

**Month 1: Modern Cloud & Containers**
• Docker containerization & multi-stage builds.
• Deploying Node.js microservices to AWS ECS / EKS.

**Month 2: High-Scale System Design**
• Event-driven architecture with Apache Kafka.
• Multi-tier caching with Redis & database read replicas.

**Month 3: Production Portfolio & Assessment**
• Build and open-source a full-stack real-time platform.
• Complete the HR-FLOW AI Technical Assessment to earn recruiter verification badges.`;
    }

    return `I analyzed your query regarding **"${userPrompt}"** alongside your profile context (${skillsListStr}). 

To maximize your hiring rate on HR-FLOW, maintain an updated resume screening score, practice role-tailored technical assessments, and apply early to high-compatibility vacancies. Is there a specific role or company you'd like guidance on?`;
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMessage = {
      sender: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI inference delay
    setTimeout(async () => {
      const reply = await generateAIResponse(text);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: reply,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Copilot Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#FFD60A] to-[#FFE66D] text-black font-extrabold text-xs shadow-2xl shadow-[#FFD60A]/30 border border-[#FFD60A] group"
          >
            <div className="w-5 h-5 rounded-lg bg-black/10 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-black animate-pulse" />
            </div>
            <span>AI Career Copilot ✦</span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
          </motion.button>
        )}
      </div>

      {/* Floating Chat Modal Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-[#0F1117]/95 border border-white/15 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col h-[560px]"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#151820]/90">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFD60A] flex items-center justify-center text-black font-black text-sm shadow-md shadow-[#FFD60A]/20">
                  ⚡
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    HR-FLOW Career Copilot
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FFD60A]/15 text-[#FFD60A] border border-[#FFD60A]/30 uppercase font-mono">
                      Fresher AI
                    </span>
                  </h3>
                  <p className="text-[10px] text-text-muted">Context-aware developer guidance & roadmaps</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-[#FFD60A]/15 border border-[#FFD60A]/30 flex items-center justify-center text-[#FFD60A] shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[82%] ${
                      msg.sender === 'user'
                        ? 'bg-[#FFD60A] text-black font-semibold rounded-tr-sm shadow-md'
                        : 'bg-[#181B22] border border-white/10 text-[#F8FAFC] rounded-tl-sm shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        msg.sender === 'user' ? 'text-black/60' : 'text-text-muted'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <div className="w-7 h-7 rounded-lg bg-[#FFD60A]/15 border border-[#FFD60A]/30 flex items-center justify-center text-[#FFD60A] shrink-0">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <span className="italic">Copilot analyzing career telemetry...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 border-t border-white/5 bg-[#12141A]/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#FFD60A]/10 border border-white/10 hover:border-[#FFD60A]/40 text-[10px] text-text-muted hover:text-[#FFD60A] font-semibold whitespace-nowrap transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-white/10 bg-[#151820] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about jobs, skill gaps, interviews, roadmaps..."
                className="flex-1 px-3.5 py-2.5 bg-[#0A0C10] border border-white/10 rounded-xl text-xs text-white placeholder-text-subtle focus:outline-none focus:border-[#FFD60A]"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="p-2.5 rounded-xl bg-[#FFD60A] hover:bg-[#FFE66D] disabled:opacity-40 text-black font-bold transition-all shadow-md shadow-[#FFD60A]/20 cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
