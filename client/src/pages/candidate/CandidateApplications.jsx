import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ApplicationTimeline } from '../../components/candidate/ApplicationTimeline';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { FileCheck2, Search, Sparkles, Filter, Briefcase } from 'lucide-react';

export const CandidateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      try {
        const res = await api.get('/applications/my');
        if (res.data.success) {
          setApplications(res.data.data.applications);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const filteredApps = applications.filter((app) => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  return (
    <DashboardLayout
      title="Application Tracking Pipeline"
      subtitle="Track active recruiter reviews, shortlisted status, and scheduled technical interviews in real time."
    >
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {['all', 'applied', 'under_review', 'shortlisted', 'interview', 'selected'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-[#FFD60A] text-black border-[#FFD60A] shadow-md shadow-[#FFD60A]/20'
                    : 'bg-white/5 text-text-muted border-white/5 hover:text-white hover:bg-white/10'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="text-xs text-text-muted">
            Showing <span className="text-white font-bold">{filteredApps.length}</span> Active Submissions
          </div>
        </div>

        {/* List of Application Pipelines */}
        {loading ? (
          <div className="py-20 text-center text-text-muted">Loading active applications...</div>
        ) : filteredApps.length === 0 ? (
          <div className="glass-card p-12 text-center border-white/10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#FFD60A]">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No Applications in this Stage</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Start applying to verified vacancies matching your skill set to trigger automated pipeline telemetry.
            </p>
            <Link to="/jobs">
              <Button variant="primary" size="sm">
                Explore Matched Jobs
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApps.map((app) => (
              <ApplicationTimeline key={app._id} application={app} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
