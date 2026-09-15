# SkillForge - AWS Migration Audit Report

**Date of Audit:** September 11, 2026  
**Auditor Role:** Senior AWS Cloud Architect, Full-Stack Engineer, DevOps & AI Systems Engineer  
**Status:** Pre-Migration Audit Complete — Read-Only Architecture Assessment

---

## 1. Current Frontend Technology & Structure

- **Framework:** React 19.2.8 with TypeScript 6.0.2.
- **Build Tool & Bundler:** Vite 8.2.2 (`@vitejs/plugin-react` 6.1.0).
- **Styling:** Tailwind CSS 4.3.3 with `@tailwindcss/vite`.
- **Routing:** React Router DOM 7.18.3.
- **Iconography:** Lucide React (`lucide-react` 1.39.0).
- **HTTP Client:** Axios 1.20.0 with request interceptor injecting JWT bearer tokens from `localStorage`.
- **Authentication SDK:** `amazon-cognito-identity-js` (v6.3.20) for Cognito SRP/User-Password sign-up, sign-in, and session retrieval.
- **Directory Hierarchy:**
  - `client/src/api`: Axios client instance with Bearer interceptor
  - `client/src/components`: UI components (`AiTutorPanel`, `CourseCard`, `LectureList`, `QuizQuestion`, etc.)
  - `client/src/components/Layout`: `AuthenticatedLayout`, `Navbar`, `Sidebar`, `Footer`
  - `client/src/contexts`: `AuthContext` providing login/signup/logout states
  - `client/src/hooks`: `useAuth` hook
  - `client/src/lib`: `cognito.ts` client authentication library
  - `client/src/pages`: Application views (`Dashboard`, `CodingPlayground`, `InterviewSimulator`, `ResumeMatcher`, etc.)
  - `client/src/types`: Core TypeScript type definitions
  - `client/src/App.tsx`: Client router configuration & route guards
  - `client/src/main.tsx`: React root entry point

---

## 2. Current Backend Technology & Structure

- **Runtime & Language:** Node.js 20+ with TypeScript 5.1.6.
- **Web Framework:** Express 4.18.2.
- **Database Access / ORM:** Prisma ORM 5.0.0 (`@prisma/client` and `prisma`).
- **Input Validation:** Zod 3.21.4 schema-based payload validators.
- **Security & Crypto:**
  - `bcryptjs` 2.4.3 for password hashing (local authentication fallback).
  - `jsonwebtoken` 9.0.1 for local JWT signing and validation.
  - `aws-jwt-verify` 5.2.1 for cryptographic verification of Amazon Cognito JWT RS256 access tokens.
- **Cross-Origin & Logging:** `cors` 2.8.5 and `morgan` 1.10.0 dev request logger.
- **Directory Hierarchy:**
  - `server/prisma`: Prisma schema, migrations, seed scripts, SQLite `dev.db`
  - `server/src/controllers`: `adaptiveController`, `authController`, `courseController`, `lectureController`, `quizController`, `enrollmentController`
  - `server/src/data`: Embedded seed catalog (`dsaCatalog`, `courseCatalog`)
  - `server/src/lib`: `prisma`, `jwt`, `cognito`, `s3`, `textract`, `bedrock`, `messaging`, `secrets`
  - `server/src/middleware`: `authenticate`, `authorize`, `errorHandler`, `requireEnrollment`
  - `server/src/routes`: `adaptiveRoutes`, `authRoutes`, `courseRoutes`, `lectureRoutes`, `quizRoutes`, `enrollmentRoutes`
  - `server/src/services`: `aiServices`, `bedrockAiService`
  - `server/src/validators`: Zod validation schemas
  - `server/src/app.ts`: Express application configuration
  - `server/src/server.ts`: HTTP listener entrypoint (port 5000)

---

## 3. Database Currently Being Used

- **Current Engine:** SQLite 3 (via Prisma SQLite connector: `DATABASE_URL="file:./dev.db"`).
- **Target Engine for AWS:** Amazon RDS PostgreSQL 16.1.
- **Schema Analysis & Migration Readiness:**
  - The Prisma schema (`schema.prisma`) is strictly defined with 16 core relational models.
  - SQLite doesn't support native enums; the codebase currently enforces role (`STUDENT` | `INSTRUCTOR`) and status (`READY` | `PROCESSING`) constraints at the application layer via Zod, making it 100% forward-compatible with PostgreSQL.
  - JSON objects (such as `knownTechs`, `testCases`, `jobBreakdown`, `fixerSuggestions`) are currently stored as `String` columns and map cleanly to PostgreSQL `Json` or `Text`.

---

## 4. Authentication Implementation

