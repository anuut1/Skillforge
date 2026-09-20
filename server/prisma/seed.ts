import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DSA_PROBLEMS_CATALOG } from '../src/data/dsaCatalog';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (order matters for foreign keys)
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lecture.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const hashed = await bcrypt.hash('password123', 10);

  // ── Users ──────────────────────────────────────────────
  const alice = await prisma.user.create({
    data: { email: 'alice@skillforge.dev', password: hashed, name: 'Alice Chen', role: 'INSTRUCTOR' },
  });
  const bob = await prisma.user.create({
    data: { email: 'bob@skillforge.dev', password: hashed, name: 'Bob Martinez', role: 'INSTRUCTOR' },
  });
  const charlie = await prisma.user.create({
    data: { email: 'charlie@test.com', password: hashed, name: 'Charlie Kim', role: 'STUDENT' },
  });
  const diana = await prisma.user.create({
    data: { email: 'diana@test.com', password: hashed, name: 'Diana Patel', role: 'STUDENT' },
  });
  const eve = await prisma.user.create({
    data: { email: 'eve@test.com', password: hashed, name: 'Eve Johnson', role: 'STUDENT' },
  });

  // ── Courses ────────────────────────────────────────────
  const webDev = await prisma.course.create({
    data: {
      title: 'Complete Web Development Bootcamp',
      description:
        'Learn full-stack web development from scratch. Master HTML, CSS, JavaScript, React, Node.js, Express, and PostgreSQL. Build 15+ real-world projects including a social media app and an e-commerce platform.',
      category: 'Development',
      thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
      instructorId: alice.id,
    },
  });

  const uiUx = await prisma.course.create({
    data: {
      title: 'Advanced UI/UX Design Masterclass',
      description:
        'Master Figma, prototyping, and modern design systems. Learn user research, wireframing, interaction design, and accessibility best practices used by top tech companies.',
      category: 'Design',
      thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
      instructorId: alice.id,
    },
  });

  const dataScience = await prisma.course.create({
    data: {
      title: 'Data Science & Machine Learning with Python',
      description:
        'Practical guide to data analysis, visualization, and building machine learning models. Covers NumPy, Pandas, Matplotlib, Scikit-learn, and TensorFlow with hands-on projects.',
      category: 'Data Science',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      instructorId: bob.id,
    },
  });

  // ── Lectures for Web Dev (5 lectures) ──────────────────
  const webLectures = [];
  const webLectureData = [
    { title: 'Welcome & Course Overview', description: 'Introduction to the course structure, tools, and what you will build.', order: 1 },
    { title: 'HTML5 Fundamentals', description: 'Learn semantic HTML5 elements, forms, and page structure.', order: 2 },
    { title: 'CSS3 & Responsive Design', description: 'Master Flexbox, Grid, media queries, and modern CSS techniques.', order: 3 },
    { title: 'JavaScript Essentials', description: 'Variables, functions, DOM manipulation, and async programming.', order: 4 },
    { title: 'Building Your First React App', description: 'Components, props, state, hooks, and the React ecosystem.', order: 5 },
  ];
  for (const l of webLectureData) {
    const lecture = await prisma.lecture.create({
      data: { courseId: webDev.id, ...l, status: 'READY' },
    });
    webLectures.push(lecture);
  }

  // ── Lectures for UI/UX (4 lectures) ────────────────────
  const uiLectureData = [
    { title: 'Design Thinking Introduction', description: 'Learn the 5-step design thinking process used at Stanford d.school.', order: 1 },
    { title: 'Figma Essentials', description: 'Master Figma from scratch — frames, components, auto layout, and plugins.', order: 2 },
    { title: 'User Research Methods', description: 'Interviews, surveys, personas, and journey mapping techniques.', order: 3 },
    { title: 'Building a Design System', description: 'Create reusable tokens, components, and documentation from scratch.', order: 4 },
  ];
  for (const l of uiLectureData) {
    await prisma.lecture.create({
      data: { courseId: uiUx.id, ...l, status: 'READY' },
    });
  }

  // ── Lectures for Data Science (3 lectures) ─────────────
  const dsLectureData = [
    { title: 'Python for Data Science', description: 'Setting up Jupyter, NumPy arrays, and Pandas DataFrames.', order: 1 },
    { title: 'Data Visualization with Matplotlib', description: 'Create compelling charts, plots, and interactive dashboards.', order: 2 },
    { title: 'Intro to Machine Learning', description: 'Supervised vs unsupervised learning, model training, and evaluation.', order: 3 },
  ];
  for (const l of dsLectureData) {
    await prisma.lecture.create({
      data: { courseId: dataScience.id, ...l, status: 'READY' },
    });
  }

  // ── Quizzes ────────────────────────────────────────────
  const webQuiz = await prisma.quiz.create({
    data: {
      courseId: webDev.id,
      lectureId: webLectures[3].id, // After JavaScript lecture
      title: 'JavaScript Fundamentals Quiz',
      questions: {
        create: [
          {
            questionText: 'Which keyword declares a block-scoped variable in JavaScript?',
            options: JSON.stringify(['var', 'let', 'function', 'define']),
            correctOptionIndex: 1,
            order: 1,
          },
          {
            questionText: 'What does `===` check in JavaScript?',
            options: JSON.stringify(['Value only', 'Type only', 'Value and type', 'Reference only']),
            correctOptionIndex: 2,
            order: 2,
          },
          {
            questionText: 'Which method converts a JSON string to a JavaScript object?',
            options: JSON.stringify(['JSON.stringify()', 'JSON.parse()', 'JSON.convert()', 'JSON.objectify()']),
            correctOptionIndex: 1,
            order: 3,
          },
          {
            questionText: 'What is the output of `typeof null` in JavaScript?',
            options: JSON.stringify(['"null"', '"undefined"', '"object"', '"boolean"']),
            correctOptionIndex: 2,
            order: 4,
          },
          {
            questionText: 'Which array method creates a new array with the results of a function?',
            options: JSON.stringify(['forEach()', 'map()', 'filter()', 'reduce()']),
            correctOptionIndex: 1,
            order: 5,
          },
        ],
      },
    },
  });

  const dsQuiz = await prisma.quiz.create({
    data: {
      courseId: dataScience.id,
      title: 'Python & Data Science Basics Quiz',
      questions: {
        create: [
          {
            questionText: 'Which library is primarily used for numerical computing in Python?',
            options: JSON.stringify(['Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn']),
            correctOptionIndex: 1,
            order: 1,
          },
          {
            questionText: 'What does a Pandas DataFrame represent?',
            options: JSON.stringify(['A 1D array', 'A 2D table', 'A graph', 'A neural network']),
            correctOptionIndex: 1,
            order: 2,
          },
          {
            questionText: 'Which is NOT a type of machine learning?',
            options: JSON.stringify(['Supervised', 'Unsupervised', 'Reinforcement', 'Hypothetical']),
            correctOptionIndex: 3,
            order: 3,
          },
          {
            questionText: 'What is overfitting in machine learning?',
            options: JSON.stringify([
              'Model is too simple',
              'Model learns noise in training data',
              'Model has too few features',
              'Model trains too slowly',
            ]),
            correctOptionIndex: 1,
            order: 4,
          },
          {
            questionText: 'Which Python function reads a CSV file into a DataFrame?',
            options: JSON.stringify(['pd.load_csv()', 'pd.read_csv()', 'pd.import_csv()', 'pd.open_csv()']),
            correctOptionIndex: 1,
            order: 5,
          },
        ],
      },
    },
  });

  // ── Enrollments ────────────────────────────────────────
  await prisma.enrollment.create({ data: { userId: charlie.id, courseId: webDev.id } });
  await prisma.enrollment.create({ data: { userId: charlie.id, courseId: dataScience.id } });
  await prisma.enrollment.create({ data: { userId: diana.id, courseId: webDev.id } });
  await prisma.enrollment.create({ data: { userId: diana.id, courseId: uiUx.id } });
  await prisma.enrollment.create({ data: { userId: eve.id, courseId: dataScience.id } });

  // ── Quiz Attempts ──────────────────────────────────────
  await prisma.quizAttempt.create({
    data: {
      userId: charlie.id,
      quizId: webQuiz.id,
      score: 4,
      totalQuestions: 5,
      answers: JSON.stringify([1, 2, 1, 2, 1]), // Correct: let, ===value+type, JSON.parse, "object", map
    },
  });

  await prisma.quizAttempt.create({
    data: {
      userId: diana.id,
      quizId: webQuiz.id,
      score: 3,
      totalQuestions: 5,
      answers: JSON.stringify([1, 2, 0, 2, 3]),
    },
  });

  // ── Skills ─────────────────────────────────────────────
  const skillsData = [
    { name: 'Java OOP', category: 'Programming', description: 'Classes, inheritance, polymorphism, encapsulation, abstraction' },
    { name: 'Java Collections', category: 'Programming', description: 'Lists, Sets, HashMaps, Queues, Iterators, and generics' },
    { name: 'Java Multithreading & Concurrency', category: 'Programming', description: 'Threads, locks, executors, synchronized, atomic variables' },
    { name: 'SQL Queries & Joins', category: 'Databases', description: 'SELECT, INNER/LEFT/RIGHT JOINs, aggregates, GROUP BY' },
    { name: 'SQL Indexing & Query Plans', category: 'Databases', description: 'B-Trees, composite indexes, EXPLAIN ANALYZE, optimization' },
    { name: 'Transactions & ACID', category: 'Databases', description: 'Isolation levels, rollbacks, write-ahead logging, two-phase commits' },
    { name: 'REST API Architecture', category: 'Backend', description: 'HTTP verbs, status codes, idempotency, resource structuring' },
    { name: 'Spring Boot Fundamentals', category: 'Backend', description: 'Dependency injection, annotations, Spring Data JPA, web controllers' },
    { name: 'Microservices & Distributed Systems', category: 'Backend', description: 'Service discovery, API gateways, circuit breakers, message brokers' },
    { name: 'Data Structures & Algorithms (DSA)', category: 'Core CS', description: 'Arrays, Two Pointers, Trees, Graphs, Dynamic Programming' },
    { name: 'Operating Systems & Concurrency', category: 'Core CS', description: 'Processes, CPU scheduling, virtual memory, paging, deadlocks' },
    { name: 'Computer Networks', category: 'Core CS', description: 'OSI 7 layers, TCP handshake, UDP, DNS, TLS/HTTPS, subnetting' },
    { name: 'Docker & Containerization', category: 'DevOps', description: 'Dockerfile, images, volumes, compose, container lifecycles' },
    { name: 'AWS Cloud Fundamentals', category: 'Cloud', description: 'EC2, S3, IAM policies, VPC, Lambda, CloudWatch' },
    { name: 'React & Frontend State', category: 'Frontend', description: 'Hooks, Virtual DOM, components, Tailwind CSS, performance' }
  ];

  const createdSkills = [];
  for (const s of skillsData) {
    const existing = await prisma.skill.findUnique({ where: { name: s.name } });
    if (!existing) {
      const created = await prisma.skill.create({ data: s });
      createdSkills.push(created);
    } else {
      createdSkills.push(existing);
    }
  }

  // ── Student Skills for Charlie ─────────────────────────
  const charlieProfile = await prisma.studentProfile.upsert({
    where: { userId: charlie.id },
    update: {
      careerGoal: 'Backend Developer',
      currentLevel: 'Intermediate',
      weeklyTimeCommit: '1 hour/day',
      goalDeadline: 'Placement',
      knownTechs: JSON.stringify(['Java', 'SQL', 'Git', 'REST APIs']),
      readinessScore: 67,
      xp: 640,
      streakDays: 12
    },
    create: {
      userId: charlie.id,
      careerGoal: 'Backend Developer',
      currentLevel: 'Intermediate',
      weeklyTimeCommit: '1 hour/day',
      goalDeadline: 'Placement',
      knownTechs: JSON.stringify(['Java', 'SQL', 'Git', 'REST APIs']),
      readinessScore: 67,
      xp: 640,
      streakDays: 12
    }
  });

  const charlieSkillLevels: Record<string, { level: number; status: string }> = {
    'Java OOP': { level: 88, status: 'STRONG' },
    'Java Collections': { level: 82, status: 'STRONG' },
    'Java Multithreading & Concurrency': { level: 58, status: 'IMPROVING' },
    'SQL Queries & Joins': { level: 85, status: 'STRONG' },
    'SQL Indexing & Query Plans': { level: 32, status: 'GAP' },
    'Transactions & ACID': { level: 44, status: 'IMPROVING' },
    'REST API Architecture': { level: 78, status: 'STRONG' },
    'Spring Boot Fundamentals': { level: 35, status: 'GAP' },
    'Microservices & Distributed Systems': { level: 25, status: 'GAP' },
    'Data Structures & Algorithms (DSA)': { level: 64, status: 'IMPROVING' },
    'Operating Systems & Concurrency': { level: 52, status: 'IMPROVING' },
    'Computer Networks': { level: 48, status: 'IMPROVING' },
    'Docker & Containerization': { level: 30, status: 'GAP' },
    'AWS Cloud Fundamentals': { level: 28, status: 'GAP' },
    'React & Frontend State': { level: 60, status: 'IMPROVING' }
  };

  for (const skill of createdSkills) {
    const config = charlieSkillLevels[skill.name] || { level: 40, status: 'IMPROVING' };
    await prisma.studentSkill.upsert({
      where: {
        userId_skillId: { userId: charlie.id, skillId: skill.id }
      },
      update: { level: config.level, status: config.status },
      create: { userId: charlie.id, skillId: skill.id, level: config.level, status: config.status }
    });
  }

  // ── Coding Problems (All 120 Complete Problems) ───────────────
  for (const prob of DSA_PROBLEMS_CATALOG) {
    await prisma.codingProblem.upsert({
      where: { slug: prob.slug },
      update: {
        title: prob.title,
        slug: prob.slug,
        difficulty: prob.difficulty,
        category: prob.category,
        description: prob.description,
        examples: prob.examples,
        constraints: prob.constraints,
        hints: prob.hints,
        starterCode: prob.starterCode,
        referenceSolution: prob.referenceSolution,
        testCases: prob.testCases,
        relatedSkillName: prob.relatedSkillName,
      },
      create: {
        title: prob.title,
        slug: prob.slug,
        difficulty: prob.difficulty,
        category: prob.category,
        description: prob.description,
        examples: prob.examples,
        constraints: prob.constraints,
        hints: prob.hints,
        starterCode: prob.starterCode,
        referenceSolution: prob.referenceSolution,
        testCases: prob.testCases,
        relatedSkillName: prob.relatedSkillName,
      }
    });
  }

  // ── Practical Projects ─────────────────────────────────
  const projectsData = [
    {
      title: 'Production Banking REST API with Spring Boot & PostgreSQL',
      description: 'Build a secure, scalable multi-currency banking system with transactional accounts, atomic fund transfers, JWT auth, and audit logging.',
      difficulty: 'Intermediate',
      technologies: JSON.stringify(['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Docker', 'JWT']),
      requirements: JSON.stringify([
        'Atomic account transfers adhering to strict ACID transactional rollback guarantees',
        'Role-based access control (CUSTOMER, AUDITOR, ADMIN) with stateless JWT tokens',
        'Database indexing on transaction timestamps and sender/receiver foreign keys',
        'Centralized exception handler returning RFC 7807 Problem Details payload',
        'Unit test coverage (>80%) utilizing Mockito and JUnit 5'
      ]),
      milestones: JSON.stringify([
        'Milestone 1: Database schema, ER model, and Flyway migrations',
        'Milestone 2: User registration, password hashing, and authentication filter',
        'Milestone 3: Account ledger, deposit/withdrawal API with balance locks',
        'Milestone 4: Transaction transfer endpoint with @Transactional isolation',
        'Milestone 5: Docker compose and automated Postman test collection'
      ]),
      expectedOutcome: 'A deployable banking microservice capable of processing 100+ concurrent transfer transactions without race conditions.',
      relatedSkillName: 'Spring Boot Fundamentals'
    },
    {
      title: 'Full-Stack Distributed Expense Tracker',
      description: 'Create an intelligent financial dashboard featuring interactive expense tracking, recurring bills, receipt attachments, and monthly analytics visualizer.',
      difficulty: 'Beginner',
      technologies: JSON.stringify(['React', 'Node.js', 'Express', 'Tailwind CSS', 'SQLite/PostgreSQL']),
      requirements: JSON.stringify([
        'CRUD operations for income and expenses with customizable category tags',
        'Interactive charts rendering monthly expenditure breakdown by category',
        'Filtering by date ranges, amount thresholds, and payment methods',
        'Responsive layout optimized for mobile and desktop screens'
      ]),
      milestones: JSON.stringify([
        'Milestone 1: REST endpoints for transactions and categories',
        'Milestone 2: Frontend dashboard with KPI overview cards',
        'Milestone 3: Visual analytics with charts and category distribution',
        'Milestone 4: CSV/PDF export capability'
      ]),
      expectedOutcome: 'A production-ready web application providing responsive financial tracking.',
      relatedSkillName: 'React & Frontend State'
    }
  ];

  for (const prj of projectsData) {
    const existing = await prisma.project.findFirst({ where: { title: prj.title } });
    if (!existing) {
      await prisma.project.create({ data: prj });
    }
  }

  // Seed sample project submission for Charlie
  const bankingProject = await prisma.project.findFirst({ where: { title: { contains: 'Banking' } } });
  if (bankingProject) {
    await prisma.projectSubmission.upsert({
      where: { id: 'sample-sub-charlie' },
      update: {},
      create: {
        id: 'sample-sub-charlie',
        userId: charlie.id,
        projectId: bankingProject.id,
        githubUrl: 'https://github.com/charliekim/spring-banking-rest-api',
        liveDemoUrl: 'https://charlie-banking-demo.railway.app',
        notes: 'Implemented optimistic locking on transfer accounts and 85% test coverage.',
        codeQualityScore: 88,
        featureScore: 92,
        docsScore: 78,
        testingScore: 84,
        bestPracticeScore: 85,
        overallScore: 85,
        aiFeedback: JSON.stringify({
          strengths: [
            'Clean domain-driven packaging structure (controller, service, repository, dto)',
            'Flawless use of @Transactional with isolation level and rollbackFor specifications',
            'Solid JUnit 5 tests covering concurrent transfer race conditions'
          ],
          improvementSuggestions: [
            'Introduce Redis distributed lock if scaling horizontally across multiple cluster nodes',
            'Add Swagger/OpenAPI documentation annotations for automatic client generation'
          ]
        })
      }
    });
  }

  // ── Revision Topics for Charlie (Spaced Repetition) ────
  const revisionsData = [
    { topic: 'Binary Search Boundary Invariants', skillName: 'DSA', dueDay: 2, retention: 64 },
    { topic: 'SQL Joins & Execution Plans (B-Tree)', skillName: 'Databases', dueDay: 4, retention: 70 },
    { topic: 'Java ConcurrentHashMap vs SynchronizedMap', skillName: 'Java', dueDay: 7, retention: 82 }
  ];

  for (const rev of revisionsData) {
    await prisma.revisionTopic.create({
      data: {
        userId: charlie.id,
        topic: rev.topic,
        skillName: rev.skillName,
        dueDay: rev.dueDay,
        dueDate: new Date(),
        retention: rev.retention,
        status: 'DUE'
      }
    });
  }

  // ── Completed Interview for Charlie ────────────────────
  await prisma.interviewSession.create({
    data: {
      userId: charlie.id,
      roleTarget: 'Backend Developer',
      difficulty: 'Medium',
      totalQuestions: 4,
      currentQuestion: 4,
      status: 'COMPLETED',
      overallScore: 82,
      transcript: JSON.stringify([
        {
          questionNumber: 1,
          question: 'Explain the internal architecture and collision resolution mechanism of HashMap in Java.',
          answer: 'Java HashMap uses an array of Node buckets. Each bucket starts as a singly-linked list. When collisions exceed TREEIFY_THRESHOLD (8 items) and array capacity >= 64, the linked list converts to a Red-Black Tree for O(log n) worst-case lookup instead of O(n).',
          evaluation: { score: 92, technicalAccuracy: 95, depth: 90, communication: 90 }
        },
        {
          questionNumber: 2,
          question: 'How does database indexing work under the hood with B-Trees vs Hash indexes?',
          answer: 'B-Trees maintain balanced hierarchical nodes allowing range queries (BETWEEN, <, >) in O(log n). Hash indexes offer O(1) equality lookups but cannot do range scans.',
          evaluation: { score: 85, technicalAccuracy: 88, depth: 82, communication: 86 }
        }
      ]),
      feedbackSummary: JSON.stringify({
        overallScore: 82,
        summary: 'Excellent knowledge of Java internals and memory representations. Prepared for Senior-track technical rounds.'
      })
    }
  });

  console.log('✅ Database seeded successfully with Adaptive Platform models, skills, problems & projects!');
  console.log('');
  console.log('Test accounts:');
  console.log('  Instructor: alice@skillforge.dev / password123');
  console.log('  Instructor: bob@skillforge.dev   / password123');
  console.log('  Student:    charlie@test.com      / password123 (Full profile & progress ready)');
  console.log('  Student:    diana@test.com         / password123');
  console.log('  Student:    eve@test.com           / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

