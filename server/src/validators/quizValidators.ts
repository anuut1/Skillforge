import { z } from 'zod';

export const quizSchema = z.object({
  courseId: z.string(),
  lectureId: z.string().optional(),
  title: z.string(),
  questions: z.array(z.object({
    questionText: z.string(),
    options: z.array(z.string()),
    correctOptionIndex: z.number().int(),
    order: z.number().int()
  }))
});

export const attemptSchema = z.object({
  answers: z.array(z.number().int())
});
