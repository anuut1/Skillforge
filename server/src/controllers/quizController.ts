import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { quizSchema, attemptSchema } from '../validators/quizValidators';

export const getLectureQuiz = async (req: Request, res: Response) => {
  const quizzes = await prisma.quiz.findMany({
    where: { lectureId: req.params.lectureId },
    include: { questions: { select: { id: true, questionText: true, options: true, order: true } } }
  });
  res.json(quizzes);
};

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const data = quizSchema.parse(req.body);
    const { questions, ...quizData } = data;
    const quiz = await prisma.quiz.create({
      data: {
        ...quizData,
        questions: {
          create: questions.map(q => ({ ...q, options: JSON.stringify(q.options) }))
        }
      }
    });
    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const attemptQuiz = async (req: Request, res: Response) => {
  try {
    const { answers } = attemptSchema.parse(req.body);
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: { questions: { orderBy: { order: 'asc' } } }
    });
    if (!quiz) return res.status(404).json({ message: 'Not found' });
    
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctOptionIndex) score++;
    });
    
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: (req as any).user.id,
        quizId: quiz.id,
        score,
        totalQuestions: quiz.questions.length,
        answers: JSON.stringify(answers)
      }
    });
    res.status(201).json(attempt);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getAttempts = async (req: Request, res: Response) => {
  const attempts = await prisma.quizAttempt.findMany({
    where: { quizId: req.params.id, userId: (req as any).user.id }
  });
  res.json(attempts);
};

export const getStats = async (req: Request, res: Response) => {
  const attempts = await prisma.quizAttempt.findMany({
    where: { quizId: req.params.id }
  });
  res.json(attempts);
};
