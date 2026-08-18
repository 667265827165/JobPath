import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  accent = false,
}) => {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative p-5 rounded-2xl border transition-all duration-300 ${
        accent
          ? 'bg-gradient-to-br from-[#1B1F28] via-[#151820] to-[#151820] border-[#FFD60A]/30 shadow-lg shadow-[#FFD60A]/5'
          : 'bg-[#151820]/80 backdrop-blur-xl border-white/5 hover:border-white/15'
      }`}
    >
      <div className="flex items-center justify-between gap-4 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${accent ? 'bg-[#FFD60A]/15 text-[#FFD60A]' : 'bg-white/5 text-white/70'}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <div className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${accent ? 'text-[#FFD60A]' : 'text-white'}`}>
          {value}
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${
              trendPositive ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-[#EF4444]/15 text-[#EF4444]'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-text-muted mt-2 leading-relaxed">{subtitle}</p>}
    </motion.div>
  );
};