- **Hybrid Dual-Strategy Auth:**
  1. **Amazon Cognito User Pool:**
     - The `authenticate.ts` middleware checks whether Cognito credentials (`COGNITO_USER_POOL_ID`, `COGNITO_CLIENT_ID`) are present.
     - Verifies incoming Bearer tokens using `aws-jwt-verify`.
     - Extracts the `sub`, `email`, and `cognito:groups` claims (`instructors` vs. default `STUDENT`).
     - Upserts the corresponding user profile into Prisma upon successful verification.
  2. **Local JWT Fallback:**
     - If Cognito is unconfigured or returns invalid tokens during offline local development, it verifies signatures against `JWT_SECRET` with bcrypt-hashed passwords.
- **Role-Based Access Control (RBAC):**
  - `authorize.ts` restricts routes to `STUDENT` or `INSTRUCTOR` roles.

---

## 5. All Existing API Endpoints

### Authentication & User Profile (`/api/auth`)
- `POST /api/auth/register`: Student/instructor signup
- `POST /api/auth/login`: User signin & token issuance
- `POST /api/auth/forgot-password`: Password reset request
- `POST /api/auth/reset-password`: Token-based password update
- `GET  /api/auth/me`: Retrieve current authenticated profile
- `PUT  /api/auth/profile`: Update user biographical and link information
- `GET  /api/auth/notifications`: List user notifications
- `PATCH /api/auth/notifications/:id/read`: Mark notification read

### Courses & Curriculum (`/api/courses`)
- `GET  /api/courses/categories`: List course taxonomy categories
- `GET  /api/courses`: Query all published courses
- `GET  /api/courses/:id`: Course details and lecture curriculum
- `POST /api/courses`: Create new course (Instructor only)
- `PUT  /api/courses/:id`: Update course details (Instructor only)
- `POST /api/courses/:id/enroll`: Student enrollment in course

### Enrollments (`/api/enrollments`)
- `GET  /api/enrollments/my`: Retrieve active user enrollments

### Lectures (`/api/lectures`)
- `GET  /api/lectures`: Get enrolled course lectures
- `GET  /api/lectures/:id`: Get specific lecture details & video stream URL
- `POST /api/lectures`: Add lecture to course (Instructor only)
- `GET  /api/lectures/:lectureId/quiz`: Fetch quiz attached to lecture

### Quizzes (`/api/quizzes`)
- `POST /api/quizzes`: Author quiz (Instructor only)
- `POST /api/quizzes/:id/attempt`: Submit quiz answers & compute score
- `GET  /api/quizzes/:id/attempts`: View quiz score history
- `GET  /api/quizzes/:id/stats`: Aggregate quiz performance analytics (Instructor only)

### Adaptive AI, Career, DSA & Placement (`/api/...`)
- `GET  /api/profile`: Get student career profile & radar metrics
- `POST /api/onboarding`: Save initial career goals & skill self-assessment
- `GET  /api/skills/gap-analysis`: Compute target role vs current skill gaps
- `GET  /api/roadmap`: Fetch personalized role progression roadmap
- `POST /api/ai/tutor`: Conversational AI tutor question/explanation endpoint
- `GET  /api/coding/categories`: DSA question categories & counts
- `GET  /api/coding/stats`: Student DSA solve metrics & streak counts
- `GET  /api/coding/problems`: Filtered DSA problem catalog
- `GET  /api/coding/problems/:slug`: Complete problem spec with starter code & test cases
- `POST /api/coding/submit`: Submit DSA code for sandboxed execution and review
- `GET  /api/quizzes/adaptive/:quizId`: Dynamic difficulty quiz loader
- `POST /api/quizzes/adaptive/submit`: Adaptive quiz grading & XP attribution
- `GET  /api/revisions/due`: Spaced repetition flashcards & topics due today
- `POST /api/revisions/:id/complete`: Record spaced repetition retention outcome
- `GET  /api/projects`: Recommended portfolio projects
- `POST /api/projects/submit`: Submit GitHub URL for AI code & rubric review
- `POST /api/resume/upload-url`: Generate secure S3 presigned PUT URL
- `POST /api/resume/process-s3`: Extract & analyze S3 resume via Textract + Bedrock
- `POST /api/resume/analyze`: Direct text resume & JD matching
- `GET  /api/resume/history`: Historical ATS audit reports
- `GET  /api/resume/versions`: Student stored resume versions
- `POST /api/resume/versions`: Save modified resume version
- `POST /api/profile/add-skills`: Bulk add extracted skills to student profile
- `POST /api/interview/start`: Generate role & difficulty interview questions
- `POST /api/interview/respond`: Evaluate candidate voice/text answer with STAR rubric
- `GET  /api/interview/history`: View past mock interview transcripts & scores
- `GET  /api/daily-challenge`: Get today's coding + quiz daily mission
- `GET  /api/arena/leaderboard`: View campus/global leaderboard rankings
- `GET  /api/study-rooms`: Browse active peer study spaces
- `POST /api/study-rooms/message`: Chat message broadcast in study room
- `POST /api/instructor/ai/generate-course`: AI course syllabus generator (Instructor only)
- `GET  /api/instructor/course-quality/:courseId`: Automated course QA report (Instructor only)
- `POST /api/copilot/advice`: Contextual AI Career Copilot recommendation
- `GET  /api/mission/daily`: Daily engagement checklist
- `POST /api/mission/complete-task`: Mark daily mission task completed
- `GET  /api/learning/mistake-memory`: Track repeated conceptual mistakes
- `GET  /api/learning/dna`: Student learning persona & cognitive habits

