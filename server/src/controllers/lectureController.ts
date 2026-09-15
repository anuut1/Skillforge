import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { lectureSchema } from '../validators/lectureValidators';

export const getLectures = async (req: Request, res: Response) => {
  const lectures = await prisma.lecture.findMany({
    where: { courseId: req.params.courseId },
    orderBy: { order: 'asc' }
  });
  res.json(lectures);
};

export const getLecture = async (req: Request, res: Response) => {
  const lecture = await prisma.lecture.findUnique({ where: { id: req.params.id } });
  if (!lecture) return res.status(404).json({ message: 'Not found' });
  res.json(lecture);
};

export const createLecture = async (req: Request, res: Response) => {
  try {
    const data = lectureSchema.parse(req.body);
    const lecture = await prisma.lecture.create({
      data: { ...data, courseId: req.params.courseId }
    });
    res.status(201).json(lecture);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
