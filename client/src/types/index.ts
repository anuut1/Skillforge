export type Role = 'student' | 'instructor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId?: string;
  instructorName?: string;
  category: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  enrolledCount: number;
  lectureCount: number;
  price?: number;
  difficulty?: string;
  duration?: string;
  isCertificationPrep?: boolean;
  targetCertification?: string;
  certDisclaimer?: string;
  skills?: string[];
  modulesCount?: number;
  rating?: number;
}

export interface Lecture {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration: number; // in minutes
  order: number;
  isCompleted?: boolean;
}

export interface QuizQuestion {
  id: string;
  text?: string;
  questionText?: string;
  options: string[] | string;
  correctOptionIndex: number;
  explanation?: string;
  topic?: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: QuizQuestion[];
  topic?: string;
  difficulty?: string;
}

// Adaptive Platform Models
export interface StudentProfile {
  id: string;
  userId: string;
  careerGoal: string;
  targetRole?: string;
  bio?: string;
  currentLevel: string;
  weeklyTimeCommit: string;
  goalDeadline: string;
  knownTechs: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  education?: string;
  experienceYears?: string;
  readinessScore: number;
  technicalScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  interviewScore?: number;
  xp: number;
  streakDays: number;
}

export interface SkillNode {
  id: string;
  name: string;
  level: number;
  status: 'STRONG' | 'IMPROVING' | 'GAP' | 'RECOMMENDED';
  description?: string;
  bridgeCourseId?: string;
  bridgeCourseTitle?: string;
  materials?: {
    type: 'COURSE' | 'CHEATSHEET' | 'PRACTICE' | 'DOC' | 'VIDEO' | 'STRIVER' | 'COURSERA' | 'UDEMY' | 'LEETCODE';
    title: string;
    link: string;
    durationOrCount: string;
    leetcodeSlug?: string;
    badgeText?: string;
  }[];
}

export interface RoadmapMilestone {
  name: string;
  progress: number;
  status: 'MASTERED' | 'IN_PROGRESS' | 'NEEDS_FOCUS' | 'LOCKED';
  time: string;
  weakAreas: string[];
  completedTopics?: string[];
  remainingTopics?: string[];
  recommendedAction?: string;
  actionLink?: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  category: string;
  description: string;
  examples: string; // JSON string of [{input, output, explanation}]
  constraints: string; // JSON string array
  hints: string; // JSON string array
  starterCode: string; // JSON string
  referenceSolution?: string; // JSON string
  testCases: string; // JSON string
  relatedSkillName?: string;
  contentReady?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  technologies: string;
  requirements: string;
  milestones: string;
  expectedOutcome: string;
  relatedSkillName?: string;
  submissions?: any[];
}

export interface RevisionTopicItem {
  id: string;
  topic: string;
  skillName: string;
  dueDay: number;
  dueDate: string;
  retention: number;
  status: string;
}

export interface DailyChallengeData {
  id: string;
  date: string;
  codingTitle: string;
  codingDifficulty: string;
  codingConcept: string;
  quizQuestion: string;
  quizOptions: string;
  quizCorrectIdx: number;
  conceptPrompt: string;
  conceptAnswer: string;
  xpReward: number;
}

export interface SkillPassportData {
  studentName: string;
  careerGoal: string;
  careerReadiness: number;
  xp: number;
  badge: string;
  skills: { name: string; category: string; masteryPercentage: number }[];
  verifiedProjects: { title: string; githubUrl: string; score: number; verifiedAt: string }[];
  latestInterviewScore: number;
  passportId: string;
  issuedDate: string;
}

export interface DetailedResumeAnalysis {
  id?: string;
  targetRole: string;
  jobTitle: string;
  companyName: string;
  resumeVersionName?: string;
  atsScore: number;
  skillsMatchScore: number;
  experienceMatchScore: number;
  keywordMatchScore: number;
  projectMatchScore: number;
  atsFormattingScore: number;
  jobBreakdown: {
    role: string;
    experience: string;
    coreSkills: string[];
    preferred: string[];
    responsibilities: string[];
    topPriorities: string[];
  };
  matchingSkills: { name: string; whyItMatters: string }[];
  missingSkills: { name: string; priority: 'Critical' | 'Recommended'; whyItMatters: string; recommendedCourse: string }[];
  partialSkills: { name: string; whyItMatters: string }[];
  atsIssues: { issue: string; severity: 'High' | 'Medium' | 'Low'; fix: string }[];
  keywordOptimization: {
    keyword: string;
    jdFreq: number;
    resumeFreq: number;
    status: 'Matched' | 'Underrepresented' | 'Missing';
    recommendation: string;
  }[];
  sectionFeedback: {
    section: string;
    status: 'Strong' | 'Needs Improvement' | 'Missing';
    current: string;
    problem: string;
    suggested: string;
  }[];
  fixerSuggestions: {
    id: string;
    section: string;
    title: string;
    before: string;
    after: string;
    status: 'pending' | 'accepted' | 'rejected';
  }[];
  scoreDrivers?: ScoreDriver[];
  createdAt?: string;
  resumeText?: string;
  jobDescription?: string;
}

export interface ScoreDriver {
  factor: 'skill' | 'experience' | 'keyword' | 'formatting' | 'project';
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  points: number;
  explanation: string;
  evidenceSentence?: string;
  sourceLocation?: {
    section?: string;
    lineNumber?: number;
  };
  actionableTip?: string;
}

export interface RecommendationFeedbackPayload {
  recommendationType: 'COURSE' | 'PROJECT' | 'QUESTION' | 'RESUME_SKILL' | 'TOPIC';
  itemId: string;
  itemTitle: string;
  sourcePage: string;
  reason?: string;
  userComment?: string;
  metadata?: any;
}

export interface ResumeVersionItem {
  id: string;
  name: string;
  targetRole: string;
  resumeText: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InterviewQuestionItem {
  id: string;
  type: 'DSA' | 'Core CS' | 'Behavioral' | 'System Design';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  idealAnswer?: string;
  keyPoints?: string[];
}

export interface InterviewEvaluationResult {
  score: number;
  technicalKnowledge: number;
  problemSolving: number;
  communication: number;
  confidence: number;
  answerRelevance: number;
  feedback: string;
  keyImprovement: string;
  idealAnswer: string;
  keyPoints: string[];
  missingPoints: string[];
}

export interface InterviewSessionReport {
  isFinished: boolean;
  sessionId?: string;
  roleTarget?: string;
  interviewType?: string;
  difficulty?: string;
  overallScore: number;
  technicalScore: number;
  problemSolvingScore: number;
  communicationScore: number;
  confidenceScore: number;
  relevanceScore: number;
  strengths: string[];
  improvements: string[];
  transcript: {
    questionNumber: number;
    questionId?: string;
    questionType?: string;
    difficulty?: string;
    question: string;
    answer: string;
    evaluation: InterviewEvaluationResult;
  }[];
  createdAt?: string;
}