---

## 6. All Major Frontend Pages & Components

### Pages (`client/src/pages/`)
1. **LandingPage.tsx**: Marketing showcase, feature highlights, role preview, social proof.
2. **AuthPage.tsx**: Dual-mode login/signup supporting Cognito SRP and local JWT, multi-step career goal onboarding, password recovery.
3. **StudentDashboard.tsx**: Metric cards, placement readiness score, streak tracker, recommended next action, daily challenge widget, upcoming revision alerts.
4. **InstructorDashboard.tsx**: Course creator tools, student enrollment counts, quiz submission analytics, AI curriculum generator modal.
5. **ProfilePage.tsx**: Career goal configuration, portfolio/GitHub links, radar chart of skills, target deadline settings.
6. **CatalogPage.tsx**: Filterable course catalog with category pills, instructor badges, search bar.
7. **CourseDetailPage.tsx**: Course syllabus, lecture breakdown, enrollment CTA, instructor credentials.
8. **LecturePlayerPage.tsx**: Video player container, lecture transcript summaries, inline AI tutor chat drawer, lecture quiz launcher.
9. **QuizPage.tsx**: Interactive quiz taker with timer, multiple-choice options, immediate explanation feedback, score breakdown.
10. **CodingPlaygroundPage.tsx**: Web-based IDE layout, language selector (Python, JS, Java, C++), console output, test-runner results, AI complexity analysis.
11. **ResumeMatcherPage.tsx**: PDF resume upload, raw text editor, JD comparator, ATS score gauge, keyword gap matrix, bullet-point fixer with one-click diff acceptance.
12. **InterviewSimulatorPage.tsx**: Real-time mock interview simulator with question generation, countdown timer, candidate response capture, STAR evaluation feedback.
13. **RoadmapPage.tsx**: Interactive career roadmap graph with completed, in-progress, and locked skill milestones.
14. **SkillGapPage.tsx**: Target role benchmark vs. user mastery visual comparison with direct course recommendation links.
15. **ProjectsPage.tsx**: Portfolio project recommendations by seniority, requirement specs, GitHub submission modal with automated AI scoring.
16. **ArenaPage.tsx**: Daily competitive challenges, campus rankings, XP leaderboard, peer study rooms with messaging.
17. **PlacementHubPage.tsx**: Comprehensive readiness dashboard consolidating DSA, interview scores, ATS resume rating, and readiness checklist.
18. **SkillPassportPage.tsx**: Deprecated / removed stub (kept intentionally empty per specification).

### Core Components (`client/src/components/`)
- **Layout/AuthenticatedLayout.tsx**: Main app chrome with collapsible sidebar, top navigation, notification badge, and breadcrumbs.
- **AiTutorPanel.tsx**: Floating contextual tutor providing analogies, simplified breakdowns, and code walkthroughs.
- **CourseCard.tsx**: Card presentation with thumbnail, category badge, and enrollment status.
- **QuizQuestion.tsx**: Render unit for individual questions with radio options and validation colors.
- **ProtectedRoute.tsx**: Client-side authentication and role-based redirect guard.

---

## 7. All Major Backend Modules & Services

1. **aiServices.ts**:
   - `aiTutorService`: Generates contextual tutoring replies, code walkthroughs, analogies, and quick checks.
   - `codeReviewService`: Evaluates submitted code for algorithmic time/space complexity, detects nested iterations ($O(n^2)$), and validates edge cases.
   - `resumeAnalysisService`: Heuristic ATS engine calculating skillsMatchScore, experienceMatchScore, keywordMatchScore, formatting score, and generates bullet-point fixer diffs.
   - `projectEvaluationService`: Computes scores for code quality, feature completeness, documentation, testing, and best practices.
   - `interviewService`: Curates role-specific questions and scores candidate answers across technical, problem-solving, and communication rubrics.
   - `instructorAiService`: Drafts complete multi-lecture syllabi and quiz questions based on topic inputs.
