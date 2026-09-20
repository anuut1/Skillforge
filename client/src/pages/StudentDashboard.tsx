import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import CourseCard from '../components/CourseCard';
import type { Course, RevisionTopicItem } from '../types';
import {
  Sparkles,
  Target,
  Zap,
  CheckCircle2,
  ChevronRight,
  X,
  Bot,
  Flame,
  Network,
  Activity,
  AlertTriangle,
  Brain,
  Send,
  Loader2,
  CheckSquare,
  Square,
  RotateCcw,
  ArrowRight,
  Plus,
  Trash2
} from 'lucide-react';
import client from '../api/client';

const ENROLLED_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Complete Web Development Bootcamp',
    description: 'Learn full-stack web development from scratch with React, Node.js, and MongoDB.',
    instructorId: 'i1',
    instructorName: 'Sarah Drasner',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    enrolledCount: 15420,
    lectureCount: 145,
  },
  {
    id: 'c4',
    title: 'Mastering React and Next.js',
    description: 'Build production-ready, server-rendered applications with React and Next.js 14.',
    instructorId: 'i1',
    instructorName: 'Sarah Drasner',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    enrolledCount: 5230,
    lectureCount: 65,
  }
];

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [revisionTopics, setRevisionTopics] = useState<RevisionTopicItem[]>([]);
  const [showMicroModal, setShowMicroModal] = useState(false);
  const [microQuizDone, setMicroQuizDone] = useState(false);
  const [selectedMicroOption, setSelectedMicroOption] = useState<number | null>(null);

  // AI Career Copilot State
  const [copilotQuestion, setCopilotQuestion] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotData, setCopilotData] = useState<any>(null);

  // Today's Mission State & User Customization
  const [mission, setMission] = useState<any>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskLabel, setNewTaskLabel] = useState('');

  // Mistake Memory & Learning DNA
  const [mistakes, setMistakes] = useState<any>(null);
  const [dna, setDna] = useState<any>(null);

  // Active Interactive Skill Graph Node
  const [activeSkillNode, setActiveSkillNode] = useState<string>('Graphs');

  const todayKey = new Date().toISOString().slice(0, 10);
  const missionStorageKey = `skillforge_mission_${todayKey}_${user?.id || 'guest'}`;

  useEffect(() => {
    // 1. Load Profile & Progress
    client.get('/profile')
      .then(res => setProfile(res.data.profile))
      .catch(err => console.error(err));

    // 2. Load Revisions
    client.get('/revisions/due')
      .then(res => setRevisionTopics(res.data || []))
      .catch(err => console.error(err));

    // 3. Load Daily Mission (cached per user per day)
    const cachedMission = localStorage.getItem(missionStorageKey);
    if (cachedMission) {
      try {
        setMission(JSON.parse(cachedMission));
      } catch (e) {
        fetchDailyMission();
      }
    } else {
      fetchDailyMission();
    }

    // 4. Load Mistake Memory
    client.get('/learning/mistake-memory')
      .then(res => setMistakes(res.data))
      .catch(err => console.error(err));

    // 5. Load Learning DNA
    client.get('/learning/dna')
      .then(res => setDna(res.data))
      .catch(err => console.error(err));

    // 6. Initial AI Copilot brief
    client.post('/copilot/advice', { question: 'What should I learn today?' })
      .then(res => setCopilotData(res.data))
      .catch(err => console.error(err));
  }, [user?.id, missionStorageKey]);

  const fetchDailyMission = () => {
    client.get('/mission/daily')
      .then(res => {
        if (res.data) {
          setMission(res.data);
          localStorage.setItem(missionStorageKey, JSON.stringify(res.data));
        }
      })
      .catch(err => console.error(err));
  };

  const handleAskCopilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuestion.trim()) return;
    setCopilotLoading(true);
    try {
      const res = await client.post('/copilot/advice', { question: copilotQuestion });
      setCopilotData(res.data);
      setCopilotQuestion('');
    } catch (err) {
      console.error(err);
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleToggleMissionTask = async (taskId: string, currentCompleted: boolean) => {
    if (!mission) return;
    try {
      await client.post('/mission/complete-task', { taskId, xp: 30 }).catch(() => {});
      setMission((prev: any) => {
        const currentTasks = Array.isArray(prev?.tasks) ? prev.tasks : [];
        const updatedTasks = currentTasks.map((t: any) => t.id === taskId ? { ...t, completed: !currentCompleted } : t);
        const completedCount = updatedTasks.filter((t: any) => t.completed).length;
        const totalCount = updatedTasks.length;
        const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        const updated = { ...prev, tasks: updatedTasks, progress };
        localStorage.setItem(missionStorageKey, JSON.stringify(updated));
        return updated;
      });
      // Boost local profile XP
      setProfile((prev: any) => prev ? { ...prev, xp: (prev.xp || 150) + 30 } : prev);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMissionTask = (taskId: string) => {
    setMission((prev: any) => {
      if (!prev) return prev;
      const currentTasks = Array.isArray(prev?.tasks) ? prev.tasks : [];
      const updatedTasks = currentTasks.filter((t: any) => t.id !== taskId);
      const completedCount = updatedTasks.filter((t: any) => t.completed).length;
      const totalCount = updatedTasks.length;
      const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      const updated = { ...prev, tasks: updatedTasks, progress };
      localStorage.setItem(missionStorageKey, JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskLabel.trim()) return;
    const newTask = {
      id: `task_custom_${Date.now()}`,
      label: newTaskLabel.trim(),
      link: '/coding',
      completed: false,
      xp: 25
    };
    setMission((prev: any) => {
      const existingTasks = prev?.tasks || [];
      const updatedTasks = [...existingTasks, newTask];
      const completedCount = updatedTasks.filter((t: any) => t.completed).length;
      const totalCount = updatedTasks.length;
      const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      const updated = {
        ...(prev || {
          title: 'Daily Placement Sprint',
          objective: 'Personalized sprint calibrated to today\'s learning goals.',
          rewardXp: 120,
          streakDays: 7
        }),
        tasks: updatedTasks,
        progress
      };
      localStorage.setItem(missionStorageKey, JSON.stringify(updated));
      return updated;
    });
    setNewTaskLabel('');
    setIsAddingTask(false);
  };

  const getTargetedPracticeLink = (node: string) => {
    switch (node) {
      case 'Prefix Sums':
        return '/coding?category=Arrays&topic=Prefix%20Sums';
      case 'Two Pointers':
        return '/coding?category=Two%20Pointers&topic=Two%20Pointers';
      case 'BFS':
        return '/coding?category=Graphs&topic=BFS';
      case 'DFS':
        return '/coding?category=Graphs&topic=DFS';
      case 'Arrays':
        return '/coding?category=Arrays';
      case 'Graphs':
        return '/coding?category=Graphs';
      case 'DSA':
      default:
        return '/coding?category=All';
    }
  };

  const getNodeDetails = (node: string) => {
    switch (node) {
      case 'Prefix Sums':
        return { name: 'Prefix Sums', gainDSA: '+3%', gainReadiness: '+1.5%', status: 'Mastered' };
      case 'Two Pointers':
        return { name: 'Two Pointers', gainDSA: '+4%', gainReadiness: '+2.0%', status: 'Proficient' };
      case 'BFS':
        return { name: 'BFS Traversal', gainDSA: '+7%', gainReadiness: '+3.5%', status: 'Gap Area' };
      case 'DFS':
        return { name: 'DFS & Topological Sort', gainDSA: '+8%', gainReadiness: '+4.0%', status: 'Critical Gap' };
      case 'Arrays':
        return { name: 'Arrays & HashMaps', gainDSA: '+5%', gainReadiness: '+2.5%', status: 'Strong' };
      case 'Graphs':
        return { name: 'Graph Algorithms', gainDSA: '+9%', gainReadiness: '+4.5%', status: 'Primary Gap' };
      case 'DSA':
      default:
        return { name: 'Data Structures & Algorithms', gainDSA: '+10%', gainReadiness: '+5.0%', status: 'Core Domain' };
    }
  };

  const careerGoal = profile?.careerGoal || 'Full Stack Developer';
  const careerReadiness = profile?.readinessScore || 71;

  // Stable secondary message picked once on mount
  const secondaryMessage = useMemo(() => {
    const secondaryMessages = [
      'Ready to make some progress today?',
      "Let's keep building toward your goals.",
      'Good to see you back.',
      "Let's see what you can accomplish today.",
      'Keep learning. Keep building.',
      'Make today count.'
    ];
    return secondaryMessages[new Date().getDate() % secondaryMessages.length];
  }, []);

  // Determine time-of-day greeting (Phase 2)
  const getGreetingPrefix = () => {
    const hour = new Date().getHours();
    let displayName = user?.name?.trim() || profile?.name?.trim() || '';
    if (displayName.toLowerCase() === 'skillforge engineer' || displayName.toLowerCase() === 'student') {
      displayName = user?.email ? user.email.split('@')[0] : '';
      if (displayName) displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    }

    if (!displayName) {
      return 'Welcome back!';
    }

    if (hour >= 5 && hour < 12) {
      return `Good morning, ${displayName}!`;
    } else if (hour >= 12 && hour < 17) {
      return `Good afternoon, ${displayName}!`;
    } else if (hour >= 17 && hour < 21) {
      return `Good evening, ${displayName}!`;
    } else {
      return `Welcome back, ${displayName}!`;
    }
  };

  const greetingPrefix = getGreetingPrefix();

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-200">
      {/* HEADER WITH ADAPTIVE WELCOME */}
      <div className="bg-slate-900 border-b border-slate-800 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
                <Sparkles className="h-3.5 w-3.5" /> Career Track: {careerGoal}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
                {greetingPrefix}
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
                {secondaryMessage} SkillForge continuously tracks where you are, your skill gaps, and exactly what to learn next to land your target <strong>{careerGoal}</strong> role.
              </p>
            </div>

            {/* Streak & Readiness Metrics */}
            <div className="flex flex-wrap items-center gap-4">
              {/* STREAK RESCUE PILL (Section 21) */}
              <div className="bg-slate-800/80 border border-orange-500/30 rounded-2xl p-3 px-4 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                  <Flame className="h-5 w-5 fill-orange-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
                    <span>{profile?.streakDays || 7} Day Streak</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-300">Active</span>
                  </div>
                  <button
                    onClick={() => setShowMicroModal(true)}
                    className="text-[11px] text-slate-400 hover:text-white underline text-left block"
                  >
                    10-min Streak Rescue available
                  </button>
                </div>
              </div>

              {/* READINESS DIAL */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
                <div className="relative flex items-center justify-center">
                  <svg className="w-14 h-14 transform -rotate-90">
                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="5" className="text-slate-700" fill="transparent" />
                    <circle
                      cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="5"
                      className="text-emerald-400 transition-all duration-1000"
                      fill="transparent"
                      strokeDasharray="150.8"
                      strokeDashoffset={150.8 - (150.8 * careerReadiness) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute font-black text-xs text-white">{careerReadiness}%</span>
                </div>

                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase">Readiness Score</div>
                  <div className="text-sm font-bold text-white">Target: {careerGoal}</div>
                  <Link to="/profile" className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 mt-0.5">
                    View Placement Readiness <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">

        {/* ======================================================== */}
        {/* 1. SIGNATURE FEATURE: AI CAREER COPILOT (Section 10)     */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">AI Career Copilot</h2>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                    Context-Aware
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Understands your roadmap, code accuracy, and skill gaps to prescribe what to learn today.
                </p>
              </div>
            </div>

            <form onSubmit={handleAskCopilot} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={copilotQuestion}
                onChange={(e) => setCopilotQuestion(e.target.value)}
                placeholder='e.g. "What should I learn today?"'
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 sm:w-64"
              />
              <button
                type="submit"
                disabled={copilotLoading}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
              >
                {copilotLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </div>

          {copilotData && (
            <div className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-5 space-y-4 text-xs">
              <div className="text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                {copilotData.advice}
              </div>

              {copilotData.plan && copilotData.plan.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-2.5">
                    Prescribed Action Plan for Today:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {copilotData.plan.map((step: any, idx: number) => (
                      <Link
                        key={idx}
                        to={step.link}
                        className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 rounded-xl p-3 flex flex-col justify-between transition-all group"
                      >
                        <div>
                          <div className="flex justify-between items-center text-[10px] text-indigo-400 font-bold mb-1">
                            <span>{step.type}</span>
                            <span className="text-slate-500">{step.duration}</span>
                          </div>
                          <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                            {step.title}
                          </div>
                        </div>
                        <div className="text-right text-indigo-400 font-bold text-[11px] mt-2 flex items-center justify-end gap-1">
                          Start <ChevronRight className="h-3 w-3" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 2. ADAPTIVE TODAY'S MISSION (Section 11)                 */}
        {/* ======================================================== */}
        {mission && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5" /> Today's Mission
                </div>
                <h3 className="text-xl font-bold text-white">{mission.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{mission.objective}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-amber-400">+{mission.rewardXp} XP Reward</div>
                  <div className="text-[11px] text-slate-500">Progress: {mission.progress}%</div>
                </div>
                <div className="w-24 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${mission.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {mission.tasks.map((task: any) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    task.completed
                      ? 'bg-slate-800/40 border-slate-800 text-slate-400'
                      : 'bg-slate-800/80 border-slate-700 text-white'
                  }`}
                >
                  <button
                    onClick={() => handleToggleMissionTask(task.id, task.completed)}
                    className="flex items-center gap-3 text-left flex-1"
                  >
                    {task.completed ? (
                      <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-500 shrink-0" />
                    )}
                    <span className={`text-xs font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.label}
                    </span>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      to={task.link || '/coding'}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-[11px] font-bold transition-colors"
                    >
                      Launch
                    </Link>
                    <button
                      onClick={() => handleDeleteMissionTask(task.id)}
                      title="Delete task"
                      className="p-1 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Task Addition */}
            <div className="pt-2 border-t border-slate-800/80">
              {isAddingTask ? (
                <form onSubmit={handleAddNewTask} className="p-3 bg-slate-800/80 border border-indigo-500/40 rounded-xl flex flex-col sm:flex-row gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Enter new task description (e.g. Solve 1 Graph problem)"
                    value={newTaskLabel}
                    onChange={(e) => setNewTaskLabel(e.target.value)}
                    className="w-full sm:flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    autoFocus
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0"
                    >
                      Save Task
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsAddingTask(false); setNewTaskLabel(''); }}
                      className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold text-xs shrink-0"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 py-1 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Task
                </button>
              )}
            </div>
          </div>
        )}

        {/* SPACED REPETITION DUE REVIEWS */}
        {revisionTopics.length > 0 && (
          <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Due for Spaced Repetition Review</h2>
                  <p className="text-xs text-slate-400">Scientifically scheduled reviews based on the Ebbinghaus forgetting curve.</p>
                </div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20 w-fit">
                {revisionTopics.length} Concepts Expiring
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {revisionTopics.map((rt) => (
                <div key={rt.id} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-white mb-1">{rt.topic}</div>
                    <div className="text-[11px] text-slate-400 mb-2">Skill: {rt.skillName}</div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">Retention:</span>
                      <span className="text-amber-400 font-bold">{rt.retention}% (Day {rt.dueDay})</span>
                    </div>
                  </div>

                  <Link
                    to="/coding/two-sum"
                    className="mt-3 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-colors border border-amber-500/30"
                  >
                    Quick Recall Quiz <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. VISUAL SKILL GRAPH & DEPENDENCY TREE (Section 12)     */}
        {/* ======================================================== */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-1 flex items-center gap-1.5">
                <Network className="h-3.5 w-3.5" /> Interactive Skill Graph
              </div>
              <h3 className="text-xl font-bold text-white">Hierarchical Competency Topology</h3>
              <p className="text-xs text-slate-400">
                Skills propagate through parent domains. Improving leaf nodes elevates parent readiness.
              </p>
            </div>
            <Link
              to="/skills/gap-analysis"
              className="text-xs text-indigo-400 hover:underline font-bold flex items-center gap-1"
            >
              Full Gap Matrix <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 overflow-x-auto">
            {/* Visual Topology Diagram */}
            <div className="min-w-[600px] flex flex-col items-center space-y-6 text-center">
              {/* ROOT: DSA */}
              <button
                onClick={() => setActiveSkillNode('DSA')}
                className={`px-6 py-2.5 rounded-2xl font-black text-xs shadow-lg transition-all ${
                  activeSkillNode === 'DSA'
                    ? 'bg-indigo-500 text-white ring-2 ring-indigo-300 shadow-indigo-500/50'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/30 border border-indigo-400/30'
                }`}
              >
                DATA STRUCTURES & ALGORITHMS (68% Mastery)
              </button>

              {/* LAYER 1 */}
              <div className="grid grid-cols-2 gap-24 w-full max-w-lg">
                <button
                  onClick={() => setActiveSkillNode('Arrays')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    activeSkillNode === 'Arrays'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Arrays & HashMaps (85%)
                </button>

                <button
                  onClick={() => setActiveSkillNode('Graphs')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    activeSkillNode === 'Graphs'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/50'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Graph Algorithms (42% • GAP)
                </button>
              </div>

              {/* LAYER 2: Leaf Nodes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                <button
                  onClick={() => setActiveSkillNode('Prefix Sums')}
                  className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all text-center ${
                    activeSkillNode === 'Prefix Sums'
                      ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900 border-emerald-500/40 text-emerald-400 hover:bg-slate-800/80'
                  }`}
                >
                  Prefix Sums (90%)
                </button>
                <button
                  onClick={() => setActiveSkillNode('Two Pointers')}
                  className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all text-center ${
                    activeSkillNode === 'Two Pointers'
                      ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900 border-emerald-500/40 text-emerald-400 hover:bg-slate-800/80'
                  }`}
                >
                  Two Pointers (82%)
                </button>
                <button
                  onClick={() => setActiveSkillNode('BFS')}
                  className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all text-center ${
                    activeSkillNode === 'BFS'
                      ? 'bg-amber-500/30 border-amber-400 text-amber-300 ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-900 border-amber-500/40 text-amber-400 hover:bg-slate-800/80'
                  }`}
                >
                  BFS Traversal (48%)
                </button>
                <button
                  onClick={() => setActiveSkillNode('DFS')}
                  className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all text-center ${
                    activeSkillNode === 'DFS'
                      ? 'bg-red-500/30 border-red-400 text-red-300 ring-2 ring-red-500/50 shadow-lg shadow-red-500/20'
                      : 'bg-slate-900 border-red-500/40 text-red-400 hover:bg-slate-800/80'
                  }`}
                >
                  DFS & Topological Sort (35%)
                </button>
              </div>
            </div>

            {/* Selected Node Dependency Explanation */}
            {(() => {
              const details = getNodeDetails(activeSkillNode);
              return (
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-slate-400">
                    Selected Focus: <strong className="text-white">{details.name}</strong> ({details.status}). Closing this node increases Overall DSA by <strong>{details.gainDSA}</strong> and placement readiness by <strong>{details.gainReadiness}</strong>.
                  </div>
                  <Link
                    to={getTargetedPracticeLink(activeSkillNode)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    Practice Targeted Exercises ({details.name}) <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })()}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. MISTAKE MEMORY & LEARNING DNA (Sections 13 & 14)       */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* MISTAKE MEMORY */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-red-400 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" /> Mistake Memory
              </div>
              <h3 className="text-lg font-bold text-white">Recurring Error Pattern Tracker</h3>
              <p className="text-xs text-slate-400">
                Tracks friction points across submissions to recommend counter-habit practice.
              </p>
            </div>

            {mistakes && (
              <div className="space-y-3">
                {mistakes.recentMistakes && mistakes.recentMistakes.length > 0 ? (
                  <>
                    {mistakes.frequentStruggles && mistakes.frequentStruggles.length > 0 && (
                      <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60 text-xs">
                        <span className="text-slate-400 font-bold block mb-1">Common Cognitive Traps:</span>
                        <ul className="list-disc list-inside text-slate-300 space-y-1">
                          {mistakes.frequentStruggles.map((s: string, idx: number) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="space-y-2">
                      {mistakes.recentMistakes.map((m: any, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs flex justify-between items-center gap-2">
                          <div>
                            <div className="font-bold text-white">{m.problemTitle}</div>
                            <div className="text-[11px] text-red-400 mt-0.5">Trap: {m.mistakePattern}</div>
                          </div>
                          <Link
                            to={`/coding/${m.slug}`}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px] font-semibold border border-slate-700"
                          >
                            Retry
                          </Link>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center bg-slate-800/30 rounded-2xl border border-slate-800/80">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                    <p className="text-sm font-semibold text-white">No recurring mistakes yet — keep practicing!</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      As you attempt problems in the Coding Playground, recurring error patterns and cognitive traps will be tracked here to guide targeted counter-habit drills.
                    </p>
                    <Link
                      to="/coding"
                      className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-colors"
                    >
                      Solve Coding Challenges <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* LEARNING DNA */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1 flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5" /> Learning DNA
              </div>
              <h3 className="text-lg font-bold text-white">Cognitive Pattern Summary</h3>
              <p className="text-xs text-slate-400">
                Derived from submission speed, session length, and recall accuracy patterns.
              </p>
            </div>

            {dna && (
              <div className="space-y-3.5 text-xs">
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                  <div className="text-xs font-bold text-purple-300">{dna.summaryTitle}</div>
                  <div className="text-slate-400 text-[11px] mt-1">
                    Peak Performance Window: <strong className="text-white">{dna.peakPerformanceWindow}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Strongest Pillar</span>
                    <div className="font-bold text-white mt-0.5">{dna.strongestPillar}</div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Friction Area</span>
                    <div className="font-bold text-amber-400 mt-0.5">{dna.frictionArea}</div>
                  </div>
                </div>

                {dna.recommendedRoutine && (
                  <div className="p-3.5 bg-slate-800/30 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                    Optimal Sprint Cadence: <strong className="text-white">{dna.recommendedRoutine.learnMin || 25}m learn + {dna.recommendedRoutine.practiceMin || 15}m code + {dna.recommendedRoutine.quizMin || 10}m quiz</strong>.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. PLACEMENT READINESS RADAR (Section 16)                */}
        {/* ======================================================== */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" /> Placement Readiness Radar
              </div>
              <h3 className="text-xl font-bold text-white">Multi-Dimensional Hiring Benchmarks</h3>
              <p className="text-xs text-slate-400">
                Calibrated against interview rubrics for {careerGoal}.
              </p>
            </div>
            <Link
              to="/placement-hub"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
            >
              Open Placement Hub →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Data Structures & Algorithms', score: 68, bar: 68, status: 'Intermediate' },
              { label: 'Core CS (OS, DBMS, Networks)', score: 74, bar: 74, status: 'Strong' },
              { label: 'Applied Full-Stack Development', score: 82, bar: 82, status: 'Mastered' },
              { label: 'Verified Capstone Projects', score: 80, bar: 80, status: 'Strong' },
              { label: 'Technical Mock Interview Screen', score: 62, bar: 62, status: 'Needs Focus' },
              { label: 'System Design & Tradeoffs', score: 55, bar: 55, status: 'Gap Area' }
            ].map((dim) => (
              <div key={dim.label} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1">
                    <span className="text-white">{dim.label}</span>
                    <span className="text-indigo-400">{dim.score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full"
                      style={{ width: `${dim.bar}%` }}
                    />
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-slate-400 flex justify-between items-center">
                  <span>Rating: <strong className="text-slate-200">{dim.status}</strong></span>
                  <Link to="/interview" className="text-indigo-400 hover:underline font-semibold">
                    Improve →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6: ENROLLED COURSES */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Enrolled Courses</h2>
            <Link to="/catalog" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-semibold">
              Explore More Courses <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ENROLLED_COURSES.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>

      {/* MICRO-LEARNING MODAL (10-minute Rapid Sprint) */}
      {showMicroModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
                <h3 className="font-bold text-white text-lg">10-Minute Rapid Streak Sprint</h3>
              </div>
              <button
                onClick={() => {
                  setShowMicroModal(false);
                  setMicroQuizDone(false);
                  setSelectedMicroOption(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!microQuizDone ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                  <div className="font-bold text-indigo-300 mb-1">Concept: Clustered vs Non-Clustered Indexes</div>
                  In a relational database table, what happens physically when you create a clustered index on a primary key column?
                </div>

                <div className="space-y-2">
                  {[
                    'The physical order of data rows on disk is permanently sorted by the index key.',
                    'A duplicate shadow copy of the table is created in memory cache.',
                    'All secondary non-clustered indexes are immediately disabled.'
                  ].map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedMicroOption(idx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-colors ${
                        selectedMicroOption === idx
                          ? 'bg-indigo-600/30 border-indigo-500 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setMicroQuizDone(true)}
                  disabled={selectedMicroOption === null}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
                >
                  Verify Rapid Answer
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Streak Rescued & Verified!</h4>
                <p className="text-xs text-slate-400">
                  Awesome work! You completed your 10-minute sprint and prevented knowledge decay on <strong>Database Storage Engines</strong>.
                </p>
                <div className="p-3 bg-amber-500/10 text-amber-300 rounded-xl border border-amber-500/20 text-xs font-bold">
                  +15 XP Credited to your Profile
                </div>
                <button
                  onClick={() => {
                    setShowMicroModal(false);
                    setMicroQuizDone(false);
                    setSelectedMicroOption(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

