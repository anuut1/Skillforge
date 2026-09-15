import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['STUDENT', 'INSTRUCTOR']).optional().default('STUDENT'),
  careerGoal: z.string().optional(),
  currentLevel: z.string().optional(),
  knownTechs: z.array(z.string()).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  token: z.string().min(4),
  newPassword: z.string().min(6)
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  careerGoal: z.string().optional(),
  currentLevel: z.string().optional(),
  weeklyTimeCommit: z.string().optional(),
  goalDeadline: z.string().optional(),
  knownTechs: z.array(z.string()).optional()
});
