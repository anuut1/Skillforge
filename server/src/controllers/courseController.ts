import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { courseSchema } from '../validators/courseValidators';
import { COURSES_CATALOG, COURSE_CATEGORIES } from '../data/courseCatalog';

export const getCourseCategories = async (req: Request, res: Response) => {
  res.json(COURSE_CATEGORIES);
};

export const getCourses = async (req: Request, res: Response) => {
  try {
    const dbCourses = await prisma.course.findMany({
      include: {
        instructor: { select: { name: true } },
        lectures: { select: { id: true, title: true, duration: true } }
      }
    });

    // Map DB courses to uniform catalog format
    const dbMapped = dbCourses.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      category: c.category || 'Development',
      difficulty: 'Beginner',
      duration: `${Math.max(c.lectures.length * 25, 45)} mins`,
      isCertificationPrep: false,
      targetCertification: undefined,
      certDisclaimer: 'Official SkillForge Course Completion Certificate awarded upon passing all lectures & quizzes.',
      skills: [c.category || 'Development', 'Full Stack', 'Software Engineering'],
      modulesCount: Math.max(Math.ceil(c.lectures.length / 2), 2),
      lectures: c.lectures.map(l => ({ id: l.id, title: l.title, duration: l.duration })),
      instructorName: c.instructor?.name || 'SkillForge Faculty',
      thumbnailUrl: c.thumbnailUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
      enrolledCount: 1420 + c.title.length * 17,
      rating: 4.8
    }));

    // Format all curated catalog courses
    const catalogMapped = COURSES_CATALOG.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      category: c.category,
      difficulty: c.difficulty,
      duration: c.duration,
      isCertificationPrep: c.isCertificationPrep,
      targetCertification: c.targetCertification,
      certDisclaimer: c.certDisclaimer || 'Official SkillForge Course Completion Certificate awarded upon passing all lectures & quizzes.',
      skills: c.skills,
      modulesCount: c.modulesCount,
      lectures: c.lectures,
      instructorName: 'SkillForge Senior Staff Instructor',
      thumbnailUrl: c.category === 'Cloud'
        ? 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80'
        : c.category === 'AI/ML'
        ? 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80'
        : c.category === 'DevOps'
        ? 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80'
        : c.category === 'DSA'
        ? 'https://images.unsplash.com/photo-1516116211227-bbc13c4155b4?w=800&q=80'
        : c.category === 'Core CS'
        ? 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80'
        : c.category === 'Placement'
        ? 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80'
        : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
      enrolledCount: 2840 + c.title.length * 23,
      rating: 4.9
    }));

    // Combined catalog avoiding duplicates by title
    const existingTitles = new Set(dbMapped.map(c => c.title.toLowerCase()));
    const combined = [...dbMapped];
    catalogMapped.forEach(c => {
      if (!existingTitles.has(c.title.toLowerCase())) {
        combined.push(c as any);
      }
    });

    res.json(combined);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error retrieving courses', error });
  }
};

export const getCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check DB first
    const dbCourse = await prisma.course.findUnique({
      where: { id },
      include: { instructor: { select: { name: true } }, lectures: true, quizzes: true }
    });

    if (dbCourse) {
      return res.json({
        id: dbCourse.id,
        title: dbCourse.title,
        description: dbCourse.description,
        category: dbCourse.category || 'Development',
        difficulty: 'Beginner',
        duration: `${Math.max(dbCourse.lectures.length * 25, 45)} mins`,
        isCertificationPrep: false,
        certDisclaimer: 'Official SkillForge Course Completion Certificate awarded upon passing all lectures & quizzes.',
        skills: [dbCourse.category || 'Development', 'Full Stack', 'Software Engineering'],
        modulesCount: Math.max(Math.ceil(dbCourse.lectures.length / 2), 2),
        lectures: dbCourse.lectures.map(l => ({ id: l.id, title: l.title, duration: l.duration, description: l.description })),
        quizzes: dbCourse.quizzes,
        instructorName: dbCourse.instructor?.name || 'SkillForge Faculty',
        thumbnailUrl: dbCourse.thumbnailUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
        enrolledCount: 1420 + dbCourse.title.length * 17,
        rating: 4.8
      });
    }

    // Check curated catalog
    const catalogItem = COURSES_CATALOG.find(c => c.id === id);
    if (catalogItem) {
      return res.json({
        ...catalogItem,
        quizzes: [
          {
            id: `quiz-${catalogItem.id}`,
            title: `${catalogItem.title} - Mastery Assessment`,
            difficulty: catalogItem.difficulty,
            topic: catalogItem.category
          }
        ],
        instructorName: 'SkillForge Senior Staff Instructor',
        thumbnailUrl: catalogItem.category === 'Cloud'
          ? 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80'
          : catalogItem.category === 'AI/ML'
          ? 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80'
          : catalogItem.category === 'DevOps'
          ? 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80'
          : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
        enrolledCount: 2840 + catalogItem.title.length * 23,
        rating: 4.9
      });
    }

    res.status(404).json({ message: 'Course not found' });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Error retrieving course', error });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const data = courseSchema.parse(req.body);
    const course = await prisma.course.create({
      data: { ...data, instructorId: (req as any).user.id }
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const data = courseSchema.partial().parse(req.body);
    const course = await prisma.course.update({
      where: { id: req.params.id },
      data
    });
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const enroll = async (req: Request, res: Response) => {
  try {
    const enrollment = await prisma.enrollment.create({
      data: { userId: (req as any).user.id, courseId: req.params.id }
    });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
