export const calculateJobMatch = (candidateSkills = [], candidateExp = 0, job) => {
  const candidateSkillNames = candidateSkills.map(s => (typeof s === 'string' ? s : s.name).toLowerCase().trim());
  const requiredSkills = (job.requiredSkills || []).map(s => s.toLowerCase().trim());
  const preferredSkills = (job.preferredSkills || []).map(s => s.toLowerCase().trim());

  let matchedRequiredCount = 0;
  const strongSkills = [];
  const missingSkills = [];

  for (const skill of job.requiredSkills || []) {
    const isMatched = candidateSkillNames.some(cs => cs === skill.toLowerCase().trim() || cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs));
    if (isMatched) {
      matchedRequiredCount++;
      strongSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  // Bonus for preferred skills
  let preferredMatchedCount = 0;
  for (const pSkill of job.preferredSkills || []) {
    if (candidateSkillNames.some(cs => cs === pSkill.toLowerCase().trim())) {
      preferredMatchedCount++;
      if (!strongSkills.includes(pSkill)) strongSkills.push(pSkill);
    }
  }

  // Experience calculation
  const minExp = job.experienceMin || 0;
  const expMatch = candidateExp >= minExp;
  const expFactor = candidateExp >= minExp ? 1.0 : Math.max(0.6, candidateExp / (minExp || 1));

  // Score calculation
  const totalRequired = Math.max(requiredSkills.length, 1);
  const skillRatio = (matchedRequiredCount / totalRequired) * 0.75 + (preferredMatchedCount / Math.max(preferredSkills.length, 1)) * 0.15;
  
  let rawScore = Math.round((skillRatio * 0.85 + (expMatch ? 0.15 : 0.05 * expFactor)) * 100);
  
  // Normalize score between 40% and 98%
  let score = Math.max(45, Math.min(rawScore, 98));

  // Fallback defaults if candidate has no specific skills yet
  if (candidateSkills.length === 0) {
    score = 75;
  }

  let overallCompatibility = 'Moderate Match';
  if (score >= 88) overallCompatibility = 'Exceptional Match';
  else if (score >= 75) overallCompatibility = 'Strong Match';
  else if (score >= 60) overallCompatibility = 'Good Match';
  else overallCompatibility = 'Developing Match';

  return {
    score,
    strongSkills: strongSkills.length > 0 ? strongSkills : (job.requiredSkills || []).slice(0, 2),
    missingSkills: missingSkills.length > 0 ? missingSkills : (job.preferredSkills || []).slice(0, 2),
    experienceMatch: expMatch,
    overallCompatibility,
    teamCompatibilityScore: Math.min(99, Math.round(score * 0.95 + Math.random() * 8)),
  };
};

export const getSkillDemandTrends = () => {
  return [
    { name: 'React / Next.js', demandScore: 96, growthRate: 24.5, quarterlyTrend: '+18%', avgSalary: '₹18L - ₹32L', category: 'Frontend', status: 'Hot' },
    { name: 'TypeScript', demandScore: 94, growthRate: 31.2, quarterlyTrend: '+28%', avgSalary: '₹20L - ₹36L', category: 'Frontend', status: 'Hot' },
    { name: 'Node.js & Microservices', demandScore: 92, growthRate: 19.8, quarterlyTrend: '+14%', avgSalary: '₹16L - ₹30L', category: 'Backend', status: 'Rising' },
    { name: 'Python & GenAI / LLMs', demandScore: 98, growthRate: 58.4, quarterlyTrend: '+46%', avgSalary: '₹24L - ₹50L', category: 'Data Science & AI', status: 'Hot' },
    { name: 'AWS & Cloud Architecture', demandScore: 91, growthRate: 22.1, quarterlyTrend: '+16%', avgSalary: '₹22L - ₹42L', category: 'DevOps & Cloud', status: 'Rising' },
    { name: 'Kubernetes & Docker', demandScore: 89, growthRate: 18.7, quarterlyTrend: '+12%', avgSalary: '₹20L - ₹38L', category: 'DevOps & Cloud', status: 'Rising' },
    { name: 'System Design & High-Scale', demandScore: 95, growthRate: 27.3, quarterlyTrend: '+21%', avgSalary: '₹28L - ₹60L', category: 'Architecture', status: 'Hot' },
    { name: 'PostgreSQL & Redis Caching', demandScore: 88, growthRate: 15.0, quarterlyTrend: '+10%', avgSalary: '₹18L - ₹30L', category: 'Database', status: 'Stable' },
  ];
};
