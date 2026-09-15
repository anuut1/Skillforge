import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { signToken } from '../lib/jwt';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/authValidators';

// In-memory rate limiting map for login attempts: ip/email -> { count, lockedUntil }
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();
const resetTokens = new Map<string, { token: string; expires: number }>();

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const normalizedEmail = data.email.trim().toLowerCase();
    const existing = await prisma.user.findFirst({
      where: { email: { equals: normalizedEmail } }
    });
    if (existing) return res.status(400).json({ message: 'An account with this email already exists. Please log in.' });
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: data.name.trim(),
        password: hashedPassword,
        role: data.role || 'STUDENT'
      }
    });

    // Auto-generate initial profile, skill gap, and skills for student
    if (user.role === 'STUDENT') {
      const knownTechs = data.knownTechs || ['Java', 'SQL', 'Git'];
      const baseScore = data.currentLevel === 'Advanced' ? 70 : data.currentLevel === 'Intermediate' ? 50 : 35;
      const techBonus = Math.min(25, knownTechs.length * 5);
      const readiness = Math.min(95, baseScore + techBonus);

      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          careerGoal: data.careerGoal || 'Full Stack Developer',
          currentLevel: data.currentLevel || 'Intermediate',
          weeklyTimeCommit: '1 hour/day',
          goalDeadline: 'Placement',
          knownTechs: JSON.stringify(knownTechs),
          readinessScore: readiness,
          xp: 150,
          streakDays: 1
        }
      });

      // Seed core skills for student
      const allSkills = await prisma.skill.findMany({ take: 10 });
      for (const s of allSkills) {
        const isKnown = knownTechs.some((t: string) => s.name.toLowerCase().includes(t.toLowerCase()));
        await prisma.studentSkill.create({
          data: {
            userId: user.id,
            skillId: s.id,
            level: isKnown ? 78 : 32,
            status: isKnown ? 'STRONG' : 'GAP'
          }
        }).catch(() => {});
      }

      // Create initial notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Career Roadmap Initialized',
          message: `Your roadmap for ${data.careerGoal || 'Full Stack Developer'} is ready. Complete your first practice challenge!`,
          type: 'BADGE',
          isRead: false
        }
      }).catch(() => {});
    }
    
    const token = signToken({ id: user.id });
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
  } catch (err: any) {
    const msg = err?.errors?.[0]?.message || err?.message || 'Registration failed';
    res.status(400).json({ message: msg, error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const key = `${email.toLowerCase()}_${req.ip || 'ip'}`;
    const now = Date.now();

    // Check rate limit
    const attempt = loginAttempts.get(key);
    if (attempt && attempt.lockedUntil > now) {
      const waitSeconds = Math.ceil((attempt.lockedUntil - now) / 1000);
      return res.status(429).json({
        message: `Too many unsuccessful attempts. Please wait ${waitSeconds} seconds and try again.`
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      recordFailedAttempt(key);
      return res.status(401).json({ message: 'Incorrect email or password. Please try again.' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      recordFailedAttempt(key);
      return res.status(401).json({ message: 'Incorrect email or password. Please try again.' });
    }

    // Clear failed attempts on success
    loginAttempts.delete(key);
    
    const token = signToken({ id: user.id });
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
  } catch (err: any) {
    const msg = err?.errors?.[0]?.message || err?.message || 'Login validation failed';
    res.status(400).json({ message: msg, error: err });
  }
};

function recordFailedAttempt(key: string) {
  const now = Date.now();
  const attempt = loginAttempts.get(key) || { count: 0, lockedUntil: 0 };
  attempt.count += 1;
  if (attempt.count >= 5) {
    // Lock for 60 seconds
    attempt.lockedUntil = now + 60 * 1000;
  }
  loginAttempts.set(key, attempt);
}

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address.' });
    }

    // Generate reset token code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    resetTokens.set(email.toLowerCase(), {
      token: resetCode,
      expires: Date.now() + 15 * 60 * 1000 // 15 mins
    });

    res.json({
      message: 'Password reset code generated.',
      resetCode, // Return in response for smooth instant testing without SMTP dependency
      instructions: 'Enter the 6-digit verification code to set a new password.'
    });
  } catch (err: any) {
    res.status(400).json({ message: err?.message || 'Invalid request', error: err });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, token, newPassword } = resetPasswordSchema.parse(req.body);
    const stored = resetTokens.get(email.toLowerCase());
    
    if (!stored || stored.token !== token.trim()) {
      return res.status(400).json({ message: 'Invalid or expired verification code.' });
    }

    if (Date.now() > stored.expires) {
      resetTokens.delete(email.toLowerCase());
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    resetTokens.delete(email.toLowerCase());

    res.json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (err: any) {
    res.status(400).json({ message: err?.message || 'Password reset failed', error: err });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    profile
  });
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const {
      name,
      careerGoal,
      targetRole,
      bio,
      currentLevel,
      weeklyTimeCommit,
      goalDeadline,
      knownTechs,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      education,
      experienceYears
    } = req.body;

    if (name) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name }
      });
    }

    const effectiveTargetRole = targetRole || careerGoal || 'Software Engineer';

    const updatedProfile = await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        ...(careerGoal && { careerGoal: effectiveTargetRole }),
        ...(targetRole && { targetRole: effectiveTargetRole }),
        ...(bio !== undefined && { bio }),
        ...(currentLevel && { currentLevel }),
        ...(weeklyTimeCommit && { weeklyTimeCommit }),
        ...(goalDeadline && { goalDeadline }),
        ...(knownTechs && { knownTechs: Array.isArray(knownTechs) ? JSON.stringify(knownTechs) : knownTechs }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(portfolioUrl !== undefined && { portfolioUrl }),
        ...(education !== undefined && { education }),
        ...(experienceYears !== undefined && { experienceYears }),
      },
      create: {
        userId: user.id,
        careerGoal: effectiveTargetRole,
        targetRole: effectiveTargetRole,
        bio: bio || 'Aspiring software engineer passionate about building scalable, high-impact applications.',
        currentLevel: currentLevel || 'Intermediate',
        weeklyTimeCommit: weeklyTimeCommit || '1 hour/day',
        goalDeadline: goalDeadline || 'Placement',
        knownTechs: Array.isArray(knownTechs) ? JSON.stringify(knownTechs) : (knownTechs || JSON.stringify(['Java', 'SQL', 'Git', 'OOP'])),
        githubUrl: githubUrl || 'https://github.com',
        linkedinUrl: linkedinUrl || 'https://linkedin.com',
        portfolioUrl: portfolioUrl || '',
        education: education || 'B.Tech / B.S. in Computer Science & Engineering (2025)',
        experienceYears: experienceYears || '0-2 years',
        readinessScore: 78,
        technicalScore: 82,
        communicationScore: 76,
        problemSolvingScore: 81,
        interviewScore: 79,
        xp: 450,
        streakDays: 7
      }
    });

    const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser?.id,
        email: updatedUser?.email,
        name: updatedUser?.name,
        role: updatedUser?.role
      },
      profile: updatedProfile
    });
  } catch (err) {
    res.status(400).json({ message: 'Error updating profile', error: err });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    let notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    if (notifications.length === 0) {
      notifications = [
        await prisma.notification.create({
          data: {
            userId,
            title: 'Welcome to SkillForge!',
            message: 'Your personalized skill journey is ready. Complete your daily challenge in the Arena.',
            type: 'BADGE',
            isRead: false
          }
        }),
        await prisma.notification.create({
          data: {
            userId,
            title: 'Spaced Repetition Concept Due',
            message: 'Database Indexing & B-Trees is scheduled for recall review today.',
            type: 'REVISION',
            isRead: false
          }
        })
      ];
    }

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err });
  }
};

export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    if (id === 'all') {
      await prisma.notification.updateMany({
        where: { userId },
        data: { isRead: true }
      });
      return res.json({ message: 'All notifications marked as read' });
    }

    const notif = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    res.json(notif);
  } catch (err) {
    res.status(400).json({ message: 'Error updating notification', error: err });
  }
};