2. **bedrockAiService.ts**:
   - Manages AWS Bedrock invocation with structured RFC 8259 JSON prompts and fallback to `aiServices.ts`.
3. **resumeAwsController.ts**:
   - Brokers presigned S3 URLs and coordinates Textract text detection and Bedrock analysis.
4. **adaptiveController.ts**:
   - Serves 38+ business handlers for profile, roadmaps, DSA submissions, adaptive quizzes, revisions, projects, and interviews.
5. **authController.ts**:
   - User authentication, bcrypt verification, profile updates, and notification management.
6. **courseController.ts / lectureController.ts / quizController.ts**:
   - Curriculum CRUD, student enrollment state, and quiz scoring.

---

## 8. Current File & Document Storage

- **Current State:**
  - Resumes are parsed in-memory as text or via the browser HTML5 `FileReader.readAsText()`.
  - Course thumbnails and lecture video links are stored as external URL strings in SQLite (`thumbnailUrl`, `videoUrl`).
- **AWS Target State:**
  - Dedicated private Amazon S3 bucket (`skillforge-user-data`) with prefix-based partitioning:
    - `resumes/{userId}/{timestamp}-{filename}`
    - `certificates/{userId}/`
    - `project-files/{userId}/`
    - `interview-files/{userId}/`
  - Encrypted at rest via AWS KMS CMK (`alias/skillforge`).
  - Access brokered strictly via temporary presigned URLs (15-minute expiration).

---

## 9. Current AI / ML Integrations

- **Current Implementations:**
  - Built-in rule and heuristic engine (`aiServices.ts`) containing taxonomies of 25+ tech skills, role requirement matrices, ATS issue detectors, and STAR interview evaluation rubrics.
  - Optional Bedrock adapter (`bedrockAiService.ts`) calling `anthropic.claude-3-5-sonnet-20241022-v2:0` via `@aws-sdk/client-bedrock-runtime`.
- **Target Cloud AI Pipeline:**
  - **Document OCR:** Amazon Textract (`DetectDocumentTextCommand`).
  - **Inference Models:** Amazon Bedrock (`Claude 3.5 Sonnet` for deep reasoning; `Amazon Titan Text` for lightweight summaries).
  - **Custom ML (Future/Optional):** Amazon SageMaker for predictive placement score modeling (only if custom training on student cohorts is needed).

---

## 10. Resume Upload & Resume-Analysis Flow

```
[Student in Browser]
       │
       ├─ (A) Direct text paste: sends resumeText + JD to POST /api/resume/analyze
       │
       └─ (B) PDF File Upload:
              │
              ▼
       1. POST /api/resume/upload-url (Bearer Token)
              │
              ▼
       2. Backend generates S3 Presigned PUT URL:
          s3://skillforge-user-data/resumes/{userId}/{timestamp}-{sanitizedFilename}
              │
              ▼
       3. Browser PUTs binary PDF directly to S3 with KMS Encryption
              │
              ▼
       4. POST /api/resume/process-s3 with { s3Key, targetRole, jobDescription }
              │
              ▼
       5. Amazon Textract extracts plain text from PDF
              │
              ▼
       6. Amazon Bedrock / Heuristic Engine evaluates:
          - ATS Score (0-100)
          - Skills Match, Keyword Frequency, Section Feedback
          - Bullet-point Fixer suggestions (before/after)
              │
              ▼
       7. Stored in Database (ResumeAnalysis record)
              │
              ▼
       8. JSON response returned to frontend; UI populates gauges & diff viewers
```

---

## 11. Job-Description Analysis Flow

1. Student enters target role (e.g., "Backend Developer") and pastes real job description text into `ResumeMatcherPage.tsx`.
2. The analyzer scans the JD against technical skill dictionaries (Languages, Frameworks, Cloud, Databases, Core CS).
3. Evaluates frequency of core vs. preferred qualifications and assigns priority weights.
4. Identifies keyword gaps by cross-referencing candidate resume frequency vs. JD frequency.
5. Generates targeted course suggestions for detected missing skills.

---

## 12. DSA Playground Architecture

- **Catalog:** 15+ curated algorithms problems across Arrays, HashMaps, Two Pointers, Trees, and Dynamic Programming stored in `dsaCatalog.ts`.
- **Execution Model:**
  - Client provides starter code and unit test specifications.
  - Submissions are evaluated by the backend against hidden test cases.
  - `codeReviewService` performs AST and regex pattern checks to determine algorithmic time/space complexity ($O(n)$ vs $O(n^2)$).
  - Submissions persist to `CodingSubmission` and update student XP and streak days.
