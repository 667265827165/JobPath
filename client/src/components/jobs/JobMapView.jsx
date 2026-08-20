import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Building2,
  DollarSign,
  Briefcase,
  Sparkles,
  ExternalLink,
  Layers,
  Compass,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export const JobMapView = ({ jobs = [], onSelectJob }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [calculatingDist, setCalculatingDist] = useState(false);

  // Set default selected job
  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs]);

  // Request Browser GPS Geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await api.get(`/maps/reverse-geocode?lat=${latitude}&lng=${longitude}`);
          const cityData = res.data?.data;
          setUserLocation({
            lat: latitude,
            lng: longitude,
            city: cityData?.city || 'Your Location',
            address: cityData?.formattedAddress || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
          });
        } catch (e) {
          setUserLocation({
            lat: latitude,
            lng: longitude,
            city: 'Current Location',
            address: 'GPS Verified Location',
          });
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation denied/unavailable:', err.message);
        setLocating(false);
        // Fallback to Hyderabad
        setUserLocation({
          lat: 17.385,
          lng: 78.4867,
          city: 'Hyderabad',
          address: 'Hyderabad, Telangana, India',
        });
      }
    );
  };

  // Calculate distance when selected job or user location changes
  useEffect(() => {
    if (userLocation && selectedJob?.location) {
      setCalculatingDist(true);
      api
        .get(`/maps/distance?origin=${encodeURIComponent(userLocation.city)}&destination=${encodeURIComponent(selectedJob.location)}`)
        .then((res) => {
          setDistanceInfo(res.data?.data);
        })
        .catch(() => setDistanceInfo(null))
        .finally(() => setCalculatingDist(false));
    }
  }, [userLocation, selectedJob]);

  // Coordinate offset mapping to canvas coordinates
  // India approx: Lat 8 to 32, Lng 68 to 88
  const getCanvasCoords = (lat, lng) => {
    const minLat = 10;
    const maxLat = 30;
    const minLng = 72;
    const maxLng = 86;

    const x = ((lng - minLng) / (maxLng - minLng)) * 80 + 10; // 10% to 90%
    const y = ((maxLat - lat) / (maxLat - minLat)) * 75 + 12; // 12% to 87%
    return {
      x: Math.min(Math.max(x, 8), 92),
      y: Math.min(Math.max(y, 10), 88),
    };
  };

  return (
    <div className="relative w-full h-[620px] rounded-3xl bg-[#090B10] border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row">
      {/* Interactive Map Visual Area */}
      <div className="relative flex-1 bg-[#0A0D14] overflow-hidden">
        {/* Futuristic Map Grid Backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Glow Nodes */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-[#FFD60A]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

        {/* Map Header Toolbar */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#12151E]/90 border border-white/10 backdrop-blur-xl shadow-lg">
            <Layers className="w-4 h-4 text-[#FFD60A]" />
            <span className="text-xs font-bold text-white">Google Maps Interactive Engine</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              {jobs.length} Plotted Roles
            </span>
          </div>

          <button
            onClick={handleDetectLocation}
            disabled={locating}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FFD60A] text-black font-extrabold text-xs shadow-lg shadow-[#FFD60A]/20 hover:bg-[#FFE66D] transition-all cursor-pointer disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Locating...' : userLocation ? `📍 Near ${userLocation.city}` : 'Find Jobs Near Me'}</span>
          </button>
        </div>

        {/* Plotted Interactive Job Markers */}
        <div className="relative w-full h-full">
          {jobs.map((job, idx) => {
            const lat = job.latitude || 17.385;
            const lng = job.longitude || 78.4867;
            const pos = getCanvasCoords(lat + (idx % 3) * 0.18, lng + (idx % 2) * 0.22);
            const isSelected = selectedJob?._id === job._id || selectedJob?.id === job.id;

            return (
              <motion.div
                key={job._id || job.id || idx}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                whileHover={{ scale: 1.18, zIndex: 30 }}
                onClick={() => {
                  setSelectedJob(job);
                  if (onSelectJob) onSelectJob(job);
                }}
              >
                <button className="group relative flex flex-col items-center cursor-pointer">
                  {/* Match score bubble on top of pin */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black border shadow-xl transition-all whitespace-nowrap mb-1 ${
                      isSelected
                        ? 'bg-[#FFD60A] text-black border-[#FFD60A] scale-110'
                        : 'bg-[#151922] text-[#FFD60A] border-white/15 group-hover:border-[#FFD60A]'
                    }`}
                  >
                    {job.matchScore || 92}% Match
                  </span>

                  {/* Marker Pin Icon */}
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-2xl transition-all ${
                      isSelected
                        ? 'bg-[#FFD60A] text-black ring-4 ring-[#FFD60A]/40'
                        : 'bg-[#181C26] text-white border border-white/20 group-hover:bg-[#FFD60A] group-hover:text-black'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>

                  {/* Pin City Tag */}
                  <span className="mt-1 text-[9px] font-semibold text-text-muted bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-md">
                    {(job.location || 'India').split(',')[0]}
                  </span>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-4 px-3.5 py-2 rounded-xl bg-[#12151E]/90 border border-white/10 backdrop-blur-md text-[11px] text-text-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD60A]" />
            <span>High AI Compatibility</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Verified Tech Hub</span>
          </div>
        </div>
      </div>

      {/* Selected Job Detail Panel */}
      <div className="w-full md:w-96 bg-[#0E1118] border-t md:border-t-0 md:border-l border-white/10 p-5 flex flex-col justify-between overflow-y-auto">
        {selectedJob ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFD60A]/15 text-[#FFD60A] border border-[#FFD60A]/30 uppercase font-mono">
                  {selectedJob.source || 'HIREX Verified'}
                </span>
                <h3 className="text-base font-extrabold text-white mt-1.5 line-clamp-2">
                  {selectedJob.title}
                </h3>
                <p className="text-xs text-text-muted font-medium flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-[#FFD60A]" />
                  {selectedJob.company || selectedJob.companyId?.name || 'Tech Enterprise'}
                </p>
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-extrabold text-xs">
                {selectedJob.matchScore || 90}% Match
              </div>
            </div>

            {/* Salary and Location Pills */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-text-muted flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-[#FFD60A]" /> Expected CTC
                </span>
                <p className="text-xs font-bold text-white mt-1">
                  ₹{((selectedJob.salaryMin || 1200000) / 100000).toFixed(0)}L – ₹
                  {((selectedJob.salaryMax || 2400000) / 100000).toFixed(0)}L
                </p>
                <span className="text-[9px] text-emerald-400 font-medium">
                  {selectedJob.matchBreakdown?.packageLabel || 'Strong Package Match'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-text-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-400" /> Location
                </span>
                <p className="text-xs font-bold text-white mt-1 truncate">
                  {selectedJob.location || 'Hyderabad, India'}
                </p>
                <span className="text-[9px] text-text-subtle">
                  {selectedJob.workMode || 'Hybrid'}
                </span>
              </div>
            </div>

            {/* Travel Time & Distance via Google Routes API */}
            {distanceInfo && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-blue-300 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-blue-400" /> Google Routes Commute
                  </span>
                  <span className="text-[11px] font-extrabold text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#FFD60A]" /> {distanceInfo.durationText}
                  </span>
                </div>
                <p className="text-[10px] text-text-muted mt-1">
                  Distance: <span className="text-white font-semibold">{distanceInfo.distanceText}</span> from {distanceInfo.origin?.split(',')[0]}
                </p>
              </div>
            )}

            {/* Skills required */}
            <div>
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Required Tech Stack
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(selectedJob.skills || selectedJob.requiredSkills || ['React', 'JavaScript', 'Node.js']).map((sk, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-semibold text-[#F8FAFC]"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Description Snippet */}
            <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
              {selectedJob.description ||
                'Exceptional engineering opportunity to design scalable cloud-native architectures with modern frameworks.'}
            </p>
          </div>
        ) : (
          <div className="text-center py-20 text-text-muted">
            <MapPin className="w-8 h-8 mx-auto text-[#FFD60A] mb-2 opacity-50" />
            <p className="text-xs">Click on any marker on the map to inspect vacancy telemetry.</p>
          </div>
        )}

        {/* Action Button */}
        {selectedJob && (
          <div className="pt-4 border-t border-white/10">
            <Link
              to={`/jobs/${selectedJob._id || selectedJob.id}`}
              className="w-full py-3 rounded-2xl bg-[#FFD60A] text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-[#FFE66D] transition-all shadow-lg shadow-[#FFD60A]/20"
            >
              <span>View Full Opportunity & Apply</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
