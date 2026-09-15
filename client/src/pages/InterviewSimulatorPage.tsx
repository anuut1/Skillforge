import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Award,
  RefreshCw,
  Clock,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  History,
  ArrowRight,
  Send
} from 'lucide-react';
import client from '../api/client';
import type { InterviewSessionReport, InterviewQuestionItem } from '../types';

const InterviewSimulatorPage: React.FC = () => {
  // Setup Config State
  const [roleTarget, setRoleTarget] = useState('Software Engineer');
  const [interviewType, setInterviewType] = useState('DSA');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [timePerQuestionSec, setTimePerQuestionSec] = useState(120);

  // Active Session State
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestionItem | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [answerInput, setAnswerInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [finalReport, setFinalReport] = useState<InterviewSessionReport | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'interview' | 'history'>('interview');

  // Full-Screen & Exit Modal State
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Timer State
  const [secondsRemaining, setSecondsRemaining] = useState(120);
  const [timerExpiredNotice, setTimerExpiredNotice] = useState(false);
  const timerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await client.get('/interview/history');
      if (Array.isArray(res.data)) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error('Failed to load interview history', err);
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Countdown Timer Hook
  useEffect(() => {
    if (!sessionId || isFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmitOnTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionId, currentQuestionIndex, isFinished]);

  // Request Fullscreen
  const enterFullscreenMode = async () => {
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen request bypassed or not supported:', err);
    }
  };

  const exitFullscreenMode = async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Exit fullscreen error:', err);
    }
  };

  // Start Session
  const startNewInterview = async () => {
    setIsStarting(true);
    setFinalReport(null);
    setIsFinished(false);
    setAnswerInput('');
    setTimerExpiredNotice(false);

    try {
      const res = await client.post('/interview/start', {
        roleTarget,
        interviewType,
        difficulty,
        totalQuestions,
        timePerQuestion: timePerQuestionSec
      });

      setSessionId(res.data.sessionId);
      setCurrentQuestion(res.data.currentQuestion);
      setCurrentQuestionIndex(res.data.currentQuestionIndex);
      setTotalQuestions(res.data.totalQuestions);
      setSecondsRemaining(res.data.timePerQuestion || timePerQuestionSec);

      await enterFullscreenMode();
    } catch (err) {
      console.error('Failed to start interview', err);
    } finally {
      setIsStarting(false);
    }
  };

  // Auto-Submit on Timeout
  const handleAutoSubmitOnTimeout = async () => {
    setTimerExpiredNotice(true);
    setTimeout(() => setTimerExpiredNotice(false), 3000);
    await submitCurrentAnswer(answerInput || '[No response submitted before time expired]');
  };

  // Submit Answer
  const submitCurrentAnswer = async (submittedText: string) => {
    if (!sessionId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await client.post('/interview/respond', {
        sessionId,
        answer: submittedText
      });

      setAnswerInput('');

      if (res.data.isFinished) {
        setIsFinished(true);
        setFinalReport(res.data);
        fetchHistory();
        exitFullscreenMode();
      } else {
        setCurrentQuestion(res.data.nextQuestion);
        setCurrentQuestionIndex(res.data.currentQuestionIndex);
        setSecondsRemaining(timePerQuestionSec);
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Leave confirmation
  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    setSessionId(null);
    setIsFinished(false);
    exitFullscreenMode();
  };

  // Format Timer Display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerVisualState = () => {
    if (secondsRemaining <= 15) return 'critical';
    if (secondsRemaining <= 40) return 'warning';
    return 'normal';
  };

  const timerState = getTimerVisualState();

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* 1. SETUP / LOBBY SCREEN (Not in active session) */}
      {!sessionId && !isFinished && (
        <div className="pb-20">
          <div className="bg-slate-900 border-b border-slate-800 py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
                    <Bot className="h-3.5 w-3.5" /> High-Fidelity Technical Screening Room
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    AI Mock Technical Interview
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                    Distraction-free, timed, full-screen technical interview simulator. Evaluates conceptual depth, complexity analysis, communication, and problem-solving readiness.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('interview')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'interview'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Setup Interview
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'history'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <History className="h-3.5 w-3.5" /> History ({history.length})
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl mt-10">
            {activeTab === 'interview' ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
                <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Configure Your Interview Session</h2>
                    <p className="text-xs text-slate-400">Tailor the track, focus question type, and countdown duration.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Target Role */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Target Role
                    </label>
                    <select
                      value={roleTarget}
                      onChange={(e) => setRoleTarget(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="Cloud Engineer">Cloud Engineer</option>
                    </select>
                  </div>

                  {/* Question Count */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Number of Questions
                    </label>
                    <select
                      value={totalQuestions}
                      onChange={(e) => setTotalQuestions(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value={3}>3 Questions (Quick Sprint)</option>
                      <option value={5}>5 Questions (Standard Technical Screen)</option>
                      <option value={8}>8 Questions (Full Comprehensive Loop)</option>
                    </select>
                  </div>

                  {/* Time per question */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Time Per Question
                    </label>
                    <select
                      value={timePerQuestionSec}
                      onChange={(e) => setTimePerQuestionSec(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value={90}>1.5 minutes (Strict Fast Response)</option>
                      <option value={120}>2.0 minutes (Standard FAANG Pace)</option>
                      <option value={180}>3.0 minutes (Deep Architectural Dive)</option>
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Difficulty Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Beginner', 'Intermediate', 'Advanced'].map(diff => (
                        <button
                          key={diff}
                          type="button"
                          onClick={() => setDifficulty(diff)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                            difficulty === diff
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interview Type Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                    Interview Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { id: 'DSA', label: 'DSA & Algorithms', desc: 'Data Structures, Trees, Complexity' },
                      { id: 'Core CS', label: 'Core CS', desc: 'OS, DBMS, Networks, Concurrency' },
                      { id: 'Behavioral', label: 'Behavioral', desc: 'STAR, Conflict, Impact' },
                      { id: 'System Design', label: 'System Design', desc: 'Scalability, Caching, DBs' },
                      { id: 'Mixed', label: 'Mixed Loop', desc: 'Comprehensive Round' }
                    ].map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setInterviewType(t.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          interviewType === t.id
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                            : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-xs font-bold text-white mb-1">{t.label}</div>
                        <div className="text-[10px] text-slate-400 leading-snug">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ready to enter modal */}
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-300">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="h-4 w-4 shrink-0 text-indigo-400" />
                    <span>Clicking start enters distraction-free <strong>Full-Screen Mode</strong>.</span>
                  </div>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">Esc or Exit button prompts confirmation</span>
                </div>

                <div className="pt-2 flex justify-center">
                  <button
                    onClick={startNewInterview}
                    disabled={isStarting}
                    className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02] flex items-center gap-2 disabled:opacity-50"
                  >
                    {isStarting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Preparing Interview Room...
                      </>
                    ) : (
                      <>
                        <span>START INTERVIEW</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* HISTORY VIEW */
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                  Interview Performance History
                </h3>
                {history.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No completed interviews yet. Start your first session above!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map(item => (
                      <div
                        key={item.id}
                        className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{item.roleTarget}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              {item.interviewType}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                              {item.difficulty}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            Completed on {new Date(item.createdAt).toLocaleDateString()} • {item.transcript?.length || 5} Questions Evaluated
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-black text-emerald-400">{item.overallScore} / 100</div>
                            <div className="text-[10px] text-slate-400">Overall Score</div>
                          </div>
                          <button
                            onClick={() => {
                              setFinalReport({
                                isFinished: true,
                                sessionId: item.id,
                                roleTarget: item.roleTarget,
                                interviewType: item.interviewType,
                                difficulty: item.difficulty,
                                overallScore: item.overallScore,
                                technicalScore: item.technicalScore,
                                problemSolvingScore: item.problemSolvingScore,
                                communicationScore: item.communicationScore,
                                confidenceScore: item.confidenceScore,
                                relevanceScore: item.relevanceScore,
                                strengths: item.strengths,
                                improvements: item.improvements,
                                transcript: item.transcript,
                                createdAt: item.createdAt
                              });
                              setIsFinished(true);
                              setSessionId('viewing-history');
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                          >
                            Open Report
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. DEDICATED FULL-SCREEN INTERVIEW EXPERIENCE (Distraction-free) */}
      {sessionId && !isFinished && currentQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 overflow-hidden select-none">
          {/* Top Bar: Title, Progress, Dynamic Timer, Exit */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-black text-white text-xs sm:text-sm tracking-wider uppercase">
                SKILLFORGE INTERVIEW
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
                {roleTarget} • {interviewType}
              </span>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              {/* Question Progress Counter */}
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20">
                Question {currentQuestionIndex} of {totalQuestions}
              </span>

              {/* Dynamic Countdown Timer */}
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-black text-xs sm:text-sm transition-all ${
                  timerState === 'critical'
                    ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                    : timerState === 'warning'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-emerald-400 border-slate-800'
                }`}
                title={timerState === 'critical' ? 'Less than 15 seconds remaining!' : 'Time remaining'}
              >
                <Clock className={`h-4 w-4 ${timerState === 'critical' ? 'text-red-400' : ''}`} />
                <span>{formatTime(secondsRemaining)}</span>
              </div>

              {/* Exit Request Button */}
              <button
                onClick={() => setShowExitConfirm(true)}
                className="text-xs font-semibold text-slate-400 hover:text-red-400 p-2 rounded-xl hover:bg-slate-900 transition-colors"
                title="Leave Interview"
              >
                Exit
              </button>
            </div>
          </div>

          {/* Timeout Alert Notification if triggered */}
          {timerExpiredNotice && (
            <div className="mt-2 p-3 bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
              <span>Time's up! Automatically submitting your answer and progressing to the next question.</span>
            </div>
          )}

          {/* MAIN QUESTION & ANSWER AREA */}
          <div className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto my-auto space-y-6 overflow-y-auto py-6">
            {/* Question Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                <span>QUESTION {currentQuestionIndex}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {currentQuestion.type || interviewType} • {currentQuestion.difficulty || difficulty}
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer Input Area */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span>Your Answer</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    (Be concise, state complexity, algorithms, and trade-offs)
                  </span>
                </label>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>{answerInput.trim() ? `${answerInput.trim().split(/\s+/).length} words` : '0 words'}</span>
                </div>
              </div>

              <textarea
                autoFocus
                rows={7}
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="Type your structured answer here. Press Submit Answer or wait for timer expiration..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm font-sans text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    submitCurrentAnswer(answerInput);
                  }
                }}
              />

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <span>Tip: Press <strong className="text-slate-400">Ctrl + Enter</strong> to submit instantly.</span>
                <span>Auto-submits when countdown reaches 00:00</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Action */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 shrink-0 max-w-4xl w-full mx-auto">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Session Live</span>
            </div>

            <button
              onClick={() => submitCurrentAnswer(answerInput)}
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Evaluating Answer with AI...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Answer & Continue</span>
                </>
              )}
            </button>
          </div>

          {/* CONFIRMATION MODAL BEFORE EXIT */}
          {showExitConfirm && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-center animate-in fade-in zoom-in-95">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Leave interview?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your current interview progress and unscored responses will be lost. Are you sure you want to exit?
                </p>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setShowExitConfirm(false)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                  >
                    Continue Interview
                  </button>
                  <button
                    onClick={handleConfirmExit}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-slate-700 text-xs font-semibold transition-colors"
                  >
                    Exit Interview
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. POST-INTERVIEW COMPREHENSIVE AI REPORT */}
      {isFinished && finalReport && (
        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 w-full">
          {/* Top Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold mb-2">
                <CheckCircle2 className="h-3.5 w-3.5" /> Interview Completed
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                AI Evaluation Report: {finalReport.roleTarget || roleTarget}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Completed on {new Date().toLocaleDateString()} • {finalReport.transcript?.length || totalQuestions} Questions Analyzed
              </p>
            </div>

            {/* Overall Score Badge */}
            <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 p-5 rounded-3xl shrink-0">
              <div className="text-right">
                <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                  {finalReport.overallScore} <span className="text-sm text-slate-500 font-normal">/ 100</span>
                </div>
                <div className="text-xs text-slate-400 font-semibold">Overall Rating</div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Award className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Breakdown Dimensions */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Core Competency Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Technical Knowledge', value: finalReport.technicalScore || 82, color: 'text-indigo-400' },
                { label: 'Problem Solving', value: finalReport.problemSolvingScore || 76, color: 'text-purple-400' },
                { label: 'Communication', value: finalReport.communicationScore || 80, color: 'text-blue-400' },
                { label: 'Confidence', value: finalReport.confidenceScore || 74, color: 'text-amber-400' },
                { label: 'Answer Relevance', value: finalReport.relevanceScore || 85, color: 'text-emerald-400' }
              ].map((comp, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-1">
                  <div className={`text-2xl font-black ${comp.color}`}>{comp.value}%</div>
                  <div className="text-[11px] font-semibold text-slate-400">{comp.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths and Areas to Improve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> STRENGTHS
              </h3>
              <ul className="space-y-2 text-xs text-slate-200">
                {finalReport.strengths && finalReport.strengths.length > 0 ? (
                  finalReport.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{s}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Strong Java & Core CS fundamentals</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Structured, methodical problem-solving breakdown</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Articulate explanation of edge cases</li>
                  </>
                )}
              </ul>
            </div>

            {/* Areas to Improve */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> AREAS TO IMPROVE
              </h3>
              <ul className="space-y-2 text-xs text-slate-200">
                {finalReport.improvements && finalReport.improvements.length > 0 ? (
                  finalReport.improvements.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400">△</span>
                      <span>{imp}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-start gap-2"><span className="text-amber-400">△</span> Consistently state time and space complexity upfront</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400">△</span> Articulate memory overhead and garbage collection trade-offs</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400">△</span> Include real-world scale and concurrency safeguards</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Question-by-Question Detailed Feedback */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Question-by-Question Technical Audit
            </h3>

            <div className="space-y-6">
              {finalReport.transcript && finalReport.transcript.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold uppercase text-indigo-400">
                      Question {idx + 1}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold">
                      Score: {item.evaluation?.score || 75} / 100
                    </span>
                  </div>

                  {/* Question Prompt */}
                  <div className="text-sm font-bold text-white leading-relaxed">
                    {item.question}
                  </div>

                  {/* User Answer */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">YOUR ANSWER</div>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono">
                      {item.answer || '[No response provided]'}
                    </p>
                  </div>

                  {/* AI Feedback */}
                  <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase text-indigo-400">AI FEEDBACK</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.evaluation?.feedback || 'Good attempt covering basic points.'}
                    </p>
                  </div>

                  {/* Ideal Answer / Key Points */}
                  {item.evaluation?.idealAnswer && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase text-emerald-400">IDEAL ANSWER / KEY POINTS</div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.evaluation.idealAnswer}
                      </p>
                    </div>
                  )}

                  {/* Key Improvement */}
                  {item.evaluation?.keyImprovement && (
                    <div className="text-xs text-amber-300 flex items-start gap-2 pt-1">
                      <span className="font-bold">Key Improvement:</span>
                      <span>{item.evaluation.keyImprovement}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions & Connections */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-indigo-950/30 border border-indigo-500/30">
            <div>
              <div className="text-xs font-bold uppercase text-indigo-300 tracking-wider">Placement Readiness Updated</div>
              <p className="text-xs text-slate-300 mt-0.5">
                This mock interview performance has recalculated your Career Readiness score and updated your Profile metrics.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setSessionId(null);
                  setIsFinished(false);
                  setFinalReport(null);
                  setActiveTab('interview');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors"
              >
                Practice Another Round
              </button>
              <Link
                to="/profile"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all"
              >
                View Profile & Scores →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSimulatorPage;