- **AWS Mapping:** High-frequency submissions and execution logs map to Amazon DynamoDB for low-latency writes.

---

## 13. Mock Interview Architecture

- **Session Initialization:** `POST /api/interview/start` accepts role, difficulty, and interview type (DSA, Core CS, Behavioral, System Design, Mixed).
- **Question Generation:** Dynamically pulls or generates questions with an ideal answer rubric, key points, and evaluation criteria.
- **Answer Evaluation:** `POST /api/interview/respond` analyzes candidate response against the rubric using STAR criteria (Situation, Task, Action, Result) and scores technical depth, problem-solving, and communication.
- **Persistence:** Full transcript, question by question score, and feedback summaries persist in `InterviewSession`.

---

## 14. Course Architecture

- **Hierarchical Relational Structure:**
  - `Course` (1) ── (N) `Lecture`
  - `Course` (1) ── (N) `Quiz` ── (N) `QuizQuestion`
  - `Course` (1) ── (N) `Enrollment` ── (1) `User`
- **Lecture Delivery:** Supports markdown text summaries, duration tracking, and external video URLs.
- **Access Control:** `requireEnrollment` middleware ensures only enrolled students can view lectures and take quizzes.

---

## 15. Notification Architecture

- **Entities:** `Notification` model with fields `userId`, `title`, `message`, `type` (`QUIZ_DUE`, `REVISION`, `STREAK`, `BADGE`, `MILESTONE`), and `isRead`.
- **Delivery Mechanism:** REST polling via `GET /api/auth/notifications`.
- **AWS Target:** Amazon SNS for urgent student alerts (email/SMS), Amazon EventBridge for decoupling event generation from notification ingestion, and DynamoDB for low-latency unread badge counts.

---

## 16. User / Student / Instructor Data Model

```
┌─────────────────────────────────────────────────────────────┐
│                           User                              │
│ id (UUID), email, password, name, role (STUDENT|INSTRUCTOR) │
└──────────────┬──────────────────────────────┬───────────────┘
               │ 1:1                          │ 1:N
               ▼                              ▼
┌──────────────────────────────┐ ┌───────────────────────────┐
│        StudentProfile        │ │        Enrollment         │
│ bio, targetRole, careerGoal  │ │ userId, courseId, date    │
│ readinessScore, technicalSc. │ └───────────────────────────┘
│ xp, streakDays, knownTechs   │
└──────────────┬───────────────┘
               │ 1:N
               ▼
┌──────────────────────────────┐ ┌───────────────────────────┐
│         StudentSkill         │ │     InterviewSession      │
│ userId, skillId, level, stat │ │ roleTarget, type, scores  │
└──────────────────────────────┘ └───────────────────────────┘
               │ 1:N                          │ 1:N
               ▼                              ▼
┌──────────────────────────────┐ ┌───────────────────────────┐
│       CodingSubmission       │ │      ResumeAnalysis       │
│ problemId, code, status, ms  │ │ targetRole, atsScore, json│
└──────────────────────────────┘ └───────────────────────────┘
```

---

## 17. Environment Variables & Secrets Required

> **Security Note:** No actual secrets are displayed below; only configuration variable keys are audited.

### Backend (`server/.env`)
- `PORT`: HTTP port (default `5000`)
- `NODE_ENV`: Runtime environment (`development`, `production`)
- `DATABASE_URL`: Connection string (SQLite file path or PostgreSQL RDS URI)
- `JWT_SECRET`: Secret key for local JWT signing
- `COGNITO_USER_POOL_ID`: AWS Cognito User Pool Identifier
- `COGNITO_CLIENT_ID`: AWS Cognito App Client Identifier
- `COGNITO_REGION`: AWS Region for Cognito (e.g. `ap-south-1`)
- `AWS_REGION`: AWS Region for Bedrock, S3, Textract, SQS
- `S3_USER_DATA_BUCKET`: Private S3 bucket for resumes and documents
- `AI_PROVIDER`: Switch between `local` (heuristic) and `bedrock` (Amazon Bedrock)
- `BEDROCK_MODEL_ID`: Foundation model ID (`anthropic.claude-3-5-sonnet-20241022-v2:0`)
- `BEDROCK_REGION`: Region hosting Bedrock endpoints (e.g. `us-east-1`)
- `SQS_RESUME_QUEUE_URL`: URL of SQS resume queue
- `EVENTBRIDGE_BUS_NAME`: Custom EventBridge bus identifier
- `SNS_NOTIFICATION_TOPIC_ARN`: ARN for student alert broadcast topic

### Frontend (`client/.env`)
- `VITE_API_BASE_URL`: Base URL for API Gateway or backend server
- `VITE_COGNITO_USER_POOL_ID`: Public Cognito User Pool ID
- `VITE_COGNITO_CLIENT_ID`: Public Cognito App Client ID (no secret)
- `VITE_COGNITO_REGION`: Region of Cognito User Pool

