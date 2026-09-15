import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export const requireEnrollment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { courseId, id, lectureId } = req.params;
    
    let targetCourseId = courseId;
    
    if (!targetCourseId && id) {
      if (req.originalUrl.includes('/lectures/')) {
        const lecture = await prisma.lecture.findUnique({ where: { id } });
        if (lecture) targetCourseId = lecture.courseId;
      }
    }
    
    if (user.role === 'INSTRUCTOR') {
       const course = await prisma.course.findUnique({ where: { id: targetCourseId } });
       if (course?.instructorId === user.id) return next();
    }
    
    if (!targetCourseId) return res.status(400).json({ message: 'Course ID not resolved' });
    
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: targetCourseId
        }
      }
    });
    
    if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this course' });
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking enrollment' });
  }
};
