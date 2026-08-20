import crypto from 'crypto';
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

    if (!name || !name.trim() || !email || !email.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, valid email address, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const userRole = ['candidate', 'recruiter', 'admin'].includes(role) ? role : 'candidate';

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: userRole,
      headline: headline || (userRole === 'recruiter' ? 'Talent Acquisition Leader' : 'Full Stack Developer'),
      phone: phone || '',
      location: location || 'Hyderabad, India',
    });

    if (user.role === 'candidate') {
      await CandidateProfile.create({
        userId: user._id,
        title: headline || 'Software Engineer',
        summary: 'Driven engineer passionate about building high-performance modern web solutions.',
        skills: [
          { name: 'React', level: 'Advanced', proficiency: 90, verified: true },
          { name: 'JavaScript', level: 'Advanced', proficiency: 92, verified: true },
          { name: 'Node.js', level: 'Intermediate', proficiency: 85, verified: true },
          { name: 'MongoDB', level: 'Intermediate', proficiency: 80, verified: true },
          { name: 'TypeScript', level: 'Intermediate', proficiency: 78, verified: true },
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

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with this email.',
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

export const socialAuth = async (req, res, next) => {
  try {
    const { provider, email, name, avatar, role = 'candidate' } = req.body;

    if (!provider || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing OAuth provider or email verification.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const generatedPassword = crypto.randomBytes(16).toString('hex');
      const userRole = ['candidate', 'recruiter', 'admin'].includes(role) ? role : 'candidate';

      user = await User.create({
        name: name || (normalizedEmail.split('@')[0].replace(/[._]/g, ' ')),
        email: normalizedEmail,
        password: generatedPassword,
        role: userRole,
        avatar: avatar || '',
        headline: userRole === 'recruiter' ? 'Talent Acquisition Partner' : 'Full Stack Engineer',
        location: 'Hyderabad, India',
        isVerified: true,
      });

      if (user.role === 'candidate') {
        await CandidateProfile.create({
          userId: user._id,
          title: user.headline,
          skills: [
            { name: 'React', level: 'Advanced', proficiency: 90, verified: true },
            { name: 'JavaScript', level: 'Advanced', proficiency: 92, verified: true },
            { name: 'Node.js', level: 'Intermediate', proficiency: 85, verified: true },
          ],
          preferredLocations: ['Hyderabad', 'Bangalore', 'Remote'],
        });
      } else if (user.role === 'recruiter') {
        const company = await Company.findOne({});
        await RecruiterProfile.create({
          userId: user._id,
          companyId: company ? company._id : null,
          designation: 'Technical Recruiter',
        });
      }
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
      message: `Signed in with ${provider} successfully.`,
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
          profile: profileData,
          company: companyData,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid registered email address.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Password reset instructions dispatched to your email address.',
      data: {
        resetToken, // Provided in response for easy dev/local flow or email service dispatch
        expiresInMinutes: 30,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset link.',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const authToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You are now logged in.',
      data: {
        token: authToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
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
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User no longer exists.',
      });
    }

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
      {
        ...(name && { name: name.trim() }),
        ...(headline && { headline }),
        ...(location && { location }),
        ...(bio && { bio }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
      },
      { new: true, runValidators: true }
    );

    if (user.role === 'candidate') {
      await CandidateProfile.findOneAndUpdate(
        { userId: req.user.id },
        {
          ...(skills && { skills }),
          ...(experienceYears !== undefined && { experienceYears: Number(experienceYears) }),
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

export const sendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const targetEmail = (email || req.user?.email || '').trim().toLowerCase();

    if (!targetEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address to send verification code.',
      });
    }

    const user = await User.findOne({ email: targetEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account registered with this email.',
      });
    }

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    user.emailVerificationOtp = otpHash;
    user.emailVerificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    user.emailVerificationAttempts = 0;
    await user.save({ validateBeforeSave: false });

    const { sendVerificationEmail } = await import('../services/emailService.js');
    await sendVerificationEmail({
      toEmail: user.email,
      userName: user.name,
      otpCode: otp,
    });

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email address.',
      data: {
        email: user.email,
        expiresInMinutes: 15,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const targetEmail = (email || req.user?.email || '').trim().toLowerCase();

    if (!targetEmail || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and the 6-digit verification code.',
      });
    }

    const user = await User.findOne({ email: targetEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email.',
      });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: 'Email is already verified.',
      });
    }

    if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new code.',
      });
    }

    if (user.emailVerificationAttempts >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts. Please request a new verification code.',
      });
    }

    const otpHash = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    if (user.emailVerificationOtp !== otpHash) {
      user.emailVerificationAttempts = (user.emailVerificationAttempts || 0) + 1;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check and try again.',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationOtp = undefined;
    user.emailVerificationExpires = undefined;
    user.emailVerificationAttempts = 0;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! Welcome to HIREX.',
      data: {
        isEmailVerified: true,
      },
    });
  } catch (error) {
    next(error);
  }
};
