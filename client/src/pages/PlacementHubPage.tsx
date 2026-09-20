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
  FolderGit2
} from 'lucide-react';
import client from '../api/client';
import { PLACEMENT_SUBJECTS } from '../data/quizzesCatalog';

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
    quizId: 'quiz-dsa-fundamentals'
  },
  {
    company: 'TCS Digital / Infosys SP / Cognizant',
    tag: 'Service & IT Excellence',
    focus: 'Advanced Quantitative Aptitude, SQL Window Functions, OOP in Java/C++',
    primaryProblem: 'best-time-to-buy-and-sell-stock',
    category: 'Arrays',
    quizId: 'quiz-sql-mastery'
  },
  {
    company: 'Fintech & High-Growth Startups',
    tag: 'Production Engineering',
    focus: 'ACID Transactions, Distributed Locks, PostgreSQL Indexing, Spring/Node APIs',
    primaryProblem: 'number-of-islands',
    category: 'DFS',
    quizId: 'quiz-dbms'
  }
];

const PlacementHubPage: React.FC = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [codingStats, setCodingStats] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, { score: number; total: number; percentage: number; date: string }>>({});
  const [activeCategoryTab, setActiveCategoryTab] = useState<'ALL' | 'CS_FUNDAMENTALS' | 'SYSTEM_DESIGN' | 'APTITUDE'>('ALL');

  useEffect(() => {
    // Load local storage completed assessment history
    try {
      const stored = localStorage.getItem('skillforge_completed_quizzes');
      if (stored) {
        setCompletedQuizzes(JSON.parse(stored));
      }
    } catch {}

    const fetchData = async () => {
      try {
        const [profileRes, codingRes, interviewRes] = await Promise.allSettled([
          client.get('/profile'),
          client.get('/coding/stats'),
          client.get('/interview/history')
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value.data) {
          setProfileData(profileRes.value.data);
        }
        if (codingRes.status === 'fulfilled' && codingRes.value.data) {
          setCodingStats(codingRes.value.data);
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

  const profile = profileData?.profile;
  const stats = profileData?.stats;

  const solvedCount = codingStats?.totalSolved ?? stats?.problemsSolved ?? 0;
  const attemptedCount = codingStats?.totalAttempted ?? 0;
  const codingAccuracy = codingStats?.accuracy ?? 0;

  const interviewCount = interviews.length;
  const averageInterviewScore = interviewCount > 0
    ? Math.round(interviews.reduce((acc, cur) => acc + (cur.overallScore || 0), 0) / interviewCount)
    : null;

  // Real assessment completion counts by category
  const csSubjects = PLACEMENT_SUBJECTS.filter(s => s.category === 'CS_FUNDAMENTALS');
  const sdSubjects = PLACEMENT_SUBJECTS.filter(s => s.category === 'SYSTEM_DESIGN');
  const aptSubjects = PLACEMENT_SUBJECTS.filter(s => s.category === 'APTITUDE');

  const csCompleted = csSubjects.filter(s => completedQuizzes[s.quizId]);
  const sdCompleted = sdSubjects.filter(s => completedQuizzes[s.quizId]);
  const aptCompleted = aptSubjects.filter(s => completedQuizzes[s.quizId]);

  const totalAssessmentsTaken = Object.keys(completedQuizzes).length;
  const targetRole = profile?.targetRole || profile?.careerGoal || 'Software Engineer';

  // Overall Readiness Score calculated from user submissions
  const dsaComponent = Math.min(100, Math.round((solvedCount / 30) * 100));
  const quizComponent = Math.min(100, Math.round((totalAssessmentsTaken / 10) * 100));
  const interviewComponent = averageInterviewScore ?? (interviewCount > 0 ? 70 : 0);

  const hasRealActivity = solvedCount > 0 || interviewCount > 0 || totalAssessmentsTaken > 0;
  const calculatedOverallReadiness = hasRealActivity
    ? Math.round((dsaComponent * 0.40) + (quizComponent * 0.30) + (interviewComponent * 0.30))
    : null;

  // Filtered list based on active tab
  const filteredSubjects = activeCategoryTab === 'ALL'
    ? PLACEMENT_SUBJECTS
    : PLACEMENT_SUBJECTS.filter(s => s.category === activeCategoryTab);

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
                Objective placement readiness calibrated from your verified DSA coding submissions, subject-separated diagnostic assessments, and AI mock interview evaluations.
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
                <FolderGit2 className="h-4 w-4 text-amber-400" /> Resume Analyzer
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
                  Target: {targetRole}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">
                Calculated from Verified Submissions & Real User Progress
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-3xl font-black text-emerald-400">
                  {calculatedOverallReadiness !== null ? `${calculatedOverallReadiness}%` : 'Pending'}
                </div>
                <div className="text-[11px] text-slate-400 font-semibold">
                  {calculatedOverallReadiness !== null ? 'Overall Placement Readiness' : 'Take assessments below'}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Award className="h-7 w-7" />
              </div>
            </div>
          </div>

          {/* Core Placement Pillars Progress Meters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Pillar 1: DSA Coding Submissions */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">DSA Playground</span>
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
                <span>{attemptedCount > 0 ? `${codingAccuracy}% accuracy` : '120 catalog problems'}</span>
                <Link to="/playground" className="text-emerald-400 hover:underline">Solve →</Link>
              </div>
            </div>

            {/* Pillar 2: CS Core Diagnostics */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">CS Fundamentals</span>
                <span className="font-bold text-blue-400">
                  {`${csCompleted.length} / ${csSubjects.length} Completed`}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${(csCompleted.length / csSubjects.length) * 100}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>DBMS, OS, CN, OOP</span>
                <button onClick={() => setActiveCategoryTab('CS_FUNDAMENTALS')} className="text-blue-400 hover:underline">View 8 →</button>
              </div>
            </div>

            {/* Pillar 3: System Design Diagnostics */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">System Design</span>
                <span className="font-bold text-purple-400">
                  {`${sdCompleted.length} / ${sdSubjects.length} Completed`}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${(sdCompleted.length / sdSubjects.length) * 100}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Beginner, Int, Adv</span>
                <button onClick={() => setActiveCategoryTab('SYSTEM_DESIGN')} className="text-purple-400 hover:underline">View 3 →</button>
              </div>
            </div>

            {/* Pillar 4: Aptitude Diagnostics */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Aptitude & Logic</span>
                <span className="font-bold text-amber-400">
                  {`${aptCompleted.length} / ${aptSubjects.length} Completed`}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                  style={{ width: `${(aptCompleted.length / aptSubjects.length) * 100}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Quant, Logic, Verbal, DI</span>
                <button onClick={() => setActiveCategoryTab('APTITUDE')} className="text-amber-400 hover:underline">View 4 →</button>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SUBJECT-SEPARATED DIAGNOSTIC ASSESSMENTS SECTION (PHASE 5) */}
        {/* ======================================================== */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                <Cpu className="h-4 w-4 text-indigo-400" /> Dedicated Technical Assessment Library
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Separated Subject Collections & Real Evaluations
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Each subject provides dedicated, verified questions with immediate scoring, objective percentages, and detailed answer explanations.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'ALL', label: `All Subjects (${PLACEMENT_SUBJECTS.length})` },
                { id: 'CS_FUNDAMENTALS', label: `CS Fundamentals (${csSubjects.length})` },
                { id: 'SYSTEM_DESIGN', label: `System Design (${sdSubjects.length})` },
                { id: 'APTITUDE', label: `Aptitude & Logic (${aptSubjects.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeCategoryTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSubjects.map((subj) => {
              const attempt = completedQuizzes[subj.quizId];
              const isPassed = attempt && attempt.percentage >= 60;

              return (
                <div
                  key={subj.id}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        subj.category === 'CS_FUNDAMENTALS'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : subj.category === 'SYSTEM_DESIGN'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {subj.category.replace('_', ' ')}
                      </span>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        subj.difficulty === 'Beginner'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : subj.difficulty === 'Intermediate'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {subj.difficulty}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                      {subj.subject}
                    </h4>

                    <div className="text-[11px] font-semibold text-indigo-400 mb-2">
                      {subj.topic}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {subj.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 space-y-3">
                    {/* Real Attempt Status */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono text-[11px]">
                        {subj.questionCount} Questions
                      </span>

                      {attempt ? (
                        <span className={`flex items-center gap-1 font-bold text-[11px] ${
                          isPassed ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Score: {attempt.score}/{attempt.total} ({attempt.percentage}%)
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">
                          Not Attempted
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/quiz/${subj.quizId}`}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                        attempt
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
                      }`}
                    >
                      <span>{attempt ? 'Retake Assessment' : 'Start Assessment →'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
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
                    <FileQuestion className="h-3.5 w-3.5" /> Take Assessment
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
