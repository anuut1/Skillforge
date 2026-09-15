import { z } from 'zod';

export const lectureSchema = z.object({
  title: z.string(),
  description: z.string(),
  videoUrl: z.string().optional(),
  order: z.number().int()
});
