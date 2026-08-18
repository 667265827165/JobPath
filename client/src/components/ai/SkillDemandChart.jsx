import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from 'recharts';
import { TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react';

export const SkillDemandChart = ({ trends = [] }) => {
  const chartData = trends.length > 0 ? trends : [
    { name: 'GenAI / LLMs', demandScore: 98, growthRate: 58.4, color: '#FFD60A' },
    { name: 'React / Next', demandScore: 96, growthRate: 24.5, color: '#FFE66D' },
    { name: 'System Design', demandScore: 95, growthRate: 27.3, color: '#38BDF8' },
    { name: 'TypeScript', demandScore: 94, growthRate: 31.2, color: '#22C55E' },
    { name: 'Kubernetes', demandScore: 93, growthRate: 29.4, color: '#A78BFA' },
    { name: 'Node.js', demandScore: 92, growthRate: 19.8, color: '#F472B6' },
    { name: 'AWS Cloud', demandScore: 91, growthRate: 22.1, color: '#FB923C' },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-[#151820] border border-[#FFD60A]/30 rounded-xl shadow-2xl text-xs space-y-1">
          <p className="font-bold text-white">{data.name}</p>
          <p className="text-[#FFD60A]">Demand Index: {data.demandScore}/100</p>
          <p className="text-[#22C55E]">YoY Hiring Growth: +{data.growthRate}%</p>
          {data.avgSalary && <p className="text-text-muted">Avg CTC: {data.avgSalary}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 border-white/10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#FFD60A]" />
            High-Velocity Tech Demand Forecasting (2026 Index)
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Quarterly engineering hiring velocity and compensation trends across Indian tech ecosystems.
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFD60A]/10 text-[#FFD60A] border border-[#FFD60A]/30">
          Live Market Signal
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="name"
              stroke="#A7AFBE"
              tick={{ fontSize: 11, fill: '#A7AFBE' }}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis stroke="#A7AFBE" tick={{ fontSize: 11, fill: '#A7AFBE' }} domain={[60, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="demandScore" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.name.includes('GenAI') || entry.name.includes('React') ? '#FFD60A' : '#1B1F28'}
                  stroke={entry.name.includes('GenAI') || entry.name.includes('React') ? '#FFE66D' : 'rgba(255,255,255,0.15)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Highlights row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5 text-xs">
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <span className="text-text-muted">Top Growth Skill</span>
          <div className="font-bold text-white flex items-center justify-between mt-1">
            <span>GenAI & LLMs</span>
            <span className="text-[#22C55E]">+58.4%</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <span className="text-text-muted">Highest Volume Demand</span>
          <div className="font-bold text-white flex items-center justify-between mt-1">
            <span>React + TypeScript</span>
            <span className="text-[#FFD60A]">96 Index</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <span className="text-text-muted">Highest Avg Package</span>
          <div className="font-bold text-white flex items-center justify-between mt-1">
            <span>Distributed Systems</span>
            <span className="text-[#38BDF8]">₹28L - ₹60L</span>
          </div>
        </div>
      </div>
    </div>
  );
};
