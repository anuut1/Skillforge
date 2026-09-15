const fs = require('fs');
const path = require('path');

const basePath = path.join('C:', 'Users', 'Anushree Tiwari', 'skillforge', 'server');

const dirs = [
  '',
  'prisma',
  'src',
  'src/middleware',
  'src/lib',
  'src/routes',
  'src/controllers',
  'src/validators'
];

dirs.forEach(d => {
  const p = path.join(basePath, d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

const files = {
  'package.json': `{
  "name": "skillforge-server",
  "version": "1.0.0",
  "description": "SkillForge Backend",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.1",
    "morgan": "^1.10.0",
    "zod": "^3.21.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.17",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/morgan": "^1.9.4",
    "@types/node": "^20.4.5",
    "nodemon": "^3.0.1",
    "prisma": "^5.0.0",
    "tsx": "^3.12.7",
    "typescript": "^5.1.6"
  }
}
`,
  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}
`,
  '.env.example': `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/skillforge
JWT_SECRET=skillforge-dev-secret-change-in-production
PORT=5000
`,
  '.env': `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/skillforge
JWT_SECRET=skillforge-dev-secret-change-in-production
PORT=5000
`,
  'prisma/schema.prisma': `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  STUDENT
  INSTRUCTOR
}

enum LectureStatus {
  PROCESSING
  READY
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(STUDENT)
  createdAt DateTime @default(now())

  courses     Course[]      @relation("InstructorCourses")
  enrollments Enrollment[]
  quizAttempts QuizAttempt[]
}

model Course {
  id           String   @id @default(uuid())
  title        String
  description  String
  category     String
  thumbnailUrl String?
  instructorId String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  instructor   User         @relation("InstructorCourses", fields: [instructorId], references: [id])
  enrollments  Enrollment[]
  lectures     Lecture[]
  quizzes      Quiz[]
}

model Enrollment {
  id         String   @id @default(uuid())
  userId     String
  courseId   String
  enrolledAt DateTime @default(now())

  user       User   @relation(fields: [userId], references: [id])
  course     Course @relation(fields: [courseId], references: [id])

  @@unique([userId, courseId])
}

model Lecture {
  id          String        @id @default(uuid())
  courseId    String
  title       String
  description String
  videoUrl    String?
  status      LectureStatus @default(PROCESSING)
  order       Int
  createdAt   DateTime      @default(now())

  course      Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
  quizzes     Quiz[]
}

model Quiz {
  id        String   @id @default(uuid())
  courseId  String
  lectureId String?
  title     String
  createdAt DateTime @default(now())

  course        Course         @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lecture       Lecture?       @relation(fields: [lectureId], references: [id], onDelete: Cascade)
  questions     QuizQuestion[]
  attempts      QuizAttempt[]
}

model QuizQuestion {
  id                String @id @default(uuid())
  quizId            String
  questionText      String
  options           Json
  correctOptionIndex Int
  order             Int

  quiz              Quiz   @relation(fields: [quizId], references: [id], onDelete: Cascade)
}

model QuizAttempt {
  id             String   @id @default(uuid())
  userId         String
  quizId         String
  score          Int
  totalQuestions Int
  answers        Json
  submittedAt    DateTime @default(now())

  user           User @relation(fields: [userId], references: [id], onDelete: Cascade)
  quiz           Quiz @relation(fields: [quizId], references: [id], onDelete: Cascade)
}
`,
  'src/server.ts': `import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
`,
  'src/app.ts': `import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';
import lectureRoutes from './routes/lectureRoutes';
import quizRoutes from './routes/quizRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/quizzes', quizRoutes);

app.use(errorHandler);

export default app;
`,
  'src/lib/prisma.ts': `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;
`,
  'src/lib/jwt.ts': `import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const signToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
`,
  'src/middleware/errorHandler.ts': `import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};
`,
  'src/middleware/authenticate.ts': `import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';
import prisma from '../lib/prisma';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as any;
    
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
`,
  'src/middleware/authorize.ts': `import { Request, Response, NextFunction } from 'express';

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
`,
  'src/middleware/requireEnrollment.ts': `import { Request, Response, NextFunction } from 'express';
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
`,
  'src/validators/authValidators.ts': `import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['STUDENT', 'INSTRUCTOR']).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});
`,
  'src/validators/courseValidators.ts': `import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  category: z.string(),
  thumbnailUrl: z.string().optional()
});
`,
  'src/validators/lectureValidators.ts': `import { z } from 'zod';

