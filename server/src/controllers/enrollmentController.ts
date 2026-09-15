import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getMyEnrollments = async (req: Request, res: Response) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: (req as any).user.id },
    include: { course: true }
  });
  res.json(enrollments);
};