---

## 18. Current Deployment Method

- **Current State:** Run as standalone local processes via `npm run dev` (Vite dev server on port `5173`, Express server on port `5000` via `tsx`).
- **Production Build:**
  - Client compiles to static assets under `client/dist/` via `tsc -b && vite build`.
  - Server compiles to JavaScript under `server/dist/` via `tsc`.
- **Target AWS Deployment:**
  - Frontend: S3 Static Website Hosting behind CloudFront CDN with Route 53 DNS.
  - Backend: Containerized on Amazon ECS Fargate or deployed as modular AWS Lambda microservices behind API Gateway.

---

## 19. Dependencies That May Affect AWS Deployment

1. **`aws-jwt-verify` / `amazon-cognito-identity-js`**:
   - Modern, lightweight, and fully compatible with Node 20 and browser runtimes.
2. **`@prisma/client` & native engines**:
   - When deploying to AWS Lambda or Linux containers (Alpine), Prisma requires native binary engines (`linux-musl` or `rhel-openssl`). Handled in Dockerfile via `npx prisma generate`.
3. **`bcryptjs`**:
   - Pure JavaScript implementation; no native C++ compilation bindings required. Runs cleanly on AWS Lambda or Fargate without OS compatibility issues.

---

## 20. Long-Running & Background Jobs

1. **Resume OCR & AI Extraction**:
   - Amazon Textract and Bedrock processing can take between 5 to 15 seconds for multi-page documents.
   - **Recommendation:** Process asynchronously via **Amazon SQS** and worker Lambda/Fargate tasks rather than blocking synchronous HTTP request threads.
2. **Spaced Repetition Scheduler**:
   - Calculating due revision topics daily.
   - **Recommendation:** Triggered daily via **Amazon EventBridge Scheduled Rules** (cron).

---

## 21. Files That Must NOT Be Publicly Accessible

- Any uploaded student resumes (`resumes/{userId}/*`). Resumes contain PII (full names, phone numbers, home addresses, employment histories).
- Student certification proofs, private project code, and interview session transcripts.
- Server environment variables (`.env`), database migration files with raw credentials, and SQLite `.db` binaries.
- **Rule:** The `skillforge-user-data` S3 bucket must have S3 Block Public Access enabled at all times.

---

## 22. Performance & Scaling Concerns

1. **SQLite Concurrency Bottleneck**: SQLite locks the database file on writes, making it unsuitable for multi-instance production workloads. Migration to **Amazon RDS PostgreSQL** is critical for scale.
2. **Synchronous AI Processing**: Parsing large resumes synchronously ties up Express event loop threads. Offloading to **SQS** eliminates thread starvation.
3. **High-Frequency State**: Rapid quiz question submissions and playground runs can strain RDS connection pools. Moving submission logs to **DynamoDB** ensures sub-10ms response times at any scale.

---

## 23. Security Concerns & Mitigations

1. **Direct Public S3 Access**: Mitigated by enforcing CloudFront Origin Access Control (OAC) for frontend assets and presigned URLs for private files.
2. **Overprivileged Roles**: All Lambda execution roles and ECS task roles must follow least-privilege IAM policies without `AdministratorAccess`.
3. **Hardcoded Secrets**: Mitigated by storing RDS credentials and JWT secrets in **AWS Secrets Manager** and loading via IAM roles.
4. **Denial of Service / Brute Force**: Mitigated by attaching **AWS WAF v2** with rate-based rules (2,000 requests / 5 minutes) to CloudFront and API Gateway.

---

## 24. AWS Service Mapping & Necessity Classification

