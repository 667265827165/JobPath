import User from '../models/User.js';
import CandidateProfile from '../models/CandidateProfile.js';
import RecruiterProfile from '../models/RecruiterProfile.js';
import Company from '../models/Company.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hrflow_super_secret_jwt_key_2026_x89!', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, headline, phone, location, companyName } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email address.',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'candidate',
      headline: headline || (role === 'recruiter' ? 'Talent Acquisition Leader' : 'Full Stack Developer'),
      phone: phone || '',
      location: location || 'Hyderabad, India',
    });

    if (user.role === 'candidate') {
      await CandidateProfile.create({
        userId: user._id,
        title: headline || 'Software Engineer',
        summary: 'Driven engineer passionate about building high-performance modern web solutions.',
        skills: [
          { name: 'React', level: 'Advanced', proficiency: 90 },
          { name: 'JavaScript', level: 'Advanced', proficiency: 92 },
          { name: 'Node.js', level: 'Intermediate', proficiency: 85 },
          { name: 'MongoDB', level: 'Intermediate', proficiency: 80 },
          { name: 'TypeScript', level: 'Intermediate', proficiency: 78 },
        ],
        preferredLocations: ['Hyderabad', 'Bangalore', 'Remote'],
        preferredWorkModes: ['Remote', 'Hybrid'],
      });
    } else if (user.role === 'recruiter') {
      let company = await Company.findOne({ name: companyName || 'TechNova Labs' });
      if (!company) {
        company = await Company.create({
          name: companyName || `${user.name} Ventures`,
          tagline: 'Leading innovation in modern cloud architectures',
          industry: 'Software & Technology',
          headquarters: location || 'Hyderabad, India',
          locations: [location || 'Hyderabad, India'],
          description: 'High-growth tech product company scaling modern cloud solutions.',
        });
      }

      await RecruiterProfile.create({
        userId: user._id,
        companyId: company._id,
        designation: headline || 'Lead Recruiter & Hiring Specialist',
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          headline: user.headline,
          location: user.location,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    let profileData = null;
    let companyData = null;

    if (user.role === 'candidate') {
      profileData = await CandidateProfile.findOne({ userId: user._id });
    } else if (user.role === 'recruiter') {
      profileData = await RecruiterProfile.findOne({ userId: user._id }).populate('companyId');
      if (profileData && profileData.companyId) {
        companyData = profileData.companyId;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          headline: user.headline,
          location: user.location,
          bio: user.bio,
          phone: user.phone,
          profile: profileData,
          company: companyData,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let profileData = null;
    let companyData = null;

    if (user.role === 'candidate') {
      profileData = await CandidateProfile.findOne({ userId: user._id }).populate('resumeId');
    } else if (user.role === 'recruiter') {
      profileData = await RecruiterProfile.findOne({ userId: user._id }).populate('companyId');
      if (profileData && profileData.companyId) {
        companyData = profileData.companyId;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          headline: user.headline,
          location: user.location,
          bio: user.bio,
          phone: user.phone,
          profile: profileData,
          company: companyData,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, headline, location, bio, phone, avatar, skills, experienceYears, expectedSalary, noticePeriod, preferredLocations, summary } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, headline, location, bio, phone, avatar },
      { new: true, runValidators: true }
    );

    if (user.role === 'candidate') {
      await CandidateProfile.findOneAndUpdate(
        { userId: req.user.id },
        {
          ...(skills && { skills }),
          ...(experienceYears !== undefined && { experienceYears }),
          ...(expectedSalary && { expectedSalary }),
          ...(noticePeriod && { noticePeriod }),
          ...(preferredLocations && { preferredLocations }),
          ...(summary && { summary }),
          ...(headline && { title: headline }),
        },
        { new: true, upsert: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
