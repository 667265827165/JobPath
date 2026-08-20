import { searchYouTubeResources } from '../services/youtubeService.js';

export const getYouTubeResources = async (req, res, next) => {
  try {
    const { topic = 'JavaScript', role = 'Frontend Developer', language = 'English', limit = 6 } = req.query;
    const resources = await searchYouTubeResources({ topic, role, language, limit: Number(limit) });

    res.status(200).json({
      success: true,
      data: {
        topic,
        language,
        role,
        resources,
        total: resources.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCareerRoadmap = async (req, res, next) => {
  try {
    const { role } = req.params;
    const { language = 'English' } = req.query;
    const cleanRole = decodeURIComponent(role || 'Frontend Developer');

    // Roadmap stages based on role
    const roadmapStages = [
      {
        stage: 1,
        title: 'Core Fundamentals & Algorithms',
        duration: 'Weeks 1–3',
        description: 'Master core language mechanics, data structures, and algorithmic complexity.',
        skills: ['JavaScript / ES6+', 'Data Structures', 'Git & GitHub'],
      },
      {
        stage: 2,
        title: 'Modern Frameworks & State Architecture',
        duration: 'Weeks 4–7',
        description: 'Build production-ready components, handle async data flows, and state caching.',
        skills: ['React 18', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit / Zustand'],
      },
      {
        stage: 3,
        title: 'Backend, APIs & Cloud Microservices',
        duration: 'Weeks 8–10',
        description: 'Integrate robust backend APIs, secure authentication, and cloud deployment.',
        skills: ['Node.js & Express', 'MongoDB / PostgreSQL', 'Docker', 'AWS'],
      },
      {
        stage: 4,
        title: 'System Design & Interview Mastery',
        duration: 'Weeks 11–12',
        description: 'Scale architectures, caching strategies, and live behavioral interview prep.',
        skills: ['System Design', 'Redis Caching', 'Performance Profiling'],
      },
    ];

    // Fetch related video playlists for top skills in this roadmap
    const videoResources = await searchYouTubeResources({
      topic: cleanRole.includes('Backend') ? 'Node.js' : 'React',
      role: cleanRole,
      language,
      limit: 4,
    });

    res.status(200).json({
      success: true,
      data: {
        role: cleanRole,
        language,
        stages: roadmapStages,
        learningResources: videoResources,
      },
    });
  } catch (error) {
    next(error);
  }
};