| Existing Component | Target AWS Service | Classification | Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend Assets** | **Amazon S3** | **Necessary** | High durability, low-cost static asset storage. |
| **Frontend CDN** | **Amazon CloudFront** | **Necessary** | Global edge caching, TLS 1.3 encryption, SPA routing rewrite. |
| **DNS Management** | **Amazon Route 53** | **Optional** | Only required if a custom domain (e.g. `skillforge.io`) is linked. |
| **User Identity** | **Amazon Cognito** | **Necessary** | Managed auth, token issuance, password resets, role groups. |
| **API Entrypoint** | **Amazon API Gateway v2** | **Necessary** | HTTP API with native Cognito JWT authorizer & throttling. |
| **Backend Compute** | **AWS Lambda / ECS Fargate**| **Necessary** | Serverless or containerized compute scaling to zero or auto-scaling. |
| **Relational Data** | **Amazon RDS PostgreSQL** | **Necessary** | Replaces SQLite with high-availability ACID database. |
| **Submissions & Activity**| **Amazon DynamoDB** | **Necessary** | High-throughput low-latency storage for submissions and streaks. |
| **Job Queueing** | **Amazon SQS** | **Necessary** | Buffers resume analysis traffic spikes with DLQ protection. |
| **Student Alerts** | **Amazon SNS** | **Optional** | Required only for external email/SMS notifications; optional for in-app. |
| **Event Bus** | **Amazon EventBridge** | **Necessary** | Decouples domain events (`ResumeAnalyzed`, `DSAQuestionSolved`). |
| **Complex Orchestration** | **AWS Step Functions** | **Optional** | Excellent for visual resume pipeline tracing; can be simplified to SQS worker. |
| **Document OCR** | **Amazon Textract** | **Necessary** | Production-grade PDF resume text extraction. |
| **Generative AI** | **Amazon Bedrock** | **Necessary** | Foundation models for ATS matching, interview prep, and career copilot. |
| **Monitoring & Alarms**| **Amazon CloudWatch** | **Necessary** | Centralized logs, error metrics, and latency alarms. |
| **Distributed Tracing** | **AWS X-Ray** | **Optional** | Recommended for diagnosing cross-service latency bottlenecks. |
| **Audit Logging** | **AWS CloudTrail** | **Necessary** | Security compliance tracking all AWS API management actions. |
| **Access Control** | **AWS IAM** | **Necessary** | Least-privilege permission boundaries for all compute resources. |
| **Data Encryption** | **AWS KMS** | **Necessary** | Customer-managed keys encrypting S3, RDS, DynamoDB, and secrets. |
| **Secrets Storage** | **AWS Secrets Manager** | **Necessary** | Eliminates plain-text database credentials in code or configs. |
| **Edge Protection** | **AWS WAF v2** | **Necessary** | Protects endpoints against SQL injection, XSS, and layer 7 DDoS. |
| **Container Registry** | **Amazon ECR** | **Optional** | Only needed if deploying backend via Docker / ECS Fargate. |
| **Container Orchestration**| **Amazon ECS Fargate** | **Optional** | Alternative to Lambda if long-lived Express container is preferred. |
| **Build Automation** | **AWS CodeBuild / GitHub Actions**| **Necessary** | Automated build and test verification on every commit. |
| **Deployment Pipeline**| **AWS CodePipeline / GitHub Actions**| **Necessary** | Continuous deployment of frontend and backend. |
| **Custom ML Training** | **Amazon SageMaker** | **Optional** | Not needed currently; existing Bedrock models cover all AI features. |

---

## 25. Proposed Migration Architecture & Phased Roadmap

### Phase 1 — Core Deployment
- Set up AWS account, IAM baseline roles (no `AdministratorAccess`), KMS CMK key, and AWS Budgets ($50/month threshold).
- Provision S3 `skillforge-frontend` bucket and CloudFront distribution with Origin Access Control (OAC).
- Build and deploy React frontend to S3/CloudFront; verify SPA routing (`/index.html` on 403/404).

### Phase 2 — Authentication Migration
- Provision Amazon Cognito User Pool and App Client.
- Create user groups (`students`, `instructors`, `administrators`).
- Update backend API Gateway / Express middleware to validate Cognito JWT tokens.
- Verify sign-up, sign-in, and role propagation on frontend.

### Phase 3 — Database & Backend Migration
- Provision Amazon RDS PostgreSQL 16.1 in private VPC subnets.
- Store database credentials securely in AWS Secrets Manager.
- Run Prisma migrations (`prisma migrate deploy`) to create schema tables.
- Deploy backend to AWS Lambda (via API Gateway HTTP API) or ECS Fargate.
- Provision DynamoDB tables for high-frequency submissions and streaks.

### Phase 4 — AI & Resume Processing Pipeline
- Configure private S3 bucket `skillforge-user-data` with KMS encryption and CORS.
- Implement presigned upload URL generation in backend.
- Connect Amazon Textract for PDF text extraction.
- Integrate Amazon Bedrock (`Claude 3.5 Sonnet`) for structured ATS resume matching, interview evaluations, and career guidance.

### Phase 5 — Notifications & Background Processing
- Set up Amazon SQS queue with Dead-Letter Queue (DLQ) for asynchronous resume parsing.
- Deploy AWS Step Functions state machine or worker Lambda for decoupled execution.
- Provision Amazon EventBridge event bus for domain events (`ResumeAnalyzed`, `CourseCompleted`).
- Configure Amazon SNS for student alerts.

