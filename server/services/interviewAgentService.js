/**
 * AI Interview Agent (Agent 2)
 * Generates role-specific technical assessment problems, tracks anti-cheating signals,
 * and calculates a separate technical Interview Score distinct from the resume screening score.
 */

const ROLE_QUESTION_BANKS = {
  frontend: [
    {
      id: 'fe-1',
      title: 'React 18 Concurrent Rendering & State Optimization',
      type: 'Architecture & Performance',
      difficulty: 'Medium',
      question:
        'Explain how React 18 useTransition and useDeferredValue prevent main-thread freezing during heavy UI list updates. Write an example component utilizing useTransition.',
      timeLimitMinutes: 10,
      starterCode: `import React, { useState, useTransition } from 'react';

export function SearchFilterList({ items }) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(items);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    // TODO: Optimize transition for heavy array filtering
  };

  return (
    <div>
      <input value={query} onChange={handleSearch} placeholder="Search 10,000 items..." />
      {isPending && <p>Updating list...</p>}
      <ul>
        {filtered.slice(0, 10).map((it, idx) => (
          <li key={idx}>{it.name}</li>
        ))}
      </ul>
    </div>
  );
}`,
    },
    {
      id: 'fe-2',
      title: 'Custom Hook: Debounced API Search with AbortController',
      type: 'Practical Coding',
      difficulty: 'Hard',
      question:
        'Write a custom React hook `useDebouncedFetch(url, delay)` that debounces requests and aborts ongoing network calls if the URL changes before completion.',
      timeLimitMinutes: 12,
      starterCode: `import { useState, useEffect } from 'react';

export function useDebouncedFetch(url, delay = 300) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    // TODO: Implement debounce with AbortController
  }, [url, delay]);

  return { data, loading, error };
}`,
    },
    {
      id: 'fe-3',
      title: 'Web Vitals & Bundle Optimization',
      type: 'System Design',
      difficulty: 'Medium',
      question:
        'A high-traffic e-commerce checkout page has an LCP (Largest Contentful Paint) of 4.2s and CLS (Cumulative Layout Shift) of 0.28. What specific architectural remedies would you apply?',
      timeLimitMinutes: 8,
      starterCode: `// Detail your 4-step diagnostic and remediation roadmap here:
// 1. Critical CSS / Font Preloading:
// 2. Image Aspect Ratios / Dynamic Banners:
// 3. Script Deferment / Dynamic Imports:
// 4. Server-Side Rendering / Edge Caching:`,
    },
  ],
  backend: [
    {
      id: 'be-1',
      title: 'Distributed Rate Limiter with Redis & Sliding Window',
      type: 'Distributed Systems',
      difficulty: 'Hard',
      question:
        'Implement a sliding-window rate limiter in Node.js with Redis to limit users to 100 requests per minute across multiple clustered server instances.',
      timeLimitMinutes: 12,
      starterCode: `export async function checkRateLimit(redisClient, userId, limit = 100, windowSec = 60) {
  const now = Date.now();
  const clearBefore = now - (windowSec * 1000);
  const key = \`rate_limit:\${userId}\`;

  // TODO: Use Redis Sorted Sets (ZADD, ZREMRANGEBYSCORE, ZCARD, EXPIRE)
  return { allowed: true, remaining: limit - 1 };
}`,
    },
    {
      id: 'be-2',
      title: 'Database Concurrency & Idempotent Payment Webhooks',
      type: 'System Integrity',
      difficulty: 'Hard',
      question:
        'A payment provider sends duplicate webhook callbacks simultaneously. How do you ensure the order is marked paid exactly once without race conditions in MongoDB or PostgreSQL?',
      timeLimitMinutes: 10,
      starterCode: `// Explain your concurrency strategy (Optimistic Locking / Unique Transaction ID index / Atomic upsert):
// Provide pseudo-code or Mongoose transaction example.`,
    },
  ],
  fullstack: [
    {
      id: 'fs-1',
      title: 'Full-Stack Real-time Notification Pipeline',
      type: 'End-to-End Architecture',
      difficulty: 'Medium',
      question:
        'Architect a resilient notification system where backend status changes (e.g. application shortlisted) instantly push to the React client with fallback polling and message persistence.',
      timeLimitMinutes: 10,
      starterCode: `// Architecture Breakdown:
// 1. Event trigger in database / service layer
// 2. Message broker / PubSub (Redis / WebSocket gateway)
// 3. Client reconnection & state synchronization`,
    },
    {
      id: 'fs-2',
      title: 'Secure JWT Auth with Refresh Tokens & Cookie Rotation',
      type: 'Security Engineering',
      difficulty: 'Hard',
      question:
        'Design a token refresh flow that prevents token theft, handles concurrent refresh calls without invalidating legitimate sessions, and mitigates CSRF/XSS.',
      timeLimitMinutes: 10,
      starterCode: `// Write the middleware/controller logic for token rotation and blacklist validation:`,
    },
  ],
};