export const lectureSchema = z.object({
  title: z.string(),
  description: z.string(),
  videoUrl: z.string().optional(),
  order: z.number().int()
});
`,
  'src/validators/quizValidators.ts': `import { z } from 'zod';

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
`,
  'src/controllers/authController.ts': `import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { signToken } from '../lib/jwt';
import { registerSchema, loginSchema } from '../validators/authValidators';

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(400).json({ message: 'Email in use' });
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword }
    });
    
    const token = signToken({ id: user.id });
    res.status(201).json({ user: { id: user.id, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = signToken({ id: user.id });
    res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
`,
  'src/controllers/courseController.ts': `import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { courseSchema } from '../validators/courseValidators';

export const getCourses = async (req: Request, res: Response) => {
  const courses = await prisma.course.findMany({ include: { instructor: { select: { name: true } } } });
  res.json(courses);
};

export const getCourse = async (req: Request, res: Response) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    include: { instructor: { select: { name: true } }, lectures: true, quizzes: true }
  });
  if (!course) return res.status(404).json({ message: 'Not found' });
  res.json(course);
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
`,
  'src/controllers/enrollmentController.ts': `import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getMyEnrollments = async (req: Request, res: Response) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: (req as any).user.id },
    include: { course: true }
  });
  res.json(enrollments);
};
`,
  'src/controllers/lectureController.ts': `import { Request, Response } from 'express';
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
`,
  'src/controllers/quizController.ts': `import { Request, Response } from 'express';
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
          create: questions
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
        answers: answers
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
`,
  'src/routes/authRoutes.ts': `import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();
router.post('/register', register);
router.post('/login', login);
export default router;
`,
  'src/routes/courseRoutes.ts': `import { Router } from 'express';
import { getCourses, getCourse, createCourse, updateCourse, enroll } from '../controllers/courseController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();
router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/', authenticate, authorize('INSTRUCTOR'), createCourse);
router.put('/:id', authenticate, authorize('INSTRUCTOR'), updateCourse);
router.post('/:id/enroll', authenticate, authorize('STUDENT'), enroll);
export default router;
`,
  'src/routes/enrollmentRoutes.ts': `import { Router } from 'express';
import { getMyEnrollments } from '../controllers/enrollmentController';
import { authenticate } from '../middleware/authenticate';

const router = Router();
router.get('/my', authenticate, getMyEnrollments);
export default router;
`,
  'src/routes/lectureRoutes.ts': `import { Router } from 'express';
import { getLectures, getLecture, createLecture } from '../controllers/lectureController';
import { getLectureQuiz } from '../controllers/quizController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { requireEnrollment } from '../middleware/requireEnrollment';

const router = Router({ mergeParams: true });
router.get('/', authenticate, requireEnrollment, getLectures);
router.get('/:id', authenticate, requireEnrollment, getLecture);
router.post('/', authenticate, authorize('INSTRUCTOR'), createLecture);
router.get('/:lectureId/quiz', authenticate, requireEnrollment, getLectureQuiz);
export default router;
`,
  'src/routes/quizRoutes.ts': `import { Router } from 'express';
import { createQuiz, attemptQuiz, getAttempts, getStats } from '../controllers/quizController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { requireEnrollment } from '../middleware/requireEnrollment';

