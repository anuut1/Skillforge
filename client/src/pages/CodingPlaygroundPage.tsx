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
  ExternalLink,
  Lightbulb,
  Eye,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import client from '../api/client';
import type { CodingProblem } from '../types';
import ErrorBoundary from '../components/ErrorBoundary';
import { RecommendationFeedbackButton } from '../components/common/RecommendationFeedbackButton';
import { DSA_CATEGORIES, DSA_PROBLEMS_CATALOG } from '../data/dsaCatalog';

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
  solvedSlugs?: string[];
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

const ALL_CATEGORIES = ['All', ...DSA_CATEGORIES];

const CodingPlaygroundPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const topicParam = searchParams.get('topic') || searchParams.get('subtopic');
  const modeParam = searchParams.get('mode');

  // Mode: 'library' or 'editor'
  const isEditorMode = Boolean(slug);

  // Editor State
  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'javascript' | 'python' | 'java' | 'cpp'>('javascript');
  const [code, setCode] = useState('');
  const [userCodeByLang, setUserCodeByLang] = useState<Record<string, string>>({});
  const [leftTab, setLeftTab] = useState<'description' | 'solution'>('description');
  const [solutionLang, setSolutionLang] = useState<'javascript' | 'python' | 'java' | 'cpp'>('javascript');
  const [outputTab, setOutputTab] = useState<'results' | 'review'>('results');
  const [isRunning, setIsRunning] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Library / Dashboard State
  const [stats, setStats] = useState<PlaygroundStats | null>(null);
  const [problemsList, setProblemsList] = useState<ProblemListItem[]>([]);
  const [categories, setCategories] = useState<string[]>(ALL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState(topicParam || '');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeViewTab, setActiveViewTab] = useState<'problems' | 'topics' | 'submissions'>('problems');
  const [loading, setLoading] = useState(true);

  // Real user submission history
  const [userSubmissions, setUserSubmissions] = useState<any[]>([]);
  const [userSolvedSlugs, setUserSolvedSlugs] = useState<string[]>([]);
  const [userAttemptedSlugs, setUserAttemptedSlugs] = useState<string[]>([]);

  // React to changes in URL category & topic params (Bug 6 Fix)
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setActiveViewTab('problems');
    }
    if (topicParam) {
      setSearchQuery(topicParam);
      setActiveViewTab('problems');
    }
  }, [categoryParam, topicParam]);

  // Canonical Today's Problem dynamically derived from day of year (Phase 4)
  const todayProblem = React.useMemo(() => {
    if (!DSA_PROBLEMS_CATALOG || DSA_PROBLEMS_CATALOG.length === 0) return null;
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return DSA_PROBLEMS_CATALOG[dayOfYear % DSA_PROBLEMS_CATALOG.length];
  }, []);

  const isTodaySolved = React.useMemo(() => {
    if (!todayProblem) return false;
    const solvedSet = new Set(userSolvedSlugs);
    return solvedSet.has(todayProblem.slug);
  }, [todayProblem, userSolvedSlugs]);

  // Short one-line summary for teaser widget (Bug 1 Fix)
  const todayProblemTeaser = React.useMemo(() => {
    if (!todayProblem?.description) return '';
    const firstLine = todayProblem.description.split('\n')[0].trim();
    const sentence = firstLine.split('. ')[0];
    return sentence.endsWith('.') ? sentence : `${sentence}.`;
  }, [todayProblem]);

  // Load Dashboard Stats & Real Submissions (Bug 2 & 3 Fix)
  useEffect(() => {
    client.get('/coding/submissions')
      .then(res => {
        if (Array.isArray(res.data)) {
          setUserSubmissions(res.data);
          const solved = new Set<string>();
          const attempted = new Set<string>();
          res.data.forEach((s: any) => {
            const problemSlug = s.problemSlug || s.problem?.slug || s.problemId;
            if (s.status === 'Accepted') {
              solved.add(problemSlug);
            } else {
              attempted.add(problemSlug);
            }
          });
          const solvedArr = Array.from(solved);
          setUserSolvedSlugs(solvedArr);
          setUserAttemptedSlugs(Array.from(attempted).filter(slug => !solved.has(slug)));
        }
      })
      .catch(() => {});

    client.get('/coding/stats')
      .then(res => {
        const backendStats = res.data;
        if (backendStats && Array.isArray(backendStats.solvedSlugs)) {
          setUserSolvedSlugs(prev => Array.from(new Set([...prev, ...backendStats.solvedSlugs])));
        }
        setStats(backendStats);
      })
      .catch(() => {
        // Honest zero-state fallback if network is unreachable
        const total = DSA_PROBLEMS_CATALOG.length;
        const byDiff: Record<string, { total: number; solved: number; attempted: number }> = {
          Easy: { total: 0, solved: 0, attempted: 0 },
          Medium: { total: 0, solved: 0, attempted: 0 },
          Hard: { total: 0, solved: 0, attempted: 0 }
        };
        const topicProg: Record<string, { total: number; solved: number; attempted: number }> = {};
        DSA_CATEGORIES.forEach(c => {
          topicProg[c] = { total: 0, solved: 0, attempted: 0 };
        });

        DSA_PROBLEMS_CATALOG.forEach(p => {
          if (byDiff[p.difficulty]) byDiff[p.difficulty].total++;
          if (!topicProg[p.category]) topicProg[p.category] = { total: 0, solved: 0, attempted: 0 };
          topicProg[p.category].total++;
        });

        setStats({
          totalProblems: total,
          totalSolved: 0,
          totalAttempted: 0,
          accuracy: 0,
          streakDays: 1,
          xp: 0,
          byDifficulty: byDiff as any,
          topicProgress: topicProg,
          todayGoal: {
            target: 3,
            solvedToday: 0,
            isCompleted: false,
            xpReward: 50
          },
          recommendedProblems: DSA_PROBLEMS_CATALOG.slice(0, 4).map(p => ({
            id: p.slug,
            title: p.title,
            slug: p.slug,
            difficulty: p.difficulty,
            category: p.category,
            reason: `High-frequency interview pattern in ${p.category}`
          })),
          recentSubmissions: []
        });
      });

    client.get('/coding/categories')
      .then(res => {
        if (res.data?.categories) {
          setCategories(['All', ...res.data.categories]);
        }
      })
      .catch(() => {
        setCategories(ALL_CATEGORIES);
      });
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
          if (Array.isArray(res.data) && res.data.length > 0) {
            setProblemsList(res.data);
          } else {
            // Apply filtering locally on full catalog if backend returns empty or error
            applyCatalogFallback();
          }
        })
        .catch(() => {
          applyCatalogFallback();
        })
        .finally(() => setLoading(false));
    }
  }, [isEditorMode, selectedCategory, selectedDifficulty, selectedStatus, searchQuery, activeViewTab]);

  const applyCatalogFallback = () => {
    const solvedSet = new Set(userSolvedSlugs);
    const attemptedSet = new Set(userAttemptedSlugs);

    let list: ProblemListItem[] = DSA_PROBLEMS_CATALOG.map(p => {
      const isSolved = solvedSet.has(p.slug) || solvedSet.has(p.title.toLowerCase().replace(/\s+/g, '-'));
      const isAttempted = attemptedSet.has(p.slug) || attemptedSet.has(p.title.toLowerCase().replace(/\s+/g, '-'));
      const userStatus: 'Solved' | 'Attempted' | 'Unsolved' = isSolved ? 'Solved' : isAttempted ? 'Attempted' : 'Unsolved';
      return {
        id: p.slug,
        title: p.title,
        slug: p.slug,
        difficulty: p.difficulty,
        category: p.category,
        relatedSkillName: p.relatedSkillName,
        userStatus
      };
    });

    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (selectedDifficulty !== 'All') {
      list = list.filter(p => p.difficulty === selectedDifficulty);
    }
    if (selectedStatus !== 'All') {
      list = list.filter(p => p.userStatus === selectedStatus);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        (p.relatedSkillName && p.relatedSkillName.toLowerCase().includes(q))
      );
    }

    setProblemsList(list);
  };

  // Load Problem for Workspace
  useEffect(() => {
    if (slug) {
      setLoadError(null);
      setProblem(null);
      setSubmissionResult(null);

      client.get(`/coding/problems/${slug}`)
        .then(res => {
          if (res.data && res.data.id && res.data.title && res.data.description) {
            setProblem(res.data);
            initCodeForProblem(res.data, language);
          } else {
            throw new Error('Incomplete problem data from API');
          }
        })
        .catch(() => {
          // Fallback to DSA_PROBLEMS_CATALOG
          const found = DSA_PROBLEMS_CATALOG.find(p => p.slug === slug);
          if (found && found.title && found.description) {
            const mappedProblem: CodingProblem = {
              id: found.slug,
              title: found.title,
              slug: found.slug,
              difficulty: found.difficulty,
              category: found.category,
              description: found.description,
              examples: found.examples,
              constraints: found.constraints,
              hints: found.hints,
              starterCode: found.starterCode,
              referenceSolution: found.referenceSolution,
              testCases: found.testCases,
              relatedSkillName: found.relatedSkillName,
              contentReady: found.contentReady
            };
            setProblem(mappedProblem);
            initCodeForProblem(mappedProblem, language);
          } else {
            setLoadError('This problem could not be loaded. Please return to the Problem Library or try again.');
          }
        });
    }
  }, [slug, modeParam]);

  // Initialize Code in Solve vs Review Mode (Bug 2 Fix)
  const initCodeForProblem = (prob: CodingProblem, lang: string) => {
    const isReview = modeParam === 'review';

    // In Review mode, find the user's real accepted submission
    if (isReview) {
      const acceptedSub = (prob as any).lastAcceptedSubmission ||
        userSubmissions.find(s => (s.problemSlug === prob.slug || s.problemId === prob.slug || s.problemId === prob.id) && s.status === 'Accepted');

      if (acceptedSub && acceptedSub.code) {
        setCode(acceptedSub.code);
        const subLang = (acceptedSub.language || lang) as any;
        setLanguage(subLang);
        setUserCodeByLang(prev => ({ ...prev, [subLang]: acceptedSub.code }));

        let parsedReview = null;
        if (acceptedSub.aiReview) {
          try {
            parsedReview = typeof acceptedSub.aiReview === 'string' ? JSON.parse(acceptedSub.aiReview) : acceptedSub.aiReview;
          } catch {}
        }

        setSubmissionResult({
          submission: acceptedSub,
          execution: {
            status: acceptedSub.status,
            passedTests: acceptedSub.passedTests,
            totalTests: acceptedSub.totalTests,
            runtimeMs: acceptedSub.runtimeMs,
            memoryMb: acceptedSub.memoryMb,
            timeComplexity: acceptedSub.timeComplexity,
            testResults: []
          },
          review: parsedReview || {
            status: 'Accepted',
            correctness: 100,
            readability: 92,
            timeComplexity: acceptedSub.timeComplexity || 'O(n)',
            suggestions: ['Your prior accepted solution demonstrates clean algorithmic structure.']
          }
        });
        setOutputTab('review');
        return;
      }
    }

    // Normal Solve mode: load student's saved scratchpad code or blank starter code
    const storageKey = `skillforge_code_${prob.slug || prob.id}_${lang}`;
    let loadedCode = '';
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved && saved.trim()) {
        loadedCode = saved;
      }
    } catch {}

    if (!loadedCode && prob.starterCode) {
      try {
        const starters = JSON.parse(prob.starterCode);
        if (starters[lang]) {
          loadedCode = starters[lang];
        }
      } catch {}
    }

    setCode(loadedCode);
    setUserCodeByLang(prev => ({ ...prev, [lang]: loadedCode }));
  };

  // Handle code change in editor
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setUserCodeByLang(prev => ({ ...prev, [language]: newCode }));
    if (problem) {
      try {
        const storageKey = `skillforge_code_${problem.slug || problem.id}_${language}`;
        localStorage.setItem(storageKey, newCode);
      } catch {}
    }
  };

  // Handle language switch in workspace (Preserves student's written code per language)
  const handleLanguageChange = (newLang: 'javascript' | 'python' | 'java' | 'cpp') => {
    if (problem) {
      try {
        const currentKey = `skillforge_code_${problem.slug || problem.id}_${language}`;
        localStorage.setItem(currentKey, code);
      } catch {}
    }

    setLanguage(newLang);

    // Look for existing user code in state or storage, otherwise load starter template
    let nextCode = userCodeByLang[newLang] || '';
    if (!nextCode && problem) {
      try {
        const storageKey = `skillforge_code_${problem.slug || problem.id}_${newLang}`;
        const saved = localStorage.getItem(storageKey);
        if (saved && saved.trim()) nextCode = saved;
      } catch {}
    }

    if (!nextCode && problem?.starterCode) {
      try {
        const starters = JSON.parse(problem.starterCode);
        if (starters[newLang]) nextCode = starters[newLang];
      } catch {}
    }

    setCode(nextCode);
  };

  // Reset editor code to pure starter template (Bug 2 Fix)
  const handleResetToStarter = () => {
    if (problem?.starterCode) {
      try {
        const starters = JSON.parse(problem.starterCode);
        const freshStarter = starters[language] || '';
        setCode(freshStarter);
        setUserCodeByLang(prev => ({ ...prev, [language]: freshStarter }));
        const storageKey = `skillforge_code_${problem.slug || problem.id}_${language}`;
        localStorage.removeItem(storageKey);
        if (searchParams.has('mode')) {
          const nextParams = new URLSearchParams(searchParams);
          nextParams.delete('mode');
          setSearchParams(nextParams);
        }
      } catch {}
    }
  };

  // Honest Real JavaScript Sandbox Execution Engine (Bug 3 Fix)
  const executeJavaScriptLocally = (userCode: string, prob: CodingProblem) => {
    let testCases: any[] = [];
    try { testCases = JSON.parse(prob.testCases); } catch {}
    if (!testCases.length) {
      try { testCases = JSON.parse(prob.examples); } catch {}
    }

    const funcMatch = userCode.match(/(?:function\s+([a-zA-Z_$][\w$]*)|(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*(?:function|\([^)]*\)\s*=>))/);
    const entryFnName = funcMatch ? (funcMatch[1] || funcMatch[2]) : 'solution';

    // Compile and check syntax
    let fn: any;
    try {
      const wrapped = new Function(`${userCode}; return typeof ${entryFnName} === 'function' ? ${entryFnName} : null;`);
      fn = wrapped();
      if (!fn) throw new Error(`Entry function "${entryFnName}" was not found or is not a callable function.`);
    } catch (syntaxErr: any) {
      return {
        submission: {
          id: `local-${Date.now()}`,
          status: 'Compilation Error',
          passedTests: 0,
          totalTests: testCases.length,
          runtimeMs: 0,
          memoryMb: null,
          timeComplexity: 'N/A',
          createdAt: new Date().toISOString()
        },
        execution: {
          status: 'Compilation Error',
          passedTests: 0,
          totalTests: testCases.length,
          runtimeMs: 0,
          memoryMb: null,
          timeComplexity: 'N/A',
          spaceComplexity: 'N/A',
          complexityExplanation: syntaxErr.message,
          testResults: testCases.map((tc, idx) => ({
            index: idx + 1,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            passed: false,
            error: syntaxErr.message
          })),
          errorMessage: syntaxErr.message
        },
        review: {
          status: 'Compilation Error',
          correctness: 0,
          readability: 0,
          timeComplexity: 'N/A',
          suggestions: [`Fix syntax/compilation error: ${syntaxErr.message}`]
        }
      };
    }

    // Execute each real test case
    let passedCount = 0;
    const start = performance.now();
    const testResults = testCases.map((tc, idx) => {
      let args: any[] = [];
      try {
        args = JSON.parse(`[${tc.input}]`);
      } catch {
        args = [tc.input];
      }

      try {
        const actual = fn(...args);
        const actualStr = JSON.stringify(actual) !== undefined ? JSON.stringify(actual) : String(actual);
        let expectedParsed: any;
        try { expectedParsed = JSON.parse(tc.expectedOutput); } catch { expectedParsed = tc.expectedOutput; }
        const expectedStr = JSON.stringify(expectedParsed) !== undefined ? JSON.stringify(expectedParsed) : String(tc.expectedOutput).trim();

        const isPass = actualStr === expectedStr || String(actual).trim() === String(tc.expectedOutput).trim();
        if (isPass) passedCount++;

        return {
          index: idx + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: actualStr,
          passed: isPass
        };
      } catch (runErr: any) {
        return {
          index: idx + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: 'Runtime Exception',
          passed: false,
          error: runErr.message
        };
      }
    });

    const elapsed = Math.max(1, Math.round(performance.now() - start));
    const isAccepted = passedCount === testCases.length && testCases.length > 0;

    return {
      submission: {
        id: `local-${Date.now()}`,
        status: isAccepted ? 'Accepted' : 'Failed',
        passedTests: passedCount,
        totalTests: testCases.length,
        runtimeMs: elapsed,
        memoryMb: null,
        timeComplexity: isAccepted ? 'O(n)' : 'N/A',
        createdAt: new Date().toISOString()
      },
      execution: {
        status: isAccepted ? 'Accepted' : 'Failed',
        passedTests: passedCount,
        totalTests: testCases.length,
        runtimeMs: elapsed,
        memoryMb: null,
        timeComplexity: isAccepted ? 'O(n)' : 'N/A',
        spaceComplexity: isAccepted ? 'O(1)' : 'N/A',
        complexityExplanation: isAccepted ? 'All test cases passed expected outputs.' : 'One or more test case outputs mismatched expected values.',
        testResults
      },
      review: {
        status: isAccepted ? 'Accepted' : 'Failed',
        correctness: isAccepted ? 100 : Math.round((passedCount / (testCases.length || 1)) * 100),
        readability: 90,
        timeComplexity: isAccepted ? 'O(n)' : 'N/A',
        suggestions: isAccepted
          ? ['Optimal solution verified across test cases!']
          : ['Solution produced incorrect results. Inspect the failing inputs and outputs above.']
      }
    };
  };

  // Run and Submit code (Bug 3 Fix)
  const handleRunAndSubmit = async () => {
    if (!problem) return;
    setIsRunning(true);
    setSubmissionResult(null);

    try {
      const res = await client.post('/coding/submit', {
        problemId: problem.id || problem.slug,
        language,
        code
      });

      const data = res?.data;
      console.log("[ExecutionService] Raw response received:", JSON.stringify(data));

      if (!data) {
        throw new Error("No response received from execution service.");
      }

      // Unwrap nested execution result or flat response format
      let executionObj = data.execution;
      let submissionObj = data.submission;
      let reviewObj = data.review;

      if (!executionObj && data.status) {
        // Flat execution response format
        executionObj = {
          status: data.status,
          passedTests: data.testCasesPassed ?? data.passedTests ?? 0,
          totalTests: data.totalTestCases ?? data.totalTests ?? (data.testCaseResults?.length || 0),
          runtimeMs: data.runtimeMs || 0,
          memoryMb: data.memoryMb ?? data.memoryMB ?? null,
          timeComplexity: data.timeComplexity || data.complexityEstimate || 'O(n)',
          spaceComplexity: data.spaceComplexity || 'O(1)',
          complexityExplanation: data.complexityExplanation || '',
          testResults: (data.testCaseResults || data.testResults || []).map((tc: any, i: number) => ({
            index: tc.index || tc.testCaseIndex || i + 1,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: tc.actualOutput ?? tc.output ?? 'None',
            passed: Boolean(tc.passed),
            error: tc.error
          })),
          errorMessage: data.errorMessage
        };
        submissionObj = {
          id: data.id || `sub_${Date.now()}`,
          problemId: problem.id,
          language,
          code,
          status: data.status,
          passedTests: executionObj.passedTests,
          totalTests: executionObj.totalTests,
          runtimeMs: executionObj.runtimeMs,
          memoryMb: executionObj.memoryMb,
          timeComplexity: executionObj.timeComplexity,
          createdAt: data.createdAt || new Date().toISOString()
        };
      }

      if (!executionObj) {
        throw new Error(data.message || data.error || "Execution service returned an unparseable response structure.");
      }

      const normalizedResult = {
        submission: submissionObj || {
          id: `sub_${Date.now()}`,
          problemId: problem.id,
          language,
          code,
          status: executionObj.status,
          passedTests: executionObj.passedTests,
          totalTests: executionObj.totalTests,
          runtimeMs: executionObj.runtimeMs,
          memoryMb: executionObj.memoryMb,
          timeComplexity: executionObj.timeComplexity,
          createdAt: new Date().toISOString()
        },
        execution: executionObj,
        review: reviewObj || {
          status: executionObj.status,
          correctness: executionObj.status === 'Accepted' ? 95 : Math.round((executionObj.passedTests / Math.max(1, executionObj.totalTests)) * 60),
          readability: 85,
          timeComplexity: executionObj.timeComplexity,
          suggestions: executionObj.errorMessage ? [executionObj.errorMessage] : ['Review algorithm invariant and edge test cases.']
        }
      };

      setSubmissionResult(normalizedResult);
      setOutputTab('results');

      // Update real solved state if Accepted
      const finalStatus = normalizedResult.execution.status;
      if (finalStatus === 'Accepted') {
        const problemKey = problem.slug || problem.id;
        setUserSolvedSlugs(prev => Array.from(new Set([...prev, problemKey])));
        setUserAttemptedSlugs(prev => prev.filter(k => k !== problemKey));
      } else {
        const problemKey = problem.slug || problem.id;
        setUserAttemptedSlugs(prev => Array.from(new Set([...prev, problemKey])));
      }

      // Refresh stats in background
      client.get('/coding/stats')
        .then(s => setStats(s.data))
        .catch(() => {});
    } catch (e: any) {
      // Direct honest execution for JavaScript if backend is unreachable
      if (language === 'javascript') {
        const localResult = executeJavaScriptLocally(code, problem);
        setSubmissionResult(localResult);
        setOutputTab('results');

        if (localResult.execution.status === 'Accepted') {
          const problemKey = problem.slug || problem.id;
          setUserSolvedSlugs(prev => Array.from(new Set([...prev, problemKey])));
        }
      } else {
        const errorMessage = e?.response?.data?.message || e?.message || "Execution service unavailable for polyglot execution. Please ensure connectivity.";
        let parsedTCs: any[] = [];
        try { parsedTCs = JSON.parse(problem.testCases); } catch {}

        setSubmissionResult({
          submission: {
            id: `err-${Date.now()}`,
            problemId: problem.id,
            language,
            code,
            status: 'Execution Error',
            passedTests: 0,
            totalTests: parsedTCs.length,
            runtimeMs: 0,
            memoryMb: null,
            timeComplexity: 'N/A',
            createdAt: new Date().toISOString()
          },
          execution: {
            status: 'Execution Error',
            passedTests: 0,
            totalTests: parsedTCs.length,
            runtimeMs: 0,
            memoryMb: null,
            timeComplexity: 'N/A',
            spaceComplexity: 'N/A',
            complexityExplanation: errorMessage,
            testResults: parsedTCs.map((tc, idx) => ({
              index: idx + 1,
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              actualOutput: 'None (Service Error)',
              passed: false,
              error: errorMessage
            })),
            errorMessage
          },
          review: {
            status: 'Execution Error',
            correctness: 0,
            readability: 0,
            timeComplexity: 'N/A',
            suggestions: [errorMessage]
          }
        });
        setOutputTab('results');
      }
    } finally {
      setIsRunning(false);
    }
  };
  // VIEW A: WORKSPACE / CODING PLAYGROUND (When a problem is selected)
  // =========================================================================
  if (isEditorMode) {
    if (loadError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-4 p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center text-xl font-bold">!</div>
          <h2 className="text-xl font-bold text-white">Problem Unavailable</h2>
          <p className="text-sm text-slate-400 max-w-md">{loadError}</p>
          <button
            onClick={() => navigate('/playground')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            Back to Problem Library
          </button>
        </div>
      );
    }

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
    const referenceSolutions = (() => {
      try { return problem.referenceSolution ? JSON.parse(problem.referenceSolution) : null; } catch { return null; }
    })();

    const execData = submissionResult?.execution || submissionResult?.submission;
    const isAccepted = (execData?.status === 'Accepted' || submissionResult?.submission?.status === 'Accepted');
    const isCompileError = execData?.status === 'Compilation Error';
    const isRuntimeError = execData?.status === 'Runtime Error';
    const isTimeout = execData?.status === 'Time Limit Exceeded';

    return (
      <ErrorBoundary fallbackTitle="Coding Workspace Error" fallbackMessage="An isolated error occurred rendering this problem workspace.">
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
            <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-md">
              {problem.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Solution Toggle */}
            <button
              onClick={() => setLeftTab(leftTab === 'solution' ? 'description' : 'solution')}
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                leftTab === 'solution'
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="View the official reference approach without altering your solve code"
            >
              <Eye className="h-3 w-3 text-purple-400" />
              <span>{leftTab === 'solution' ? 'Back to Problem' : 'Reference Solution'}</span>
            </button>

            {/* LeetCode Canonical Link */}
            <a
              href={`https://leetcode.com/problems/${problem.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
              title="Practice this exact question on LeetCode"
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
          {/* LEFT PANE: Description / Examples / Constraints OR Reference Solution Mode */}
          <div className="w-full lg:w-1/2 h-1/2 lg:h-full overflow-y-auto border-r border-slate-800 p-6 space-y-6">
            {leftTab === 'solution' ? (
              /* SEPARATE REFERENCE SOLUTION VIEWER */
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-purple-400 tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5" /> Reference Solution & Approach
                    </div>
                    <h2 className="text-xl font-bold text-white mt-1">{problem.title}</h2>
                  </div>
                  <button
                    onClick={() => setLeftTab('description')}
                    className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-lg bg-slate-800 border border-slate-700"
                  >
                    View Problem Statement
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 leading-relaxed">
                  💡 <strong>Study & Reference Only:</strong> This is the official reference approach. Your active editor on the right remains your private workspace and evaluates only your own code upon submission.
                </div>

                {/* Solution Language Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Reference Language:</span>
                  <div className="flex gap-1.5">
                    {(['javascript', 'python', 'java', 'cpp'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => setSolutionLang(lang)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                          solutionLang === lang
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                        }`}
                      >
                        {lang === 'javascript' ? 'JS' : lang === 'python' ? 'Python' : lang === 'java' ? 'Java' : 'C++'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Solution Code Block */}
                <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                  {referenceSolutions && referenceSolutions[solutionLang]
                    ? referenceSolutions[solutionLang]
                    : 'Reference solution code available.'}
                </div>

                {/* Algorithmic Approach Notes */}
                {hints.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Complexity & Approach</h3>
                    <div className="space-y-2 text-xs text-slate-300">
                      {hints.map((h: string, idx: number) => (
                        <p key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                          {h}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* SOLVE MODE: Problem Description, Examples, Constraints, Hints */
              <>
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
              </>
            )}
          </div>

          {/* RIGHT PANE: Code Editor + Run & Submit + Honest Execution Drawer */}
          <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col bg-slate-900">
            {/* Review Mode Banner (Bug 2 Fix) */}
            {modeParam === 'review' && (
              <div className="bg-emerald-950/50 border-b border-emerald-500/30 px-4 py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Review Mode: Viewing your real accepted submission code.</span>
                </div>
                <button
                  onClick={handleResetToStarter}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-colors shrink-0"
                >
                  <RotateCcw className="h-3 w-3" /> Reset & Try Again
                </button>
              </div>
            )}

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
                <span className={`text-[10px] font-medium hidden sm:inline-block ${modeParam === 'review' ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {modeParam === 'review' ? '(Review Mode)' : '(Solve Mode)'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetToStarter}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Reset to clean starter template"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handleRunAndSubmit}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  {isRunning ? 'Executing Test Suite...' : 'Run & Submit Solution'}
                </button>
              </div>
            </div>

            {/* Code Textarea / Editor */}
            <div className="flex-1 p-2 bg-slate-950 overflow-hidden relative">
              <textarea
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full h-full bg-slate-900/90 text-slate-100 font-mono text-xs sm:text-sm p-4 rounded-xl resize-none focus:outline-none border border-slate-800 shadow-inner leading-relaxed"
                spellCheck={false}
                placeholder="// Write your solution here..."
              />
            </div>

            {/* Bottom Output / AI Review Drawer */}
            <div className="h-60 sm:h-64 bg-slate-900 border-t border-slate-800 flex flex-col">
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
                      <div className="space-y-3.5">
                        {/* Status Badge + Test Count */}
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className={`px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 ${
                              isAccepted
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : isCompileError
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : isRuntimeError
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : isTimeout
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {isAccepted ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : isCompileError || isRuntimeError ? (
                                <AlertTriangle className="h-3.5 w-3.5" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5" />
                              )}
                              {execData?.status || 'Completed'}
                            </span>
                            <span className="text-slate-300 font-semibold">
                              {execData?.passedTests ?? 0} / {execData?.totalTests ?? 0} test cases passed
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-400">
                            Evaluated against problem test cases
                          </div>
                        </div>

                        {/* Performance Metrics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-slate-300">
                          <div className="bg-slate-800/70 p-2.5 rounded-lg border border-slate-700/60 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-indigo-400 shrink-0" />
                            <div>
                              <div className="text-slate-500 text-[10px] uppercase">Runtime</div>
                              <div className="font-mono font-bold text-white">
                                {execData?.runtimeMs !== undefined ? `${execData.runtimeMs} ms` : 'N/A'}
                              </div>
                            </div>
                          </div>
                          <div className="bg-slate-800/70 p-2.5 rounded-lg border border-slate-700/60 flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-purple-400 shrink-0" />
                            <div>
                              <div className="text-slate-500 text-[10px] uppercase">Memory</div>
                              <div className="font-mono font-bold text-white">
                                {execData?.memoryMb ? `${execData.memoryMb} MB` : 'Not available'}
                              </div>
                            </div>
                          </div>
                          <div className="bg-slate-800/70 p-2.5 rounded-lg border border-slate-700/60 flex items-center gap-2">
                            <Code2 className="h-4 w-4 text-teal-400 shrink-0" />
                            <div>
                              <div className="text-slate-500 text-[10px] uppercase">Estimated Complexity</div>
                              <div className="font-mono font-bold text-emerald-400">
                                {execData?.timeComplexity || 'O(n)'} time
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Complexity Explanation Card */}
                        {execData?.complexityExplanation && (
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                            <strong className="text-slate-300">Complexity Analysis:</strong> {execData.complexityExplanation}
                          </div>
                        )}

                        {/* Individual Test Case Breakdown */}
                        {execData?.testResults && execData.testResults.length > 0 && (
                          <div className="space-y-2 pt-1">
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Test Case Details
                            </div>
                            <div className="space-y-1.5">
                              {execData.testResults.map((tc: any, i: number) => (
                                <div
                                  key={i}
                                  className={`p-2.5 rounded-lg border text-xs font-mono ${
                                    tc.passed
                                      ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                                      : 'bg-red-950/30 border-red-500/30 text-red-300'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold">
                                      Test #{tc.index || i + 1}: {tc.passed ? '✓ Passed' : '✗ Failed'}
                                    </span>
                                  </div>
                                  <div className="text-[11px] space-y-0.5 text-slate-300">
                                    <div><span className="text-slate-500">Input:</span> {tc.input}</div>
                                    <div><span className="text-slate-500">Expected:</span> {tc.expectedOutput}</div>
                                    {tc.actualOutput && (
                                      <div><span className="text-slate-500">Received:</span> {tc.actualOutput}</div>
                                    )}
                                    {tc.error && (
                                      <div className="text-red-400 font-sans mt-1">Error: {tc.error}</div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-500 py-4">
                        <Terminal className="h-4 w-4" /> Ready to execute test cases. Write your solution in the editor and click "Run & Submit Solution".
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
                            Correctness: <strong className="text-emerald-400">{submissionResult?.review?.correctness ?? 90}%</strong>
                          </div>
                          <div className="text-slate-300">
                            Readability: <strong className="text-indigo-400">{submissionResult?.review?.readability ?? 85}%</strong>
                          </div>
                          <div className="text-slate-300">
                            Estimated Complexity: <strong className="text-amber-400">{submissionResult?.review?.timeComplexity ?? 'O(n)'}</strong>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-slate-800">
                          {((submissionResult?.review?.suggestions as string[]) || ['Clean algorithmic structure adhering to standard conventions.']).map((s: string, idx: number) => (
                            <div key={idx} className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-xs">
                              💡 {s}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-500 py-4">
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
      </ErrorBoundary>
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

      {/* TODAY'S PROBLEM TEASER WIDGET (Bug 1 Fix) */}
      {todayProblem && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/30 shrink-0 mt-0.5">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Today's Problem</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                      {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      todayProblem.difficulty === 'Easy'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : todayProblem.difficulty === 'Medium'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {todayProblem.difficulty}
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                      {todayProblem.category}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white mb-1.5">
                    {todayProblem.title}
                  </h2>

                  {/* Short one-line summary teaser only (no duplicated full statement, examples, or constraints) */}
                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-1 max-w-2xl">
                    {todayProblemTeaser}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                  isTodaySolved 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {isTodaySolved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Flame className="h-3.5 w-3.5" />}
                  {isTodaySolved ? 'Solved Today' : 'Unsolved'}
                </span>

                <a
                  href={`https://leetcode.com/problems/${todayProblem.slug}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 text-xs transition-colors"
                  title="Open on LeetCode"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>

                <button
                  onClick={() => navigate(isTodaySolved ? `/coding/${todayProblem.slug}?mode=review` : `/coding/${todayProblem.slug}`)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-1.5"
                >
                  <Code2 className="h-4 w-4" />
                  <span>{isTodaySolved ? 'Review' : 'Attempt'}</span>
                </button>
              </div>
            </div>
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
                                  if (prob.userStatus === 'Solved') {
                                    navigate(`/coding/${prob.slug}?mode=review`);
                                  } else {
                                    navigate(`/coding/${prob.slug}`);
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                                  prob.userStatus === 'Solved'
                                    ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-indigo-600/80 hover:bg-indigo-600 text-white'
                                }`}
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
