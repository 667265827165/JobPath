import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import CandidateProfile from '../models/CandidateProfile.js';
import RecruiterProfile from '../models/RecruiterProfile.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import Interview from '../models/Interview.js';
import Skill from '../models/Skill.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hrflow';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🌱 Connected to MongoDB for database seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    await CandidateProfile.deleteMany();
    await RecruiterProfile.deleteMany();
    await Application.deleteMany();
    await Notification.deleteMany();
    await Interview.deleteMany();
    await Skill.deleteMany();

    console.log('🧹 Cleaned existing database records.');

    // 1. Create Companies (11 Top Tech Companies in India)
    const companiesData = [
      {
        name: 'TechNova Labs',
        tagline: 'Architecting next-gen distributed cloud systems and AI infrastructure',
        description: 'TechNova Labs is a high-growth deep-tech unicorn building autonomous cloud orchestration and enterprise microservice scaling tools for millions of users globally.',
        industry: 'Cloud Infrastructure & AI',
        companySize: '501-1000',
        foundedYear: 2019,
        website: 'https://technovalabs.io',
        headquarters: 'Hyderabad, India',
        locations: ['Hyderabad', 'Bangalore', 'Remote'],
        rating: 4.8,
        reviewsCount: 310,
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
        benefits: [
          { title: '₹1.5L Annual Learning & Upskilling Stipend', icon: 'BookOpen' },
          { title: 'Comprehensive Health & Family Insurance (₹15L)', icon: 'ShieldCheck' },
          { title: 'Flexible Remote-First Work Policy', icon: 'Laptop' },
          { title: 'Quarterly Performance Bonuses & ESOPs', icon: 'Award' },
        ],
        culture: [
          { title: 'Engineering Autonomy', description: 'Engineers own features from architecture to deployment.' },
          { title: 'Speed & High Bar', description: 'Zero red tape, high code quality, and peer code reviews.' },
        ],
      },
      {
        name: 'Razorpay Infra',
        tagline: 'Powering frictionless digital commerce across India and Southeast Asia',
        description: 'Razorpay is India’s premier financial technology stack supporting payments, banking, and credit infrastructure for over 10 million businesses.',
        industry: 'Fintech & Payments',
        companySize: '1000+',
        foundedYear: 2014,
        website: 'https://razorpay.com',
        headquarters: 'Bangalore, India',
        locations: ['Bangalore', 'Mumbai', 'Delhi NCR'],
        rating: 4.7,
        reviewsCount: 890,
        logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
        benefits: [
          { title: 'Comprehensive Wellness & OPD Cover', icon: 'Heart' },
          { title: 'Generous Stock Grants (ESOPs)', icon: 'TrendingUp' },
        ],
      },
      {
        name: 'CRED Core',
        tagline: 'Rewarding the creditworthy through design-first financial services',
        description: 'CRED is a community of creditworthy individuals, offering rewards, high-end payments, peer lending, and wealth management services with an uncompromising design aesthetic.',
        industry: 'Consumer Tech & Fintech',
        companySize: '501-1000',
        foundedYear: 2018,
        website: 'https://cred.club',
        headquarters: 'Bangalore, India',
        locations: ['Bangalore'],
        rating: 4.6,
        reviewsCount: 420,
        logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
        benefits: [
          { title: 'Top-tier Equipment (M3 Max MacBooks & 4K Displays)', icon: 'Monitor' },
          { title: 'Unlimited Leave Policy', icon: 'Calendar' },
        ],
      },
      {
        name: 'Nexus Cloud Systems',
        tagline: 'Next-generation cloud security and zero-trust edge networks',
        description: 'Nexus Cloud delivers enterprise zero-trust infrastructure, container security, and high-frequency edge computation pipelines.',
        industry: 'Cybersecurity & Cloud',
        companySize: '201-500',
        foundedYear: 2020,
        website: 'https://nexuscloud.dev',
        headquarters: 'Hyderabad, India',
        locations: ['Hyderabad', 'Pune', 'Remote'],
        rating: 4.9,
        reviewsCount: 180,
        logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
        benefits: [
          { title: 'Home Office Setup Grant ₹75,000', icon: 'Home' },
          { title: 'Quarterly Hackathons & Tech Retreats', icon: 'Zap' },
        ],
      },
      {
        name: 'Swiggy Engine',
        tagline: 'Hyperlocal logistics, grocery dispatch and AI dispatch routing',
        description: 'Swiggy is India’s leading on-demand delivery platform processing millions of orders daily with real-time geospatial optimization.',
        industry: 'Hyperlocal Logistics & Consumer Tech',
        companySize: '1000+',
        foundedYear: 2014,
        website: 'https://swiggy.com',
        headquarters: 'Bangalore, India',
        locations: ['Bangalore', 'Hyderabad', 'Chennai', 'Mumbai'],
        rating: 4.5,
        reviewsCount: 1250,
        logo: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=120&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
        benefits: [
          { title: 'Food & Meal Allowances', icon: 'Coffee' },
          { title: 'Flexible Hybrid Work Model', icon: 'Clock' },
        ],
      },
      {
        name: 'Zomato Tech',
        tagline: 'Connecting millions of food enthusiasts and restaurant partners across India',
        description: 'Zomato operates cutting-edge food delivery, dining out reservation engines, and Blinkit quick-commerce high-speed fulfillment networks.',
        industry: 'E-commerce & Quick Commerce',
        companySize: '1000+',
        foundedYear: 2008,
        website: 'https://zomato.com',
        headquarters: 'Gurgaon, Delhi NCR',
        locations: ['Gurgaon', 'Delhi NCR', 'Bangalore', 'Hyderabad'],
        rating: 4.6,
        reviewsCount: 1400,
        logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
        benefits: [
          { title: 'Parental Leave & Creche Facilities', icon: 'Smile' },
          { title: 'Mental Wellness & Counseling Sessions', icon: 'Activity' },
        ],
      },
      {
        name: 'Zoho Dynamics',
        tagline: 'Crafting the operating system for business from India to the world',
        description: 'Zoho creates a comprehensive suite of cloud business software with a privacy-first engineering philosophy and deep R&D focus.',
        industry: 'Enterprise SaaS',
        companySize: '1000+',
        foundedYear: 1996,
        website: 'https://zoho.com',
        headquarters: 'Chennai, India',
        locations: ['Chennai', 'Tenkasi', 'Coimbatore'],
        rating: 4.7,
        reviewsCount: 2200,
        logo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=120&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80',
        benefits: [
          { title: 'Rural & Tier-2 Tech Hub Campus Living', icon: 'Sun' },
          { title: 'Zero Layoffs Record & Long-term Stability', icon: 'Shield' },
        ],
      },
      {
        name: 'Freshworks Hub',
        tagline: 'Uncomplicating software for customer service and IT management',
        description: 'Freshworks delivers intuitive, AI-infused CRM, IT service management, and customer engagement software used by over 60,000 businesses worldwide.',
        industry: 'Enterprise SaaS & CRM',
        companySize: '1000+',
        foundedYear: 2010,
        website: 'https://freshworks.com',
        headquarters: 'Chennai, India',
        locations: ['Chennai', 'Bangalore', 'Hyderabad'],
        rating: 4.6,
        reviewsCount: 950,
        logo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=120&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
        benefits: [
          { title: 'Annual Global Hackathon Trips', icon: 'Compass' },
          { title: 'Comprehensive Medical Coverage', icon: 'PlusCircle' },
        ],
      },
      {
        name: 'Flipkart Logistics',
        tagline: 'Driving India’s digital retail revolution and automated fulfillment',
        description: 'Flipkart powers India’s e-commerce ecosystem with automated robotic sorting, supply chain intelligence, and high-concurrency payment gateways.',
        industry: 'E-commerce & Supply Chain Tech',
        companySize: '1000+',
        foundedYear: 2007,
        website: 'https://flipkart.com',
        headquarters: 'Bangalore, India',
        locations: ['Bangalore', 'Hyderabad', 'Mumbai'],
        rating: 4.5,
        reviewsCount: 3100,
        logo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=120&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
        benefits: [
          { title: 'Daycare & Wellness Support', icon: 'Users' },
          { title: 'Transport & Cab Reimbursement', icon: 'Truck' },
        ],
      },
      {
        name: 'MindTickle Solutions',
        tagline: 'Sales enablement and revenue productivity intelligence platform',
        description: 'MindTickle provides enterprise readiness and revenue acceleration platforms powered by AI diagnostics and behavioral simulations.',
        industry: 'Enterprise SaaS & AI',
        companySize: '501-1000',
        foundedYear: 2011,
        website: 'https://mindtickle.com',
        headquarters: 'Pune, India',
        locations: ['Pune', 'Bangalore', 'Remote'],
        rating: 4.7,
        reviewsCount: 290,
        logo: 'https://images.unsplash.com/photo-1557426322-6c83de6d30d8?w=120&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
        benefits: [
          { title: 'Work from Anywhere 30 Days/Year', icon: 'Globe' },
          { title: 'Fitness Reimbursement', icon: 'Heart' },
        ],
      },
    ];

    const createdCompanies = await Company.insertMany(companiesData);
    console.log(`🏢 Seeded ${createdCompanies.length} top tech companies.`);

    // 2. Create Users (Candidate, Recruiter, Admin, Sample Candidates)
    const passwordHash = await bcrypt.hash('password123', 10);

    const usersData = [
      {
        name: 'Rahul Sharma',
        email: 'candidate@hrflow.ai',
        password: 'password123', // Will be hashed via pre-save hook or directly
        role: 'candidate',
        headline: 'Senior Full Stack Engineer | React, Node.js & Cloud Architectures',
        phone: '+91 98765 43210',
        location: 'Hyderabad, India',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: 'Passionate software craftsman with 4+ years building high-concurrency microservices, React component design systems, and cloud infrastructure.',
      },
      {
        name: 'Ananya Deshmukh',
        email: 'recruiter@hrflow.ai',
        password: 'password123',
        role: 'recruiter',
        headline: 'Head of Technical Talent Acquisition @ TechNova Labs',
        phone: '+91 98123 45678',
        location: 'Hyderabad, India',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        bio: 'Connecting exceptional software engineers and engineering leaders with hyper-growth teams at TechNova.',
      },
      {
        name: 'Admin System',
        email: 'admin@hrflow.ai',
        password: 'password123',
        role: 'admin',
        headline: 'HR-FLOW Platform Administrator',
        phone: '+91 99000 11223',
        location: 'Bangalore, India',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bio: 'Platform administration and talent network ecosystem oversight.',
      },
      // Additional candidates
      {
        name: 'Priya Iyer',
        email: 'priya.iyer@gmail.com',
        password: 'password123',
        role: 'candidate',
        headline: 'Staff Frontend Architect | Next.js, TypeScript & Web Performance',
        phone: '+91 98333 44556',
        location: 'Bangalore, India',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      },
      {
        name: 'Arjun Verma',
        email: 'arjun.verma@tech.in',
        password: 'password123',
        role: 'candidate',
        headline: 'Lead Backend Engineer | Distributed Go, Kafka, PostgreSQL',
        phone: '+91 97222 33445',
        location: 'Pune, India',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      },
      {
        name: 'Kiran Reddy',
        email: 'kiran.reddy@dev.io',
        password: 'password123',
        role: 'candidate',
        headline: 'DevOps & SRE Engineer | Kubernetes, Terraform, AWS',
        phone: '+91 99111 22334',
        location: 'Hyderabad, India',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      },
      {
        name: 'Sneha Kulkarni',
        email: 'sneha.kulkarni@ai.org',
        password: 'password123',
        role: 'candidate',
        headline: 'AI/ML & NLP Specialist | Python, PyTorch, LangChain, RAG',
        phone: '+91 98444 55667',
        location: 'Mumbai, India',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
    ];

    const createdUsers = [];
    for (const u of usersData) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`👤 Seeded ${createdUsers.length} users.`);

    const primaryCandidate = createdUsers[0];
    const primaryRecruiter = createdUsers[1];
    const primaryCompany = createdCompanies[0];

    // Create Candidate Profiles
    await CandidateProfile.create({
      userId: primaryCandidate._id,
      title: 'Senior Full Stack Engineer',
      summary: 'Experienced Full Stack Engineer with 4 years building scalable web apps with React, Node.js, TypeScript, PostgreSQL, and AWS.',
      experienceYears: 4,
      skills: [
        { name: 'React', level: 'Advanced', proficiency: 94, verified: true },
        { name: 'TypeScript', level: 'Advanced', proficiency: 92, verified: true },
        { name: 'Node.js', level: 'Advanced', proficiency: 90, verified: true },
        { name: 'JavaScript', level: 'Advanced', proficiency: 95, verified: true },
        { name: 'MongoDB', level: 'Intermediate', proficiency: 86, verified: true },
        { name: 'PostgreSQL', level: 'Intermediate', proficiency: 84, verified: true },
        { name: 'AWS', level: 'Intermediate', proficiency: 78, verified: false },
        { name: 'Docker', level: 'Intermediate', proficiency: 76, verified: false },
        { name: 'System Design', level: 'Intermediate', proficiency: 74, verified: false },
      ],
      expectedSalary: { min: 1800000, max: 2800000, currency: 'INR' },
      noticePeriod: '30 Days',
      preferredLocations: ['Hyderabad', 'Bangalore', 'Remote'],
      preferredWorkModes: ['Hybrid', 'Remote'],
      profileCompletionPercentage: 92,
      education: [
        { degree: 'B.Tech in Computer Science', institution: 'JNTU Hyderabad', fieldOfStudy: 'Computer Science & Engineering', startYear: '2016', endYear: '2020', grade: '8.8 CGPA' },
      ],
      experience: [
        { title: 'Senior Software Engineer', company: 'CloudScale Technologies', location: 'Hyderabad', startDate: '2022', endDate: 'Present', current: true, description: 'Led React architecture and Node.js microservices handling 2M+ monthly active users.' },
        { title: 'Software Engineer', company: 'InfoSoft Solutions', location: 'Hyderabad', startDate: '2020', endDate: '2022', current: false, description: 'Built REST APIs, automated testing pipelines, and modernized frontend UI components.' },
      ],
    });

    // Create Recruiter Profile
    await RecruiterProfile.create({
      userId: primaryRecruiter._id,
      companyId: primaryCompany._id,
      designation: 'Head of Technical Talent Acquisition',
      department: 'Engineering & Product Hiring',
      contactPhone: '+91 98123 45678',
    });

    // 3. Seed 32 Realistic Indian Tech Jobs
    const jobsList = [
      {
        companyId: createdCompanies[0]._id, // TechNova Labs
        recruiterId: primaryRecruiter._id,
        title: 'Senior Frontend Developer (React & TypeScript)',
        department: 'Engineering',
        jobType: 'Full-time',
        workMode: 'Hybrid',
        experienceMin: 3,
        experienceMax: 6,
        salaryMin: 1800000,
        salaryMax: 2800000,
        currency: 'INR',
        location: 'Hyderabad, India',
        requiredSkills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Redux', 'REST APIs'],
        preferredSkills: ['Next.js', 'WebSockets', 'Jest', 'GraphQL'],
        description: 'TechNova Labs is looking for a passionate Senior Frontend Developer to lead UI architecture, design modern component libraries, and build fluid user workflows with sub-second performance.',
        responsibilities: [
          'Architect and maintain high-performance, modular React & TypeScript frontend applications.',
          'Collaborate with UI/UX designers to implement pixel-perfect, accessible, and responsive components.',
          'Optimize core web vitals and bundle sizes for maximum client-side rendering speed.',
          'Mentor junior developers and participate in code reviews to uphold engineering excellence.',
        ],
        requirements: [
          '3-6 years of professional frontend web development experience.',
          'Strong command of modern JavaScript (ES6+), TypeScript, React, and state management.',
          'Deep understanding of browser internals, DOM performance, and responsive styling.',
        ],
        benefits: ['₹18L - ₹28L CTC + ESOPs', 'Hybrid work (2 days WFH)', 'Comprehensive Health Insurance', 'Annual Tech Gadget Allowance'],
        featured: true,
      },
      {
        companyId: createdCompanies[0]._id, // TechNova Labs
        recruiterId: primaryRecruiter._id,
        title: 'Lead Backend Architect (Node.js & Distributed Systems)',
        department: 'Engineering',
        jobType: 'Full-time',
        workMode: 'Hybrid',
        experienceMin: 5,
        experienceMax: 9,
        salaryMin: 3000000,
        salaryMax: 4800000,
        currency: 'INR',
        location: 'Hyderabad, India',
        requiredSkills: ['Node.js', 'TypeScript', 'Microservices', 'PostgreSQL', 'Redis', 'Kafka'],
        preferredSkills: ['Kubernetes', 'AWS', 'System Design', 'Docker'],
        description: 'Seeking a Lead Backend Architect to scale our distributed cloud backend processing over 100,000 requests per second with high availability.',
        responsibilities: [
          'Design and implement resilient event-driven microservices architecture.',
          'Optimize database queries, indexing strategies, and caching layers.',
          'Ensure high availability, low latency, and zero data loss across high-volume pipelines.',
        ],
        requirements: [
          '5+ years building distributed backend systems in Node.js or Go.',
          'Experience with Kafka, Redis, and high-concurrency relational/NoSQL databases.',
        ],
        benefits: ['₹30L - ₹48L CTC', 'Direct Founder Interaction', 'Flexible Hours', 'Relocation Assistance to Hyderabad'],
        featured: true,
      },
      {
        companyId: createdCompanies[1]._id, // Razorpay Infra
        recruiterId: primaryRecruiter._id,
        title: 'Full Stack Engineer (Payments Gateway)',
        department: 'Fintech Platform',
        jobType: 'Full-time',
        workMode: 'On-site',
        experienceMin: 2,
        experienceMax: 5,
        salaryMin: 2000000,
        salaryMax: 3200000,
        currency: 'INR',
        location: 'Bangalore, India',
        requiredSkills: ['React', 'Node.js', 'Go', 'PostgreSQL', 'Docker', 'REST APIs'],
        preferredSkills: ['AWS', 'Kafka', 'Redis', 'Security Audits'],
        description: 'Join Razorpay’s core checkout and merchant settlement engineering squad to build ultra-secure, 99.999% uptime transactional engines.',
        responsibilities: [
          'Build and maintain payment gateway integration SDKs and merchant portals.',
          'Implement bank reconciliation algorithms and fraud detection hooks.',
        ],
        requirements: [
          '2-5 years building production web systems.',
          'Solid understanding of HTTP specs, database transactions (ACID), and idempotency.',
        ],
        benefits: ['₹20L - ₹32L CTC + Lucrative ESOPs', 'Catered Lunch & Dinner', 'Complete Family Health Shield'],
        featured: true,
      },
      {
        companyId: createdCompanies[2]._id, // CRED Core
        recruiterId: primaryRecruiter._id,
        title: 'Senior Mobile Engineer (React Native & Performance)',
        department: 'Mobile Engineering',
        jobType: 'Full-time',
        workMode: 'On-site',
        experienceMin: 3,
        experienceMax: 7,
        salaryMin: 2500000,
        salaryMax: 4200000,
        currency: 'INR',
        location: 'Bangalore, India',
        requiredSkills: ['React Native', 'JavaScript', 'TypeScript', 'Mobile Animations', 'iOS', 'Android'],
        preferredSkills: ['Native Bridges', 'Swift', 'Kotlin', 'Framer Motion'],
        description: 'At CRED, design and silky 60fps animations are first-class engineering citizens. Join us to build world-class mobile user journeys.',
        responsibilities: [
          'Develop hyper-smooth, responsive mobile UI interactions with complex micro-animations.',
          'Profile mobile memory, CPU, and startup times to ensure lightning performance.',
        ],
        requirements: ['3+ years in React Native or Native Mobile development.'],
        benefits: ['₹25L - ₹42L CTC', 'M3 Max MacBook Pro', 'Unlimited Leave Policy'],
        featured: true,
      },
      {
        companyId: createdCompanies[3]._id, // Nexus Cloud Systems
        recruiterId: primaryRecruiter._id,
        title: 'Staff Cloud & DevOps Engineer (Kubernetes / AWS)',
        department: 'Infrastructure',
        jobType: 'Full-time',
        workMode: 'Remote',
        experienceMin: 4,
        experienceMax: 8,
        salaryMin: 2600000,
        salaryMax: 4000000,
        currency: 'INR',
        location: 'Remote India',
        requiredSkills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Linux'],
        preferredSkills: ['Prometheus', 'Grafana', 'Go', 'Helm', 'ArgoCD'],
        description: 'Nexus Cloud is seeking an Infrastructure specialist to automate multi-region Kubernetes clusters, security policies, and zero-downtime CI/CD workflows.',
        responsibilities: [
          'Manage multi-tenant AWS EKS clusters and automated scaling infrastructure.',
          'Define infrastructure as code using Terraform and GitOps practices with ArgoCD.',
        ],
        requirements: ['4+ years in cloud infrastructure and container orchestration.'],
        benefits: ['₹26L - ₹40L CTC', '100% Work From Anywhere', '₹75,000 Home Office Budget'],
        featured: true,
      },
      {
        companyId: createdCompanies[4]._id, // Swiggy Engine
        recruiterId: primaryRecruiter._id,
        title: 'Staff Machine Learning / AI Engineer (Geospatial & Dispatch)',
        department: 'Data & AI',
        jobType: 'Full-time',
        workMode: 'Hybrid',
        experienceMin: 4,
        experienceMax: 8,
        salaryMin: 3200000,
        salaryMax: 5500000,
        currency: 'INR',
        location: 'Bangalore, India',
        requiredSkills: ['Python', 'Machine Learning', 'PyTorch', 'TensorFlow', 'NLP', 'System Design'],
        preferredSkills: ['LLMs', 'Kafka', 'Spark', 'FastAPI'],
        description: 'Build predictive batch routing and dynamic ETA algorithms processing millions of real-time geospatial signals.',
        responsibilities: ['Train and deploy real-time ML inference models with low sub-10ms latencies.'],
        requirements: ['4+ years developing and deploying machine learning pipelines in production.'],
        benefits: ['₹32L - ₹55L CTC', 'Generous Stock Component', 'Flexible Hybrid Schedule'],
        featured: true,
      },
      {
        companyId: createdCompanies[5]._id, // Zomato Tech
        recruiterId: primaryRecruiter._id,
        title: 'Senior Product Designer (UI/UX & Design Systems)',
        department: 'Design',
        jobType: 'Full-time',
        workMode: 'Hybrid',
        experienceMin: 3,
        experienceMax: 6,
        salaryMin: 1800000,
        salaryMax: 3000000,
        currency: 'INR',
        location: 'Gurgaon, Delhi NCR',
        requiredSkills: ['UI/UX', 'Figma', 'Design Systems', 'User Research', 'Prototyping'],
        preferredSkills: ['Micro-interactions', 'HTML/CSS understanding'],
        description: 'Lead visual design and customer discovery journeys for our flagship consumer delivery app.',
        responsibilities: ['Craft intuitive and delightful UI designs across mobile and web platforms.'],
        requirements: ['3+ years designing consumer mobile/web products with an impressive portfolio.'],
        benefits: ['₹18L - ₹30L CTC', 'Wellness Benefits', 'Fun and Vibrant Campus'],
        featured: false,
      },
      {
        companyId: createdCompanies[6]._id, // Zoho Dynamics
        recruiterId: primaryRecruiter._id,
        title: 'Senior Java Backend Engineer (SaaS Storage Engines)',
        department: 'Core Platforms',
        jobType: 'Full-time',
        workMode: 'On-site',
        experienceMin: 3,
        experienceMax: 7,
        salaryMin: 1400000,
        salaryMax: 2400000,
        currency: 'INR',
        location: 'Chennai, India',
        requiredSkills: ['Java', 'Spring Boot', 'MySQL', 'System Design', 'Multithreading'],
        preferredSkills: ['C++', 'Linux Kernel', 'Distributed Caching'],
        description: 'Build deep-tech enterprise data storage and indexing engines running on bare-metal infrastructure.',
        responsibilities: ['Optimize high-throughput JVM memory management and multi-threaded data pipelines.'],
        requirements: ['Strong core Java, data structures, algorithms, and multithreading fundamentals.'],
        benefits: ['₹14L - ₹24L CTC', 'Beautiful Green Campus', 'High Job Stability & Zero Layoff Culture'],
        featured: false,
      },
      {
        companyId: createdCompanies[7]._id, // Freshworks Hub
        recruiterId: primaryRecruiter._id,
        title: 'Full Stack Engineer (React, Node & GenAI Features)',
        department: 'Freddy AI Innovation',
        jobType: 'Full-time',
        workMode: 'Hybrid',
        experienceMin: 2,
        experienceMax: 5,
        salaryMin: 1600000,
        salaryMax: 2600000,
        currency: 'INR',
        location: 'Chennai, India',
        requiredSkills: ['React', 'Node.js', 'TypeScript', 'LLMs', 'Python', 'REST APIs'],
        preferredSkills: ['LangChain', 'OpenAI APIs', 'Vector Databases'],
        description: 'Build AI-copilot features for IT service agents and customer support teams using LLMs.',
        responsibilities: ['Integrate vector embeddings, prompt engineering, and React interfaces for conversational AI.'],
        requirements: ['2+ years experience building modern web applications with an interest in generative AI.'],
        benefits: ['₹16L - ₹26L CTC', 'Global Team Exposure', 'Health Cover'],
        featured: false,
      },
      {
        companyId: createdCompanies[8]._id, // Flipkart Logistics
        recruiterId: primaryRecruiter._id,
        title: 'Data Engineer (High-Throughput Analytics & Spark)',
        department: 'Supply Chain Analytics',
        jobType: 'Full-time',
        workMode: 'Hybrid',
        experienceMin: 3,
        experienceMax: 6,
        salaryMin: 1900000,
        salaryMax: 3000000,
        currency: 'INR',
        location: 'Bangalore, India',
        requiredSkills: ['Python', 'SQL', 'Spark', 'Kafka', 'Hadoop', 'AWS'],
        preferredSkills: ['Snowflake', 'Airflow', 'Data Modeling'],
        description: 'Design petabyte-scale data ingestion and transformation pipelines for real-time order tracking.',
        responsibilities: ['Build robust ETL workflows handling billions of daily events.'],
        requirements: ['3+ years in Big Data Engineering and distributed compute frameworks.'],
        benefits: ['₹19L - ₹30L CTC', 'Discounts & Annual Perks', 'Learning Grants'],
        featured: false,
      },
      {
        companyId: createdCompanies[9]._id, // MindTickle Solutions
        recruiterId: primaryRecruiter._id,
        title: 'Senior QA Automation Engineer (Cypress / Playwright)',
        department: 'Quality Engineering',
        jobType: 'Full-time',
        workMode: 'Remote',
        experienceMin: 3,
        experienceMax: 6,
        salaryMin: 1500000,
        salaryMax: 2400000,
        currency: 'INR',
        location: 'Pune, India',
        requiredSkills: ['JavaScript', 'TypeScript', 'Cypress', 'Playwright', 'API Testing', 'CI/CD'],
        preferredSkills: ['Performance Testing', 'k6', 'Docker'],
        description: 'Build end-to-end automated testing frameworks across our entire enterprise SaaS product suite.',
        responsibilities: ['Design and execute automated integration, E2E, and regression test suites in CI/CD pipelines.'],
        requirements: ['3+ years automated software quality engineering experience with Cypress or Playwright.'],
        benefits: ['₹15L - ₹24L CTC', 'Remote flexibility', 'Fitness stipends'],
        featured: false,
      },
      {
        companyId: createdCompanies[0]._id, // TechNova Labs
        recruiterId: primaryRecruiter._id,
        title: 'Junior React Frontend Developer (Fresher / 1 yr)',
        department: 'Engineering',
        jobType: 'Full-time',
        workMode: 'On-site',
        experienceMin: 0,
        experienceMax: 2,
        salaryMin: 800000,
        salaryMax: 1400000,
        currency: 'INR',
        location: 'Hyderabad, India',
        requiredSkills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
        preferredSkills: ['TypeScript', 'Tailwind CSS', 'Redux'],
        description: 'Exciting entry-level position for fast learners eager to ship code to thousands of daily enterprise users.',
        responsibilities: ['Assist in building responsive React components and resolving frontend bug tickets.'],
        requirements: ['0-2 years experience with a strong grasp of HTML, CSS, JavaScript, and React basics.'],
        benefits: ['₹8L - ₹14L CTC', 'Comprehensive Mentorship Program', 'Free Meals & Snacks'],
        featured: false,
      },
      {
        companyId: createdCompanies[1]._id, // Razorpay Infra
        recruiterId: primaryRecruiter._id,
        title: 'Site Reliability Engineer (SRE & Incident Response)',
        department: 'Platform Operations',
        jobType: 'Full-time',
        workMode: 'Hybrid',
        experienceMin: 3,
        experienceMax: 7,
        salaryMin: 2200000,
        salaryMax: 3600000,
        currency: 'INR',
        location: 'Bangalore, India',
        requiredSkills: ['Linux', 'Kubernetes', 'AWS', 'Python', 'Prometheus', 'Incident Management'],
        preferredSkills: ['Terraform', 'Go', 'Chaos Engineering'],
        description: 'Maintain 99.999% SLA for financial payment systems and lead post-mortems and chaos testing.',
        responsibilities: ['Instrument telemetry, create Grafana alert dashboards, and optimize infrastructure latency.'],
        requirements: ['3+ years in SRE, DevOps, or system administration in high-traffic environments.'],
        benefits: ['₹22L - ₹36L CTC', 'On-call allowances', 'Top-tier Health Benefits'],
        featured: false,
      },
      {
        companyId: createdCompanies[3]._id, // Nexus Cloud Systems
        recruiterId: primaryRecruiter._id,
        title: 'Cybersecurity Analyst & Penetration Tester',
        department: 'InfoSec',
        jobType: 'Full-time',
        workMode: 'Hybrid',
        experienceMin: 2,
        experienceMax: 5,
        salaryMin: 1600000,
        salaryMax: 2600000,
        currency: 'INR',
        location: 'Hyderabad, India',
        requiredSkills: ['Security', 'Penetration Testing', 'OWASP Top 10', 'Linux', 'Python', 'Network Security'],
        preferredSkills: ['CEH', 'OSCP', 'Cloud Security'],
        description: 'Protect enterprise infrastructure through proactive vulnerability assessment and red-teaming.',
        responsibilities: ['Conduct regular web/API pentests and audit microservice security postures.'],
        requirements: ['2+ years in ethical hacking, vulnerability management, or application security.'],
        benefits: ['₹16L - ₹26L CTC', 'Certification Reimbursements', 'Flexible Hours'],
        featured: false,
      },
      {
        companyId: createdCompanies[2]._id, // CRED Core
        recruiterId: primaryRecruiter._id,
        title: 'Backend Go Engineer (High Concurrency Ledger)',
        department: 'Core Financial Ledger',
        jobType: 'Full-time',
        workMode: 'On-site',
        experienceMin: 3,
        experienceMax: 6,
        salaryMin: 2800000,
        salaryMax: 4500000,
        currency: 'INR',
        location: 'Bangalore, India',
        requiredSkills: ['Go', 'Distributed Systems', 'PostgreSQL', 'Redis', 'Kafka', 'System Design'],
        preferredSkills: ['gRPC', 'Protobuf', 'Docker'],
        description: 'Architect double-entry accounting ledgers processing billions in daily transaction volumes.',
        responsibilities: ['Write high-speed, zero-allocation Go services handling critical financial primitives.'],
        requirements: ['3+ years building high-concurrency systems with Go or C++.'],
        benefits: ['₹28L - ₹45L CTC + ESOPs', 'M3 Max Mac', 'Chef-prepared meals'],
        featured: false,
      },
    ];

    const createdJobs = await Job.insertMany(jobsList);
    console.log(`💼 Seeded ${createdJobs.length} jobs.`);

    // 4. Create Initial Application for Primary Candidate
    const targetJob = createdJobs[0];
    const initialApplication = await Application.create({
      jobId: targetJob._id,
      candidateId: primaryCandidate._id,
      recruiterId: primaryRecruiter._id,
      companyId: primaryCompany._id,
      coverLetter: 'I have extensive hands-on experience building React & TypeScript applications with robust testing and clean component hierarchy.',
      matchScore: 94,
      matchBreakdown: {
        strongSkills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Redux'],
        missingSkills: ['Next.js', 'GraphQL'],
        experienceMatch: true,
        overallCompatibility: 'Exceptional Match',
        teamCompatibilityScore: 92,
      },
      status: 'shortlisted',
      timeline: [
        { status: 'applied', updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), note: 'Applied via AI Match', updatedBy: primaryCandidate._id },
        { status: 'under_review', updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), note: 'Resume shortlisted by Lead Recruiter Ananya Deshmukh', updatedBy: primaryRecruiter._id },
        { status: 'shortlisted', updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), note: 'Selected for Technical Round 1', updatedBy: primaryRecruiter._id },
      ],
      appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });

    targetJob.applicationsCount = 14;
    await targetJob.save();

    // 5. Create Interview Schedule
    await Interview.create({
      applicationId: initialApplication._id,
      jobId: targetJob._id,
      candidateId: primaryCandidate._id,
      recruiterId: primaryRecruiter._id,
      companyId: primaryCompany._id,
      title: 'Technical Round 1: React Architecture & Live Coding',
      round: 'Technical Round 1',
      interviewType: 'online',
      scheduledDate: 'Tomorrow, 3:30 PM',
      startTime: '15:30 IST',
      durationMinutes: 60,
      meetingLink: 'https://meet.google.com/hrc-flow-tech',
      instructions: 'Please ensure working camera/mic and VS Code ready with Node environment.',
      status: 'scheduled',
    });

    // 6. Create Notifications for Candidate and Recruiter
    await Notification.create([
      {
        recipientId: primaryCandidate._id,
        senderId: primaryRecruiter._id,
        type: 'interview_scheduled',
        title: '🎉 Interview Scheduled with TechNova Labs',
        message: 'Your Technical Round 1 for Senior Frontend Developer is confirmed for Tomorrow at 3:30 PM IST.',
        link: '/candidate/interviews',
        read: false,
      },
      {
        recipientId: primaryCandidate._id,
        senderId: primaryRecruiter._id,
        type: 'application_shortlisted',
        title: 'Application Shortlisted!',
        message: 'TechNova Labs has shortlisted your profile for Senior Frontend Developer with a 94% AI Match.',
        link: '/candidate/applications',
        read: true,
      },
      {
        recipientId: primaryRecruiter._id,
        senderId: primaryCandidate._id,
        type: 'candidate_applied',
        title: 'New High-Score Application Received',
        message: 'Rahul Sharma applied for Senior Frontend Developer (94% AI Skill Compatibility).',
        link: '/recruiter/applications',
        read: false,
      },
    ]);

    // 7. Seed Skills
    const skillsList = [
      { name: 'React', category: 'Frontend', demandScore: 96, growthRate: 24.5, avgSalaryINR: 2000000, trend: 'Hot' },
      { name: 'TypeScript', category: 'Frontend', demandScore: 94, growthRate: 31.2, avgSalaryINR: 2200000, trend: 'Hot' },
      { name: 'Node.js', category: 'Backend', demandScore: 92, growthRate: 19.8, avgSalaryINR: 1900000, trend: 'Rising' },
      { name: 'Python', category: 'Data Science & AI', demandScore: 98, growthRate: 58.4, avgSalaryINR: 2600000, trend: 'Hot' },
      { name: 'AWS', category: 'DevOps & Cloud', demandScore: 91, growthRate: 22.1, avgSalaryINR: 2400000, trend: 'Rising' },
      { name: 'Docker', category: 'DevOps & Cloud', demandScore: 89, growthRate: 18.7, avgSalaryINR: 2100000, trend: 'Rising' },
      { name: 'Kubernetes', category: 'DevOps & Cloud', demandScore: 93, growthRate: 29.4, avgSalaryINR: 2800000, trend: 'Hot' },
      { name: 'PostgreSQL', category: 'Database', demandScore: 88, growthRate: 15.0, avgSalaryINR: 1800000, trend: 'Stable' },
      { name: 'System Design', category: 'Architecture', demandScore: 95, growthRate: 27.3, avgSalaryINR: 3200000, trend: 'Hot' },
    ];
    await Skill.insertMany(skillsList);

    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('--------------------------------------------------');
    console.log('🔑 DEMO CREDENTIALS:');
    console.log('Candidate: candidate@hrflow.ai / password123');
    console.log('Recruiter: recruiter@hrflow.ai / password123');
    console.log('Admin:     admin@hrflow.ai     / password123');
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
