# SkillForge Backend

This is the backend for the SkillForge e-learning platform, built with Node.js, Express, TypeScript, and Prisma.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup environment variables:
   Copy `.env.example` to `.env` and update the variables if necessary.

3. Setup database:
   Make sure you have a PostgreSQL server running, then run:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login an existing user
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get a specific course
- `POST /api/courses` - Create a course (Instructor only)
- `PUT /api/courses/:id` - Update a course (Instructor only)
- `POST /api/courses/:id/enroll` - Enroll in a course (Student only)
- `GET /api/enrollments/my` - Get your enrollments
- `GET /api/courses/:courseId/lectures` - Get lectures for a course
- `POST /api/courses/:courseId/lectures` - Create a lecture (Instructor only)
- `GET /api/lectures/:id` - Get a specific lecture
- `POST /api/quizzes` - Create a quiz (Instructor only)
- `POST /api/quizzes/:id/attempt` - Attempt a quiz
- `GET /api/quizzes/:id/attempts` - Get your attempts for a quiz
- `GET /api/quizzes/:id/stats` - Get stats for a quiz (Instructor only)