### Phase 6 — Security, Monitoring & Governance
- Attach AWS WAF v2 to CloudFront and API Gateway (OWASP Top 10 + rate limiting).
- Enable AWS CloudTrail for multi-region management event auditing.
- Set up Amazon CloudWatch metrics, alarms (Lambda errors, API 5XXs, SQS DLQ messages), and dashboard.

### Phase 7 — Automated CI/CD
- Configure GitHub Actions or AWS CodePipeline.
- Automated pipeline running linting, TypeScript compilation, resilience unit tests, S3 static sync, and CloudFront cache invalidation on `main` branch merges.

---

## 26. Architectural Diagrams

### A. Current Architecture Diagram (Local / Monolithic)
```
[ Browser Client (React/Vite) ]
              │
              │ HTTP / JSON (Port 5000)
              ▼
[ Express Application Server (Node.js) ]
  ├── JWT Auth Middleware (Local Secret & Optional Cognito)
  ├── Route Controllers (Courses, DSA, Quizzes, Adaptive)
  ├── In-Memory Heuristic AI Engine (aiServices.ts)
  └── Prisma ORM Client
              │
              ▼
[ Local File Storage (SQLite dev.db) ]
```

### B. Proposed AWS Target Architecture Diagram
```
                              [ Route 53 (DNS) ]
                                      │
                                      ▼
                             [ AWS WAF v2 (Firewall) ]
                                      │
                                      ▼
                        [ Amazon CloudFront (Global CDN) ]
                         │                              │
          Static Assets  │                              │ Dynamic /api/* Traffic
                         ▼                              ▼
            [ S3: skillforge-frontend ]       [ Amazon API Gateway v2 ]
                 (Private + OAC)                        │
                                                        ▼ (Cognito JWT Auth)
                                              [ AWS Lambda / ECS Fargate ]
                                                        │
                         ┌──────────────────────────────┼──────────────────────────────┐
                         ▼                              ▼                              ▼
             [ Amazon RDS PostgreSQL ]       [ Amazon DynamoDB ]             [ S3: skillforge-user-data ]
             (Users, Courses, Quizzes)      (Submissions, Streaks)            (Private Resumes + KMS)
                                                                                       │
                                                                                       ▼
                                                                             [ Amazon Textract (OCR) ]
                                                                                       │
                                                                                       ▼
                                                                             [ Amazon SQS Queue / DLQ ]
                                                                                       │
                                                                                       ▼
                                                                             [ Amazon Bedrock AI ]
                                                                             (Claude 3.5 Sonnet)
                                                                                       │
                                                                                       ▼
                                                                             [ EventBridge & SNS ]
```

---

## 27. Migration Risk Assessment

| Risk Item | Severity | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Prisma SQLite to PostgreSQL Syntax Drift** | Medium | Query failures on non-standard SQL functions. | The codebase uses standard Prisma query builders without raw SQLite SQL; schema is verified compatible. |
| **Bedrock Quota / Region Availability** | Medium | Bedrock API throttle or unavailable model in target region. | Retain existing deterministic heuristic AI engine as an automated fallback. |
| **Presigned URL Expiry / CORS Failures** | Low | S3 direct upload rejected by browser. | Strictly configure S3 CORS with allowed PUT methods, headers (`*`), and origin whitelists. |
| **Cognito User Pool Synchronization** | Low | Missing user profiles in RDS on initial Cognito login. | Auth middleware automatically upserts user records to RDS on first valid token presentation. |
| **Cloud Cost Overruns** | Medium | Unmonitored recursive Lambda invocations or idle RDS instances. | Configured AWS Budgets alert at $50/mo and serverless on-demand billing models. |

---

## 28. Phase Complexity & Implementation Order

| Phase | Title | Complexity | Estimated Effort | Recommended Order |
| :---: | :--- | :---: | :---: | :---: |
| **1** | Core Deployment (S3, CloudFront, IAM, Budgets) | Low | 1–2 hours | **Step 1** |
| **2** | Authentication (Cognito User Pool, App Client, RBAC) | Medium | 2–3 hours | **Step 2** |
| **3** | Database & Backend (RDS PostgreSQL, Secrets Manager, DynamoDB) | High | 4–6 hours | **Step 3** |
| **4** | AI & Resume Pipeline (S3 Presigned, Textract, Bedrock) | High | 4–6 hours | **Step 4** |
| **5** | Notifications & Background Processing (SQS, SNS, EventBridge) | Medium | 2–3 hours | **Step 5** |
| **6** | Security & Monitoring (WAF, CloudWatch Dashboard, CloudTrail) | Medium | 2–3 hours | **Step 6** |
| **7** | Automated CI/CD (GitHub Actions / CodePipeline) | Low | 1–2 hours | **Step 7** |

---
*Audit completed successfully. No application code has been modified or deleted. All existing functionality remains fully operational.*