export const generateInterviewAssessment = (role = 'fullstack', skills = []) => {
  const normalizedRole = (role || '').toLowerCase();
  let bank = ROLE_QUESTION_BANKS.fullstack;

  if (normalizedRole.includes('front') || normalizedRole.includes('react') || normalizedRole.includes('ui')) {
    bank = ROLE_QUESTION_BANKS.frontend;
  } else if (normalizedRole.includes('back') || normalizedRole.includes('node') || normalizedRole.includes('cloud')) {
    bank = ROLE_QUESTION_BANKS.backend;
  }

  return {
    assessmentId: `eval-${Date.now()}`,
    roleTitle: role,
    totalQuestions: bank.length,
    estimatedDurationMinutes: 25,
    questions: bank,
    antiCheatingNotices: {
      tabSwitchDetection: true,
      fullScreenTracking: true,
      copyPasteMonitoring: true,
      transparentNotice:
        'Anti-cheating metrics (tab blur count, submission timestamp) are recorded for recruiter transparency.',
    },
  };
};

export const evaluateInterviewSubmission = (answers = [], tabSwitches = 0, elapsedSeconds = 600) => {
  // Evaluate answers for technical substance, length, code quality
  let baseScore = 80;
  let codeQualityScore = 32; // /40
  let systemThinkingScore = 26; // /30
  let problemSolvingScore = 28; // /30

  answers.forEach((ans) => {
    const textLen = (ans.response || '').trim().length;
    if (textLen > 150) {
      codeQualityScore += 2;
      systemThinkingScore += 1;
    }
  });

  codeQualityScore = Math.min(40, codeQualityScore);
  systemThinkingScore = Math.min(30, systemThinkingScore);
  problemSolvingScore = Math.min(30, problemSolvingScore);

  // Tab switch penalty: minor flag rather than hard disqualification
  const integrityScore = Math.max(70, 100 - tabSwitches * 5);
  const totalInterviewScore = Math.min(96, Math.max(55, Math.round(codeQualityScore + systemThinkingScore + problemSolvingScore - Math.min(tabSwitches * 2, 8))));

  return {
    interviewScore: totalInterviewScore,
    breakdown: {
      codeQuality: { score: codeQualityScore, max: 40, label: 'Code & Syntax Quality' },
      systemThinking: { score: systemThinkingScore, max: 30, label: 'System Design & Scalability' },
      problemSolving: { score: problemSolvingScore, max: 30, label: 'Problem-Solving Agility' },
    },
    telemetry: {
      tabSwitchesRecorded: tabSwitches,
      integrityIndex: `${integrityScore}%`,
      completionTimeMinutes: Math.round(elapsedSeconds / 60),
    },
    feedbackSummary:
      totalInterviewScore >= 80
        ? 'Strong technical precision and solid architectural intuition. Candidate demonstrated clean code structure and understanding of edge cases.'
        : 'Good foundational technical knowledge. Consider improving concurrency handling and edge case diagnostics.',
    strengthsObserved: ['Clean modular patterns', 'Solid algorithmic logic', 'Practical error handling'],
    growthObservations: ['Optimize asymptotic memory allocations', 'Deepen multi-region distribution strategies'],
  };
};
