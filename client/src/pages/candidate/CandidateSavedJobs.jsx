import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { JobCard } from '../../components/jobs/JobCard';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Bookmark, Search, ArrowRight } from 'lucide-react';

export const CandidateSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs/saved');
      if (res.data.success) {
        setSavedJobs(res.data.data.jobs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await api.post('/jobs/saved/toggle', { jobId });
      setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout
      title="Saved Bookmarked Jobs"
      subtitle="Quick access to bookmarked roles with live match tracking."
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center text-text-muted">Loading saved bookmarks...</div>
        ) : savedJobs.length === 0 ? (
          <div className="glass-card p-12 text-center border-white/10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#FFD60A]">
              <Bookmark className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No Saved Jobs Yet</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Click the bookmark icon on any job card to save roles you want to research or apply for later.
            </p>
            <Link to="/jobs">
              <Button variant="primary" size="sm">
                Explore Vacancies
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isSaved={true}
                onSave={handleUnsave}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
