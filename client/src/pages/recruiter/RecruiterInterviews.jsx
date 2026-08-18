import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import { Calendar, Clock, Video, User, CheckCircle2, MessageSquare } from 'lucide-react';

export const RecruiterInterviews = () => {
  const { showToast } = useToast();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

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
      title="Interviews & Candidate Evaluations"
      subtitle="Manage all upcoming engineering rounds, live video links, and feedback logs."
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center text-text-muted">Loading schedules...</div>
        ) : interviews.length === 0 ? (
          <div className="glass-card p-12 text-center text-text-muted">No interviews scheduled yet.</div>
        ) : (
          <div className="space-y-4">
            {interviews.map((item) => (
              <div key={item._id} className="glass-card p-6 border-white/10 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.candidateId?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={item.candidateId?.name}
                      className="w-12 h-12 rounded-full object-cover border border-white/20"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white">{item.candidateId?.name}</h3>
                      <p className="text-xs text-text-muted">{item.jobId?.title} • {item.round}</p>
                    </div>
                  </div>

                  <a href={item.meetingLink || 'https://meet.google.com'} target="_blank" rel="noreferrer">
                    <Button variant="primary" size="sm" icon={Video}>
                      Launch Meeting Call
                    </Button>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-text-muted block text-[10px]">Date & Time</span>
                    <span className="font-bold text-white">{item.scheduledDate} ({item.startTime})</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-text-muted block text-[10px]">Duration</span>
                    <span className="font-bold text-white">{item.durationMinutes} Minutes</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-text-muted block text-[10px]">Meeting URL</span>
                    <span className="font-bold text-[#FFD60A] truncate block">{item.meetingLink}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
