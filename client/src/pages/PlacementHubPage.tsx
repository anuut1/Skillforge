import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Code,
  Cpu,
  Brain,
  ArrowRight,
  CheckCircle2,
  Award,
  Flame,
  FileQuestion,
  TrendingUp,
  Target,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import client from '../api/client';

const PLACEMENT_SECTIONS = [
  {
    id: 'dsa',
    title: 'DSA Interview Sprint & LeetCode Patterns',
    icon: Code,
    desc: 'Master the top 75 high-frequency LeetCode interview patterns across Two Pointers, Trees, Graphs, and DP. Guided by Striver’s TakeUforward roadmap.',
    topics: [
      'Two Pointers & Sliding Window (Two Sum, Longest Substring)',
      'Binary Search Bounds & Monotonic Predicates',
      'Tree DFS/BFS & Graph Dijkstra/Topological Sort',
      'Dynamic Programming: Memoization to Space Tabulation'
    ],
    primaryLink: '/playground',
    primaryCta: 'Launch DSA Coding Playground',
    externalLink: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
    externalLabel: "Striver's A2Z DSA Sheet ↗"
  },
  {
    id: 'cs-core',
    title: 'CS Core Technical Fundamentals',
    icon: Cpu,
    desc: 'Crack technical screening rounds across DBMS, Operating Systems, Computer Networks, and Low-Level Object-Oriented Architecture.',
    topics: [
      'DBMS: B-Tree Indexing, ACID Guarantees & Deadlocks',
      'OS: Virtual Memory, Paging, TLB & System Calls',
      'Computer Networks: TCP 3-Way Handshake, TLS 1.3 & DNS',
      'OOP Principles: SOLID & Clean Design Patterns'
    ],
    primaryLink: '/quiz/cs-quiz',
    primaryCta: 'Take CS Core Diagnostic Assessment',
    secondaryLink: '/courses/course-dbms-sql-optimization',
    secondaryCta: 'View DBMS Optimization Course'
  },
  {
    id: 'system-design',
    title: 'System Design & Distributed Scalability',
    icon: Brain,
    desc: 'Prepare for High-Level (HLD) and Low-Level (LLD) architectural rounds required by Amazon, Google, Microsoft, and high-growth startups.',
    topics: [
      'Load Balancers, Reverse Proxies & Consistent Hashing',
      'Distributed Caching (Redis), Cache-Aside & Eviction Policies',
      'Message Queues & Event-Driven Systems (Apache Kafka)',
      'Database Sharding, Replication & CAP Theorem'
    ],
    primaryLink: '/courses/course-system-design-interview',
    primaryCta: 'High-Scale System Design Course',
    secondaryLink: '/interview',
    secondaryCta: 'AI Mock System Design Interview'
  },
  {
    id: 'aptitude',
    title: 'Aptitude & Technical Screening Hub',
    icon: Briefcase,
    desc: 'Prepare for quantitative aptitude, logical reasoning, and verbal rounds utilized in campus placements and off-campus corporate hiring tests.',
    topics: [
      'Quantitative Mathematics & Speed Arithmetic',
      'Logical Deduction, Puzzles & Data Sufficiency',
      'Verbal Reasoning & Comprehension Analysis',
      'Campus Recruitment Process Simulator'
    ],
    primaryLink: '/catalog',
    primaryCta: 'Browse Placement Prep Catalog',
    secondaryLink: '/courses/course-behavioral-interview',
    secondaryCta: 'STAR Behavioral Interview Prep'
  }
];

const COMPANY_TRACKS = [
  {
    company: 'Amazon / Big Tech (FAANG+)',
    tag: 'Tier-1 Product',
    focus: 'Leadership Principles (STAR), Medium/Hard DSA, Microservices HLD',
    primaryProblem: 'two-sum',
    category: 'Arrays',
    quizId: 'cs-quiz'
  },
  {
    company: 'Google / Meta',
    tag: 'Algorithmic Mastery',
    focus: 'Graph Topo-Sort, Trie, Segment Trees, Concurrency & Big-O Invariants',
    primaryProblem: 'course-schedule',
    category: 'Graphs',
    quizId: 'quiz-course-dsa-masterclass'
  },
  {
    company: 'TCS Digital / Infosys SP / Cognizant',
    tag: 'Service & IT Excellence',
    focus: 'Advanced Quantitative Aptitude, SQL Window Functions, OOP in Java/C++',
    primaryProblem: 'best-time-to-buy-and-sell-stock',
    category: 'Arrays',
    quizId: 'quiz-course-dbms-sql-optimization'
  },
  {
    company: 'Fintech & High-Growth Startups',
    tag: 'Production Engineering',
    focus: 'ACID Transactions, Distributed Locks, PostgreSQL Indexing, Spring/Node APIs',
    primaryProblem: 'number-of-islands',
    category: 'DFS',
    quizId: 'quiz-course-os-concurrency'
  }
];

