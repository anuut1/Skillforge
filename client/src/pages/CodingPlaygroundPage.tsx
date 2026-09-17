import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Play,
  CheckCircle2,
  XCircle,
  Sparkles,
  Terminal,
  Code2,
  Clock,
  Cpu,
  Search,
  Flame,
  Target,
  ChevronRight,
  RotateCcw,
  Layers,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import client from '../api/client';
import type { CodingProblem } from '../types';
import { RecommendationFeedbackButton } from '../components/common/RecommendationFeedbackButton';

interface ProblemListItem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  relatedSkillName?: string;
  userStatus: 'Solved' | 'Attempted' | 'Unsolved';
}

interface PlaygroundStats {
  totalProblems: number;
  totalSolved: number;
  totalAttempted: number;
  accuracy: number;
  streakDays: number;
  xp: number;
  byDifficulty: {
    Easy: { total: number; solved: number; attempted: number };
    Medium: { total: number; solved: number; attempted: number };
    Hard: { total: number; solved: number; attempted: number };
  };
  topicProgress: Record<string, { total: number; solved: number; attempted: number }>;
  todayGoal: {
    target: number;
    solvedToday: number;
    isCompleted: boolean;
    xpReward: number;
  };
  recommendedProblems: {
    id: string;
    title: string;
    slug: string;
    difficulty: string;
    category: string;
    reason: string;
  }[];
  recentSubmissions: {
    id: string;
    problemTitle: string;
    problemSlug: string;
    difficulty: string;
    category: string;
    language: string;
    status: string;
    passedTests: number;
    totalTests: number;
    runtimeMs: number;
    memoryMb: number;
    createdAt: string;
  }[];
}

const ALL_CATEGORIES = [
  'All',
  'Arrays',
  'Strings',
  'Hashing',
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Sorting',
  'Linked List',
  'Stack',
  'Queue',
  'Deque',
  'Recursion',
  'Backtracking',
  'Trees',
  'Binary Search Tree',
  'Heap / Priority Queue',
  'Greedy',
  'Graphs',
  'BFS',
  'DFS',
  'Dynamic Programming',
  'Bit Manipulation',
  'Tries',
  'Intervals',
  'Matrix',
  'Math / Number Theory'
];

const CodingPlaygroundPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  // Mode: 'library' or 'editor'
  const isEditorMode = Boolean(slug);

  // Editor State
  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [language, setLanguage] = useState<'javascript' | 'python' | 'java' | 'cpp'>('javascript');
  const [code, setCode] = useState('');
  const [outputTab, setOutputTab] = useState<'results' | 'review'>('results');
  const [isRunning, setIsRunning] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Library / Dashboard State
  const [stats, setStats] = useState<PlaygroundStats | null>(null);
  const [problemsList, setProblemsList] = useState<ProblemListItem[]>([]);
  const [categories, setCategories] = useState<string[]>(ALL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeViewTab, setActiveViewTab] = useState<'problems' | 'topics' | 'submissions'>('problems');
  const [loading, setLoading] = useState(true);

  // React to changes in URL category param
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setActiveViewTab('problems');
    }
  }, [categoryParam]);

  // Load Dashboard Stats & Categories
  useEffect(() => {
    client.get('/coding/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('Failed to load stats:', err));

    client.get('/coding/categories')
      .then(res => {
        if (res.data?.categories) {
          setCategories(['All', ...res.data.categories]);
        }
      })
      .catch(() => {});
  }, [slug]);

  // Load Problems Catalog for Library
  useEffect(() => {
    if (!isEditorMode || activeViewTab === 'problems') {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'All') params.append('difficulty', selectedDifficulty);
      if (selectedStatus !== 'All') params.append('status', selectedStatus);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      client.get(`/coding/problems?${params.toString()}`)
        .then(res => {
          if (Array.isArray(res.data)) {
            setProblemsList(res.data);
          }
        })
        .catch(err => console.error('Failed to load problems:', err))
        .finally(() => setLoading(false));
    }
  }, [isEditorMode, selectedCategory, selectedDifficulty, selectedStatus, searchQuery, activeViewTab]);

  // Load Problem for Workspace
  useEffect(() => {
    if (slug) {
      client.get(`/coding/problems/${slug}`)
        .then(res => {
          setProblem(res.data);
          if (res.data.starterCode) {
            try {
              const starters = JSON.parse(res.data.starterCode);
              if (starters[language]) {
                setCode(starters[language]);
              }
            } catch {}
          }
        })
        .catch(err => console.error('Error fetching problem:', err));
    }
  }, [slug]);

  // Handle language switch in workspace
  const handleLanguageChange = (newLang: 'javascript' | 'python' | 'java' | 'cpp') => {
    setLanguage(newLang);
    if (problem?.starterCode) {
      try {
        const starters = JSON.parse(problem.starterCode);
        if (starters[newLang]) {
          setCode(starters[newLang]);
        }
      } catch {}
    }
  };

  // Run and Submit code
  const handleRunAndSubmit = async () => {
    if (!problem) return;
    setIsRunning(true);
    setSubmissionResult(null);

    try {
      const res = await client.post('/coding/submit', {
        problemId: problem.id,
        language,
        code
      });
      setSubmissionResult(res.data);
      setOutputTab('results');

      // Refresh stats in background
      client.get('/coding/stats')
        .then(res => setStats(res.data))
        .catch(() => {});
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  // =========================================================================
  // VIEW A: WORKSPACE / CODING PLAYGROUND (When a problem is selected)
  // =========================================================================
  if (isEditorMode) {
    if (!problem) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
          <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading code workspace for {slug}...</span>
        </div>
      );
    }

    const examples = (() => {
      try { return JSON.parse(problem.examples); } catch { return []; }
    })();
    const constraints = (() => {
      try { return JSON.parse(problem.constraints); } catch { return []; }
    })();
    const hints = (() => {
      try { return JSON.parse(problem.hints); } catch { return []; }
    })();

    return (
      <div className="h-[calc(100vh-4rem)] bg-slate-950 flex flex-col overflow-hidden">
        {/* Workspace Sub-header */}
        <div className="h-11 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/playground')}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Problem Library</span>
            </button>
            <span className="text-slate-700">|</span>
            <span className="text-xs font-bold text-white truncate max-w-[240px] sm:max-w-md">
              {problem.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://leetcode.com/problems/${problem.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
              title="Practice this question directly on LeetCode"
            >
              <span>Solve on LeetCode</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
              problem.difficulty === 'Easy'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : problem.difficulty === 'Medium'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {problem.difficulty}
            </span>
            <span className="text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-semibold hidden sm:inline-block">
              {problem.category}
            </span>
          </div>
        </div>

        {/* Workspace Panes */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* LEFT PANE: Description, Examples, Constraints, Hints */}
          <div className="w-full lg:w-1/2 h-1/2 lg:h-full overflow-y-auto border-r border-slate-800 p-6 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-3">{problem.title}</h1>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{problem.description}</p>
            </div>

            {/* Examples */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Test Cases & Examples</h2>
              {examples.map((ex: any, idx: number) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-300 space-y-1">
                  <div><strong className="text-indigo-400">Input:</strong> {ex.input}</div>
                  <div><strong className="text-emerald-400">Output:</strong> {ex.output}</div>
                  {ex.explanation && <div><strong className="text-slate-500">Explanation:</strong> {ex.explanation}</div>}
                </div>
              ))}
            </div>

            {/* Constraints */}
            {constraints.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Constraints</h2>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 font-mono">
                  {constraints.map((c: string, idx: number) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hints */}
            {hints.length > 0 && (
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2 text-xs text-indigo-300">
                <div className="font-bold flex items-center gap-1.5 text-indigo-200">
                  <Sparkles className="h-4 w-4 text-indigo-400" /> Algorithmic Hints
                </div>
                {hints.map((h: string, idx: number) => (
                  <p key={idx}>• {h}</p>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT PANE: Code Editor + Run & Submit + AI Review */}
          <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col bg-slate-900">
            {/* Editor Toolbar */}
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-indigo-400" />
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value as any)}
                  className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="javascript">JavaScript (Node.js)</option>
                  <option value="python">Python 3.12</option>
                  <option value="java">Java 21</option>
                  <option value="cpp">C++ 20 (GCC)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (problem?.starterCode) {
                      try {
                        const starters = JSON.parse(problem.starterCode);
                        if (starters[language]) setCode(starters[language]);
                      } catch {}
                    }
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Reset starter template"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handleRunAndSubmit}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  {isRunning ? 'Running Test Suite...' : 'Run & Submit Solution'}
                </button>
              </div>
            </div>

            {/* Code Textarea / Editor */}
            <div className="flex-1 p-2 bg-slate-950 overflow-hidden relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-slate-900/90 text-slate-100 font-mono text-xs sm:text-sm p-4 rounded-xl resize-none focus:outline-none border border-slate-800 shadow-inner leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Bottom Output / AI Review Drawer */}
            <div className="h-48 sm:h-56 bg-slate-900 border-t border-slate-800 flex flex-col">
              <div className="flex items-center gap-4 px-4 pt-2 border-b border-slate-800/80 text-xs font-semibold">
                <button
                  onClick={() => setOutputTab('results')}
                  className={`pb-2 border-b-2 transition-colors ${
                    outputTab === 'results' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'
                  }`}
                >
                  Execution Status
                </button>
                <button
                  onClick={() => setOutputTab('review')}
                  className={`pb-2 border-b-2 flex items-center gap-1.5 transition-colors ${
                    outputTab === 'review' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> AI Code Review
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 text-xs">
                {outputTab === 'results' && (
                  <div>
                    {submissionResult ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 ${
                            submissionResult.submission.status === 'Accepted'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {submissionResult.submission.status === 'Accepted' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                            {submissionResult.submission.status}
                          </span>
                          <span className="text-slate-400">
                            {submissionResult.submission.passedTests} / {submissionResult.submission.totalTests} test cases passed
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-slate-300">
                          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-indigo-400" />
                            <div>
                              <div className="text-slate-500 text-[10px] uppercase">Runtime</div>
                              <div className="font-mono font-bold">{submissionResult.submission.runtimeMs} ms</div>
                            </div>
                          </div>
                          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60 flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-purple-400" />
                            <div>
                              <div className="text-slate-500 text-[10px] uppercase">Memory</div>
                              <div className="font-mono font-bold">{submissionResult.submission.memoryMb} MB</div>
                            </div>
                          </div>
                          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60 flex items-center gap-2">
                            <Code2 className="h-4 w-4 text-teal-400" />
                            <div>
                              <div className="text-slate-500 text-[10px] uppercase">Time Complexity</div>
                              <div className="font-mono font-bold text-emerald-400">{submissionResult.submission.timeComplexity}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-500">
                        <Terminal className="h-4 w-4" /> Ready to execute test cases. Click "Run & Submit Solution".
                      </div>
                    )}
                  </div>
                )}

                {outputTab === 'review' && (
                  <div>
                    {submissionResult?.review ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div className="text-slate-300">
                            Correctness: <strong className="text-emerald-400">{submissionResult.review.correctness}%</strong>
                          </div>
                          <div className="text-slate-300">
                            Readability: <strong className="text-indigo-400">{submissionResult.review.readability}%</strong>
                          </div>
                          <div className="text-slate-300">
                            Complexity: <strong className="text-amber-400">{submissionResult.review.timeComplexity}</strong>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-slate-800">
                          {submissionResult.review.suggestions.map((s: string, idx: number) => (
                            <div key={idx} className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-xs">
                              💡 {s}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-500">
                        Submit code to trigger automated AI code inspection, edge case validation, and complexity analysis.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: PLAYGROUND DASHBOARD & DSA PROBLEM LIBRARY
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100">
      {/* 1. HERO & METRICS DASHBOARD */}
      <div className="bg-slate-900/80 border-b border-slate-800 pt-8 pb-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
                <Code2 className="h-3.5 w-3.5" /> DSA Problem Library & Analytics
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Coding Playground
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Master 120+ interview-grade DSA problems spanning 26 foundational categories. Track real runtime performance, test case coverage, and AI feedback.
              </p>
            </div>

            {/* Daily Goal Widget */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30 shrink-0 min-w-[280px]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Target className="h-4 w-4 text-indigo-400" />
                  <span>Today's Coding Goal</span>
                </div>
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  +{stats?.todayGoal?.xpReward || 50} XP
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span>Solve 3 problems today</span>
                <span className="font-mono font-bold text-indigo-300">
                  {stats?.todayGoal?.solvedToday || 0} / 3
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(((stats?.todayGoal?.solvedToday || 0) / 3) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Total Solved */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400 text-xs font-semibold mb-1">Solved / Total</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {stats?.totalSolved ?? 0}
                </span>
                <span className="text-xs text-slate-500">
                  / {stats?.totalProblems ?? 120}
                </span>
              </div>
              <div className="mt-2 text-[11px] text-emerald-400 font-medium">
                {stats?.totalAttempted ?? 0} attempted
              </div>
            </div>

            {/* Easy / Med / Hard Breakdowns */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400 text-xs font-semibold mb-2">By Difficulty</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-emerald-400 font-bold">Easy</span>
                  <span className="font-mono text-slate-300">
                    {stats?.byDifficulty?.Easy?.solved || 0}/{stats?.byDifficulty?.Easy?.total || 40}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-400 font-bold">Medium</span>
                  <span className="font-mono text-slate-300">
                    {stats?.byDifficulty?.Medium?.solved || 0}/{stats?.byDifficulty?.Medium?.total || 40}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-400 font-bold">Hard</span>
                  <span className="font-mono text-slate-300">
                    {stats?.byDifficulty?.Hard?.solved || 0}/{stats?.byDifficulty?.Hard?.total || 40}
                  </span>
                </div>
              </div>
            </div>

            {/* Accuracy */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400 text-xs font-semibold mb-1">Accuracy Rate</div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {stats?.accuracy ?? 0}%
              </div>
              <div className="mt-2 text-[11px] text-indigo-400 font-medium">
                Accepted submissions ratio
              </div>
            </div>

            {/* Streak & XP */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-slate-400 text-xs font-semibold mb-1">Active Streak</div>
                <div className="flex items-center gap-2">
                  <Flame className="h-6 w-6 text-amber-500 fill-amber-500" />
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {stats?.streakDays ?? 1}d
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Total XP: <span className="text-amber-400 font-bold">{stats?.xp ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RECOMMENDED FOR YOU (Mistake Memory & High-Frequency Placement) */}
      {stats?.recommendedProblems && stats.recommendedProblems.length > 0 && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Recommended For You (Weak Areas & Interview Targets)
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.recommendedProblems.map((rec) => (
              <div
                key={rec.id}
                onClick={() => navigate(`/coding/${rec.slug}`)}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all hover:-translate-y-0.5 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    rec.difficulty === 'Easy'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : rec.difficulty === 'Medium'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {rec.difficulty}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {rec.category}
                  </span>
                </div>
                <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1.5">
                  {rec.title}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {rec.reason}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                    Solve Now <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <RecommendationFeedbackButton
                      recommendationType="QUESTION"
                      itemId={rec.id}
                      itemTitle={rec.title}
                      sourcePage="Coding Playground"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MAIN SECTION WITH TABS: Problem Catalog, Topic Mastery %, and Recent Submissions */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center gap-6 border-b border-slate-800 pb-3 mb-6 text-sm font-bold">
          <button
            onClick={() => setActiveViewTab('problems')}
            className={`pb-3 -mb-3 transition-colors flex items-center gap-2 ${
              activeViewTab === 'problems'
                ? 'border-b-2 border-indigo-500 text-indigo-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="h-4 w-4" />
            <span>Problem Catalog ({problemsList.length})</span>
          </button>
          <button
            onClick={() => setActiveViewTab('topics')}
            className={`pb-3 -mb-3 transition-colors flex items-center gap-2 ${
              activeViewTab === 'topics'
                ? 'border-b-2 border-indigo-500 text-indigo-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>DSA Topic Mastery & Roadmaps</span>
          </button>
          <button
            onClick={() => setActiveViewTab('submissions')}
            className={`pb-3 -mb-3 transition-colors flex items-center gap-2 ${
              activeViewTab === 'submissions'
                ? 'border-b-2 border-indigo-500 text-indigo-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>My Submissions ({stats?.recentSubmissions?.length || 0})</span>
          </button>
        </div>

        {/* TAB 1: PROBLEMS CATALOG */}
        {activeViewTab === 'problems' && (
          <div className="space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search problem title, algorithm, or topic..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Selectors */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Category Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Category:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Difficulty:</span>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">All</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                {/* Status Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Status:</span>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">All</option>
                    <option value="Solved">Solved</option>
                    <option value="Attempted">Attempted</option>
                    <option value="Unsolved">Unsolved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Problems Table */}
            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4 w-12">Status</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Difficulty</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500">
                          Loading DSA problems catalog...
                        </td>
                      </tr>
                    ) : problemsList.length > 0 ? (
                      problemsList.map((prob) => (
                        <tr
                          key={prob.id}
                          className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                          onClick={() => navigate(`/coding/${prob.slug}`)}
                        >
                          <td className="py-3.5 px-4">
                            {prob.userStatus === 'Solved' ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : prob.userStatus === 'Attempted' ? (
                              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block" title="Attempted" />
                            ) : (
                              <span className="h-2.5 w-2.5 rounded-full bg-slate-700 inline-block" title="Unsolved" />
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                              {prob.title}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">
                            <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[11px] font-mono">
                              {prob.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                              prob.difficulty === 'Easy'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : prob.difficulty === 'Medium'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {prob.difficulty}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={`https://leetcode.com/problems/${prob.slug}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition-colors border border-slate-700"
                                title="Open on LeetCode"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/coding/${prob.slug}`);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs transition-colors"
                              >
                                {prob.userStatus === 'Solved' ? 'Review' : 'Solve'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500">
                          No problems found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TOPIC MASTERY PROGRESS BARS */}
        {activeViewTab === 'topics' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300">
              Progress bars reflect real solved vs total problem ratios across all 26 DSA algorithmic topics.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats?.topicProgress &&
                Object.entries(stats.topicProgress).map(([topic, data]) => {
                  const percentage = data.total > 0 ? Math.round((data.solved / data.total) * 100) : 0;
                  return (
                    <div
                      key={topic}
                      onClick={() => {
                        setSelectedCategory(topic);
                        setActiveViewTab('problems');
                      }}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all hover:-translate-y-0.5 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-slate-200 group-hover:text-indigo-300 transition-colors">
                          {topic}
                        </span>
                        <span className="font-mono text-xs text-slate-400">
                          {data.solved} / {data.total}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{percentage}% completed</span>
                        <span className="text-indigo-400 font-medium group-hover:underline">
                          Practice Topic →
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 3: SUBMISSIONS HISTORY */}
        {activeViewTab === 'submissions' && (
          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Problem</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Language</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Runtime</th>
                    <th className="py-3 px-4">Memory</th>
                    <th className="py-3 px-4 text-right">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
                    stats.recentSubmissions.map((sub) => (
                      <tr
                        key={sub.id}
                        className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                        onClick={() => navigate(`/coding/${sub.problemSlug}`)}
                      >
                        <td className="py-3.5 px-4 font-bold text-slate-200">
                          {sub.problemTitle}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          {sub.category}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300 uppercase text-[11px]">
                          {sub.language}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            sub.status === 'Accepted'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {sub.status} ({sub.passedTests}/{sub.totalTests})
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {sub.runtimeMs} ms
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {sub.memoryMb} MB
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-500 font-mono text-[11px]">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        No submissions recorded yet. Solve your first problem above!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingPlaygroundPage;
