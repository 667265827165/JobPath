import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import { LandingPage } from './pages/LandingPage';
import { JobListingsPage } from './pages/JobListingsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { CompaniesListPage } from './pages/CompaniesListPage';
import { CompanyDetailsPage } from './pages/CompanyDetailsPage';
import { InsightsPage } from './pages/InsightsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Candidate Pages
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { CandidateApplications } from './pages/candidate/CandidateApplications';
import { CandidateResumeAI } from './pages/candidate/CandidateResumeAI';
import { CandidateSkillAnalysis } from './pages/candidate/CandidateSkillAnalysis';
import { CandidateInterviews } from './pages/candidate/CandidateInterviews';
import { CandidateSavedJobs } from './pages/candidate/CandidateSavedJobs';

// Recruiter Pages
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { RecruiterPostJob } from './pages/recruiter/RecruiterPostJob';
import { RecruiterManageJobs } from './pages/recruiter/RecruiterManageJobs';
import { RecruiterApplicants } from './pages/recruiter/RecruiterApplicants';
import { RecruiterInterviews } from './pages/recruiter/RecruiterInterviews';
import { RecruiterCompanyProfile } from './pages/recruiter/RecruiterCompanyProfile';
import { RecruiterAnalytics } from './pages/recruiter/RecruiterAnalytics';

// Admin & 404
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

// AI Career Copilot
import { CareerCopilot } from './components/ai/CareerCopilot';

// Route Guards
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090D] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FFD60A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'recruiter') return <Navigate to="/recruiter/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/candidate/dashboard" replace />;
  }

  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090D] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FFD60A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    if (user.role === 'recruiter') return <Navigate to="/recruiter/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/candidate/dashboard" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <>
      <Routes>
      {/* Public Discovery Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/jobs" element={<JobListingsPage />} />
      <Route path="/jobs/:id" element={<JobDetailsPage />} />
      <Route path="/companies" element={<CompaniesListPage />} />
      <Route path="/companies/:id" element={<CompanyDetailsPage />} />
      <Route path="/insights" element={<InsightsPage />} />

      {/* Auth */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/recruiter/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      {/* Candidate Protected Portal */}
      <Route
        path="/candidate/dashboard"
        element={
          <ProtectedRoute allowedRoles={['candidate', 'admin']}>
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/applications"
        element={
          <ProtectedRoute allowedRoles={['candidate', 'admin']}>
            <CandidateApplications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/resume-ai"
        element={
          <ProtectedRoute allowedRoles={['candidate', 'admin']}>
            <CandidateResumeAI />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/skill-analysis"
        element={
          <ProtectedRoute allowedRoles={['candidate', 'admin']}>
            <CandidateSkillAnalysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/interviews"
        element={
          <ProtectedRoute allowedRoles={['candidate', 'admin']}>
            <CandidateInterviews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/saved-jobs"
        element={
          <ProtectedRoute allowedRoles={['candidate', 'admin']}>
            <CandidateSavedJobs />
          </ProtectedRoute>
        }
      />

      {/* Recruiter Protected Portal */}
      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/post-job"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <RecruiterPostJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/manage-jobs"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <RecruiterManageJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/applications"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <RecruiterApplicants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/candidates"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <RecruiterApplicants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/interviews"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <RecruiterInterviews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/company-profile"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <RecruiterCompanyProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/analytics"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <RecruiterAnalytics />
          </ProtectedRoute>
        }
      />

      {/* Admin Portal */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/jobs"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    <CareerCopilot />
    </>
  );
};