const PlacementHubPage: React.FC = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [codingStats, setCodingStats] = useState<any>(null);
  const [latestResume, setLatestResume] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, codingRes, resumeRes, interviewRes] = await Promise.allSettled([
          client.get('/profile'),
          client.get('/coding/stats'),
          client.get('/resume/history'),
          client.get('/interview/history')
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value.data) {
          setProfileData(profileRes.value.data);
        }
        if (codingRes.status === 'fulfilled' && codingRes.value.data) {
          setCodingStats(codingRes.value.data);
        }
        if (resumeRes.status === 'fulfilled' && Array.isArray(resumeRes.value.data) && resumeRes.value.data.length > 0) {
          setLatestResume(resumeRes.value.data[0]);
        }
        if (interviewRes.status === 'fulfilled' && Array.isArray(interviewRes.value.data)) {
          setInterviews(interviewRes.value.data);
        }
      } catch (err) {
        console.error('Failed to load placement readiness metrics:', err);
      }
    };

    fetchData();
  }, []);

  // Compute calculated metrics directly from real records (no dummy numbers)
  const profile = profileData?.profile;
  const stats = profileData?.stats;

  const solvedCount = codingStats?.totalSolved ?? stats?.problemsSolved ?? 0;
  const attemptedCount = codingStats?.totalAttempted ?? 0;
  const codingAccuracy = codingStats?.accuracy ?? 0;

  const interviewCount = interviews.length;
  const averageInterviewScore = interviewCount > 0
    ? Math.round(interviews.reduce((acc, cur) => acc + (cur.overallScore || 0), 0) / interviewCount)
    : null;

  const quizCount = stats?.quizzesCompleted ?? 0;
  const resumeAtsScore = latestResume?.atsScore ?? null;
  const resumeRole = latestResume?.targetRole || latestResume?.jobTitle || profile?.targetRole || profile?.careerGoal || 'Software Engineer';
  const missingSkills: string[] = latestResume?.missingSkills || [];
  const matchingSkills: string[] = latestResume?.matchingSkills || [];

  // Calculate placement overall readiness objectively:
  // Weights: Resume (25%), DSA Problems (30%), CS Quizzes (20%), Mock Interviews (25%)
  const hasRealActivity = solvedCount > 0 || interviewCount > 0 || quizCount > 0 || resumeAtsScore !== null;
  
  const dsaComponent = Math.min(100, Math.round((solvedCount / 30) * 100));
  const quizComponent = Math.min(100, Math.round((quizCount / 5) * 100));
  const interviewComponent = averageInterviewScore ?? (interviewCount > 0 ? 70 : 0);
  const resumeComponent = resumeAtsScore ?? 0;

  const calculatedOverallReadiness = hasRealActivity
    ? Math.round((resumeComponent * 0.25) + (dsaComponent * 0.30) + (quizComponent * 0.20) + (interviewComponent * 0.25))
    : null;

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* Header Banner */}
      <div className="bg-slate-900 border-b border-slate-800 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
                <Briefcase className="h-3.5 w-3.5" /> Career Readiness Center
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                Placement & Interview Readiness Hub
              </h1>
              <p className="text-slate-400 max-w-2xl text-sm sm:text-base leading-relaxed">
                Live placement intelligence connected to your actual student submissions, target job descriptions, verified DSA problem solving, and AI mock interview evaluations.
              </p>
            </div>

            {/* Quick Actions Card */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/playground"
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
              >
                <Code className="h-4 w-4" /> Open DSA Playground
              </Link>
              <Link
                to="/interview"
                className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2"
              >
                <Brain className="h-4 w-4" /> AI Mock Interview
              </Link>
              <Link
                to="/resume"
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition-colors flex items-center gap-2"
              >
                <Target className="h-4 w-4 text-emerald-400" /> Resume Analyzer
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        
        {/* REAL-TIME PLACEMENT READINESS SCORECARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" /> Placement Readiness Index
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Target: {resumeRole}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">
                Calculated from Your Verified Platform Activity
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-3xl font-black text-emerald-400">
                  {calculatedOverallReadiness !== null ? `${calculatedOverallReadiness}%` : 'Pending'}
                </div>
                <div className="text-[11px] text-slate-400 font-semibold">
                  {calculatedOverallReadiness !== null ? 'Overall Readiness Score' : 'Not enough data yet'}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Award className="h-7 w-7" />
              </div>
            </div>
          </div>

          {/* 4 Pillars Progress Meters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pillar 1: Resume / JD Alignment */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Resume & JD Match</span>
                <span className="font-bold text-indigo-400">
                  {resumeAtsScore !== null ? `${resumeAtsScore}%` : 'Not uploaded'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${resumeAtsScore || 0}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>{latestResume ? 'Latest JD Analysis' : 'No resume scanned yet'}</span>
                <Link to="/resume" className="text-indigo-400 hover:underline">Scan JD →</Link>
              </div>
            </div>

            {/* Pillar 2: DSA Coding Submissions */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">DSA Problem Solving</span>
                <span className="font-bold text-emerald-400">
                  {solvedCount > 0 ? `${solvedCount} Solved` : '0 Solved'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                  style={{ width: `${dsaComponent}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>{attemptedCount > 0 ? `${codingAccuracy}% accuracy` : 'Not enough data yet'}</span>
                <Link to="/playground" className="text-emerald-400 hover:underline">Practice →</Link>
              </div>
            </div>

            {/* Pillar 3: CS Fundamentals Quizzes */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">CS Core Mastery</span>
                <span className="font-bold text-blue-400">
                  {quizCount > 0 ? `${quizCount} Completed` : '0 Completed'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${quizComponent}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>{quizCount > 0 ? 'DBMS, OS, Networks' : 'Not enough data yet'}</span>
                <Link to="/quiz/cs-quiz" className="text-blue-400 hover:underline">Take Quiz →</Link>
              </div>
            </div>

            {/* Pillar 4: AI Mock Interview Performance */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">AI Mock Interview</span>
                <span className="font-bold text-purple-400">
                  {averageInterviewScore !== null ? `${averageInterviewScore}% Avg` : '0 Rounds'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${averageInterviewScore || 0}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>{interviewCount > 0 ? `${interviewCount} sessions logged` : 'Not enough data yet'}</span>
                <Link to="/interview" className="text-purple-400 hover:underline">Simulate →</Link>
              </div>
            </div>
          </div>

          {/* TARGET JD SKILL GAPS & RECOMMENDATIONS (Connected to Resume Analyzer) */}
          {latestResume && (missingSkills.length > 0 || matchingSkills.length > 0) && (
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  Target JD Skill Alignment: {latestResume.targetRole || latestResume.jobTitle}
                </div>
                <span className="text-xs text-slate-400">Extracted from your latest resume scan</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Matched Skills */}
                <div>
                  <div className="text-xs font-semibold text-emerald-400 mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Matched In Resume ({matchingSkills.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchingSkills.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div>
                  <div className="text-xs font-semibold text-amber-400 mb-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> Missing Skills for This Role ({missingSkills.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.map((s, i) => (
                      <Link
                        key={i}
                        to={`/playground?category=All`}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium hover:bg-amber-500/20 transition-colors"
                      >
                        {s} →
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4 Core Placement Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PLACEMENT_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 hover:border-indigo-500/40 transition-all shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    {sec.externalLink && (
                      <a
                        href={sec.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full transition-colors"
                      >
                        <span>{sec.externalLabel}</span>
                      </a>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-white mb-2">{sec.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{sec.desc}</p>

                  <div className="space-y-2.5 mb-8">
                    {sec.topics.map((t, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
                  <Link
                    to={sec.primaryLink}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 group"
                  >
                    <span>{sec.primaryCta}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {sec.secondaryLink && (
                    <Link
                      to={sec.secondaryLink}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                    >
                      <span>{sec.secondaryCta}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Company-Specific Placement Pathways */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                <Flame className="h-4 w-4 text-amber-500" /> Target Hiring Tracks
              </div>
              <h3 className="text-xl font-bold text-white">Company-Specific Interview Sprints</h3>
            </div>
            <span className="text-xs text-slate-400">Directly mapped to DSA Playground & diagnostic quizzes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMPANY_TRACKS.map((c, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 inline-block mb-2">
                    {c.tag}
                  </span>
                  <h4 className="font-bold text-white text-sm mb-1">{c.company}</h4>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">{c.focus}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800/60">
                  <Link
                    to={`/coding/${c.primaryProblem}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <Code className="h-3.5 w-3.5 text-indigo-400" /> Solve in Playground
                  </Link>
                  <Link
                    to={`/quiz/${c.quizId}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
                  >
                    <FileQuestion className="h-3.5 w-3.5" /> Company Quiz
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* External Accreditations & Guidance Philosophy */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-3">
            <Award className="h-6 w-6 text-indigo-400 shrink-0 mt-1" />
            <div>
              <h4 className="text-base font-bold text-white mb-1">
                SkillForge Career Readiness Philosophy
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
                SkillForge acts as your navigation command center: guiding you to authoritative external roadmaps (Striver’s TakeUforward DSA, official cloud certification guides, Coursera/Udemy certifications) while providing you with an integrated in-browser sandbox to simulate live technical coding assessments and AI mock interviews.
              </p>
            </div>
          </div>
          <Link
            to="/interview"
            className="px-6 py-3 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs sm:text-sm shrink-0 transition-colors shadow-lg"
          >
            Launch AI Mock Interview
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlacementHubPage;
