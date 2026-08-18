import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { Sparkles, Compass } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#08090D] text-[#F8FAFC] flex flex-col justify-between">
      <Navbar />
      <div className="pt-32 pb-20 text-center px-4 max-w-lg mx-auto space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#FFD60A]/10 border border-[#FFD60A]/30 text-[#FFD60A] flex items-center justify-center mx-auto text-3xl font-black">
          404
        </div>
        <h1 className="text-3xl font-extrabold text-white">Looks like this opportunity doesn't exist.</h1>
        <p className="text-xs text-text-muted">
          The page or job vacancy you are looking for has been relocated, fulfilled, or expired.
        </p>
        <Link to="/jobs">
          <Button variant="primary" size="md">
            Explore Open Tech Jobs
          </Button>
        </Link>
      </div>
      <Footer />
    </div>
  );
};
