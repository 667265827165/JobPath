import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const MatchScore = ({ score = 85, size = 'md', showLabel = true, showIcon = true }) => {
  const normalized = Math.min(Math.max(score, 0), 100);

  const getColor = (s) => {
    if (s >= 88) return { stroke: '#FFD60A', text: 'text-[#FFD60A]', bg: 'bg-[#FFD60A]/10', label: 'Exceptional Match' };
    if (s >= 75) return { stroke: '#22C55E', text: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10', label: 'Strong Match' };
    if (s >= 60) return { stroke: '#38BDF8', text: 'text-[#38BDF8]', bg: 'bg-[#38BDF8]/10', label: 'Good Match' };
    return { stroke: '#A7AFBE', text: 'text-[#A7AFBE]', bg: 'bg-white/5', label: 'Developing Match' };
  };

  const colorConfig = getColor(normalized);

  if (size === 'badge') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border border-white/10 ${colorConfig.bg} ${colorConfig.text}`}>
        {showIcon && <Sparkles className="w-3.5 h-3.5" />}
        <span>{normalized}% AI Match</span>
      </div>
    );
  }

  // Circular Gauge for Cards & Details
  const radius = size === 'lg' ? 38 : size === 'sm' ? 20 : 28;
  const strokeWidth = size === 'lg' ? 6 : size === 'sm' ? 4 : 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalized / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;

  return (
    <div className="flex items-center gap-3">
      <div className="relative inline-flex items-center justify-center">
        <svg width={svgSize} height={svgSize} className="rotate-[-90deg]">
          {/* Background Ring */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Ring */}
          <motion.circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke={colorConfig.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-black ${size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-xs' : 'text-sm'} ${colorConfig.text}`}>
            {normalized}%
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-text-muted">
            {showIcon && <Sparkles className="w-3 h-3 text-[#FFD60A]" />}
            AI Compatibility
          </div>
          <span className={`text-sm font-bold ${colorConfig.text}`}>{colorConfig.label}</span>
        </div>
      )}
    </div>
  );
};
