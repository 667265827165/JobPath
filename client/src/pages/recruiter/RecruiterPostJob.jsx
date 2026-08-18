import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PostJobWizard } from '../../components/recruiter/PostJobWizard';
import { Sparkles } from 'lucide-react';

export const RecruiterPostJob = () => {
  const navigate = useNavigate();

  const handleCreated = (job) => {
    navigate('/recruiter/manage-jobs');
  };

  return (
    <DashboardLayout
      title="Create & Publish Tech Vacancy"
      subtitle="Complete the 6-step wizard with real-time AI indexing and auto-draft saving."
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <PostJobWizard onJobCreated={handleCreated} />
      </div>
    </DashboardLayout>
  );
};
