import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  category: z.string(),
  thumbnailUrl: z.string().optional()
});
