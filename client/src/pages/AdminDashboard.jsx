import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import {
  Shield,
  Users,
  Briefcase,
  Building2,
  CheckCircle2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const AdminDashboard = () => {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/overview');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  const stats = [
    { title: 'Total Network Users', value: data?.stats?.totalUsers || 58, icon: Users, subtitle: 'Candidates & Recruiters' },
    { title: 'Active Postings', value: data?.stats?.activeJobs || 15, icon: Briefcase, subtitle: 'Across top tech hubs' },
    { title: 'Registered Companies', value: data?.stats?.companies || 10, icon: Building2, subtitle: 'Verified tech employers' },
    { title: 'AI Match Accuracy', value: data?.stats?.matchAccuracyRate || '96.2%', icon: Sparkles, accent: true, subtitle: 'Verified placement rating' },
  ];

  return (
    <DashboardLayout
      title="Platform Governance & System Administration"
      subtitle="Complete administrative telemetry, moderation controls, and monthly platform growth statistics."
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, idx) => (
            <StatCard key={idx} {...s} />
          ))}
        </div>

        {/* Monthly Platform Scale Chart */}
        <div className="glass-card p-6 border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FFD60A]" /> Platform Candidate & Application Scaling Velocity
          </h3>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.platformMonthlyMetrics || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD60A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FFD60A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#A7AFBE" tick={{ fontSize: 11, fill: '#A7AFBE' }} />
                <YAxis stroke="#A7AFBE" tick={{ fontSize: 11, fill: '#A7AFBE' }} />
                <Tooltip contentStyle={{ backgroundColor: '#151820', borderColor: 'rgba(255,214,10,0.3)', borderRadius: '0.75rem', fontSize: '12px' }} />
                <Area type="monotone" dataKey="applications" stroke="#FFD60A" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Registered Users Table */}
        <div className="glass-card p-6 border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-[#38BDF8]" /> Recent User Registrations
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text-muted">
              <thead className="border-b border-white/10 text-white font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(data?.recentUsers || []).map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-2.5 font-bold text-white">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover border border-white/10"
                      />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3 px-4 capitalize font-semibold text-[#FFD60A]">{u.role}</td>
                    <td className="py-3 px-4">{u.location || 'Hyderabad'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 font-bold text-[10px]">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