const router = Router();
router.post('/', authenticate, authorize('INSTRUCTOR'), createQuiz);
router.post('/:id/attempt', authenticate, requireEnrollment, attemptQuiz);
router.get('/:id/attempts', authenticate, requireEnrollment, getAttempts);
router.get('/:id/stats', authenticate, authorize('INSTRUCTOR'), getStats);
export default router;
`,
  'prisma/seed.ts': `import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lecture.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const hashed = await bcrypt.hash('password123', 10);
  
  const i1 = await prisma.user.create({ data: { email: 'inst1@test.com', password: hashed, name: 'Inst 1', role: 'INSTRUCTOR' } });
  const i2 = await prisma.user.create({ data: { email: 'inst2@test.com', password: hashed, name: 'Inst 2', role: 'INSTRUCTOR' } });
  
  const s1 = await prisma.user.create({ data: { email: 's1@test.com', password: hashed, name: 'Student 1', role: 'STUDENT' } });
  const s2 = await prisma.user.create({ data: { email: 's2@test.com', password: hashed, name: 'Student 2', role: 'STUDENT' } });
  const s3 = await prisma.user.create({ data: { email: 's3@test.com', password: hashed, name: 'Student 3', role: 'STUDENT' } });

  const c1 = await prisma.course.create({ data: { title: 'Course 1', description: 'Desc', category: 'Cat 1', instructorId: i1.id } });
  const c2 = await prisma.course.create({ data: { title: 'Course 2', description: 'Desc', category: 'Cat 2', instructorId: i1.id } });
  const c3 = await prisma.course.create({ data: { title: 'Course 3', description: 'Desc', category: 'Cat 3', instructorId: i2.id } });

  for (let i=1; i<=3; i++) {
    await prisma.lecture.create({ data: { courseId: c1.id, title: \`Lecture \${i}\`, description: 'Desc', order: i } });
    await prisma.lecture.create({ data: { courseId: c2.id, title: \`Lecture \${i}\`, description: 'Desc', order: i } });
    await prisma.lecture.create({ data: { courseId: c3.id, title: \`Lecture \${i}\`, description: 'Desc', order: i } });
  }

  const q1 = await prisma.quiz.create({
    data: {
      courseId: c1.id,
      title: 'Quiz 1',
      questions: {
        create: [
          { questionText: 'Q1', options: ['A','B','C','D'], correctOptionIndex: 0, order: 1 },
          { questionText: 'Q2', options: ['A','B','C','D'], correctOptionIndex: 1, order: 2 },
          { questionText: 'Q3', options: ['A','B','C','D'], correctOptionIndex: 2, order: 3 },
          { questionText: 'Q4', options: ['A','B','C','D'], correctOptionIndex: 3, order: 4 },
          { questionText: 'Q5', options: ['A','B','C','D'], correctOptionIndex: 0, order: 5 }
        ]
      }
    }
  });

  const q2 = await prisma.quiz.create({
    data: {
      courseId: c2.id,
      title: 'Quiz 2',
      questions: {
        create: [
          { questionText: 'Q1', options: ['A','B','C','D'], correctOptionIndex: 0, order: 1 },
          { questionText: 'Q2', options: ['A','B','C','D'], correctOptionIndex: 1, order: 2 },
          { questionText: 'Q3', options: ['A','B','C','D'], correctOptionIndex: 2, order: 3 },
          { questionText: 'Q4', options: ['A','B','C','D'], correctOptionIndex: 3, order: 4 },
          { questionText: 'Q5', options: ['A','B','C','D'], correctOptionIndex: 0, order: 5 }
        ]
      }
    }
  });

  await prisma.enrollment.create({ data: { userId: s1.id, courseId: c1.id } });
  await prisma.enrollment.create({ data: { userId: s2.id, courseId: c1.id } });

  await prisma.quizAttempt.create({
    data: {
      userId: s1.id,
      quizId: q1.id,
      score: 4,
      totalQuestions: 5,
      answers: [0,1,2,3,1]
    }
  });
  
  console.log('Database seeded successfully');
}
main().catch(console.error).finally(() => prisma.$disconnect());
`,
  'README.md': `# SkillForge Backend

This is the backend for the SkillForge e-learning platform, built with Node.js, Express, TypeScript, and Prisma.

## Setup

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Setup environment variables:
   Copy \`.env.example\` to \`.env\` and update the variables if necessary.

3. Setup database:
   Make sure you have a PostgreSQL server running, then run:
   \`\`\`bash
   npm run db:migrate
   npm run db:seed
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints

- \`POST /api/auth/register\` - Register a new user
- \`POST /api/auth/login\` - Login an existing user
- \`GET /api/courses\` - Get all courses
- \`GET /api/courses/:id\` - Get a specific course
- \`POST /api/courses\` - Create a course (Instructor only)
- \`PUT /api/courses/:id\` - Update a course (Instructor only)
- \`POST /api/courses/:id/enroll\` - Enroll in a course (Student only)
- \`GET /api/enrollments/my\` - Get your enrollments
- \`GET /api/courses/:courseId/lectures\` - Get lectures for a course
- \`POST /api/courses/:courseId/lectures\` - Create a lecture (Instructor only)
- \`GET /api/lectures/:id\` - Get a specific lecture
- \`POST /api/quizzes\` - Create a quiz (Instructor only)
- \`POST /api/quizzes/:id/attempt\` - Attempt a quiz
- \`GET /api/quizzes/:id/attempts\` - Get your attempts for a quiz
- \`GET /api/quizzes/:id/stats\` - Get stats for a quiz (Instructor only)
`
};

for (const [file, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(basePath, file), content);
}
console.log('All files created successfully');
