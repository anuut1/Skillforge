import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Award,
  Code2,
  Briefcase,
  ChevronRight,
  BrainCircuit,
  Compass,
  FileCheck2,
  ShieldCheck,
  Flame,
  LogIn
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'roadmap' | 'tutor' | 'placement'>('roadmap');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-24">
      {/* AMBIENT GLOW BACKDROP */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[900px] h-[580px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/20 to-teal-500/10 blur-[150px] rounded-full" />
      </div>

      {/* 1. HERO INTRODUCTION */}
      <section className="pt-16 sm:pt-20 pb-16 px-6 text-center max-w-5xl mx-auto">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-medium mb-6 shadow-2xl">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-indigo-300 font-bold">Welcome to SkillForge</span>
          <span className="text-slate-600">•</span>
          <span>AI-Powered Career Readiness & Adaptive Learning</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6">
          Your Intelligent Bridge From{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-teal-300 bg-clip-text text-transparent">
            Student to Hired Engineer
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
          SkillForge goes beyond traditional passive video platforms. We diagnose your current skills, build your custom step-by-step career roadmap, test your code in real-time, and benchmark verified job readiness for top tech roles.
        </p>

        {/* PRIMARY CALL-TO-ACTIONS / LOGIN OPTIONS */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 max-w-2xl mx-auto backdrop-blur-md mb-16 shadow-2xl">
          <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-4">
            {isAuthenticated && user
              ? `You are signed in as ${user.name} (${user.role})`
              : 'Ready to start your journey? Log in or create your profile'}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAuthenticated && user ? (
              <button
                onClick={() => navigate(user.role === 'instructor' ? '/instructor' : '/student')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02]"
              >
                Go to Your Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02]"
                >
                  <LogIn className="h-4 w-4" />
                  Log In to Your Account
                </Link>
                <Link
                  to="/onboarding"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-sm border border-slate-700 transition-colors"
                >
                  New Here? Start Free
                  <ArrowRight className="h-4 w-4 text-indigo-400" />
                </Link>
              </>
            )}

            <Link
              to="/catalog"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-slate-300 hover:text-white font-semibold text-sm transition-colors"
            >
              Explore Courses
            </Link>
          </div>
        </div>

        {/* INTERACTIVE PREVIEW: WHAT SKILLFORGE DOES */}
        <div className="relative rounded-3xl p-2 bg-gradient-to-b from-slate-800/80 via-slate-900/50 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden text-left">
          <div className="bg-slate-950 rounded-2xl border border-slate-800/80 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-500">skillforge.dev/platform/preview</span>
              </div>

              {/* Tab Switcher */}
              <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setActiveInteractiveTab('roadmap')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeInteractiveTab === 'roadmap' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1. Adaptive Roadmap
                </button>
                <button
                  onClick={() => setActiveInteractiveTab('tutor')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeInteractiveTab === 'tutor' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2. 24/7 AI Tutor
                </button>
                <button
                  onClick={() => setActiveInteractiveTab('placement')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeInteractiveTab === 'placement' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3. Placement Readiness
                </button>
              </div>
            </div>

            {/* Dynamic Interactive Window */}
            <div className="pt-6">
              {activeInteractiveTab === 'roadmap' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-xs text-slate-400">Target Role Benchmark</div>
                    <div className="text-xl font-bold text-white mt-1">Full-Stack Engineer</div>
                    <div className="text-xs text-emerald-400 mt-2 font-medium">✓ 72% Readiness Score</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-xs text-slate-400">Personalized Next Step</div>
                    <div className="text-xl font-bold text-indigo-300 mt-1">Database Indexing & B-Trees</div>
                    <div className="text-xs text-slate-400 mt-2">AI detected gap in SQL query plans</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-xs text-slate-400">Spaced Repetition</div>
                    <div className="text-xl font-bold text-amber-300 mt-1">3 Topics Due for Review</div>
                    <div className="text-xs text-slate-400 mt-2">Retention score: 86%</div>
                  </div>
                </div>
              )}

              {activeInteractiveTab === 'tutor' && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="flex gap-2">
                    <span className="text-slate-400 font-bold">Student:</span>
                    <span className="text-slate-200">"Why is quicksort O(n log n) average but O(n²) worst case?"</span>
                  </div>
                  <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-lg text-indigo-200 flex gap-2">
                    <span className="text-indigo-400 font-bold">AI Tutor:</span>
                    <span>
                      "When your pivot repeatedly divides elements unevenly (like picking the smallest or largest in an already sorted array), recursion depth reaches N, leading to N × N operations."
                    </span>
                  </div>
                </div>
              )}

              {activeInteractiveTab === 'placement' && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                      Evidence-Based Readiness
                    </div>
                    <div className="text-base font-bold text-white mt-0.5">Alex Morgan • System Design & Go Track</div>
                    <div className="text-xs text-slate-400 mt-1">
                      Verified Capstone: High-Throughput Distributed Rate Limiter (92% Score)
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                    Job Ready Profile (88%)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT IT DOES & WHAT YOU CAN EXPECT */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
            <Compass className="h-3.5 w-3.5" /> What You Can Expect
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            A Complete Career-Readiness Ecosystem
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            SkillForge is designed around the 5 essential pillars every tech candidate needs to successfully land job offers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. Personalized Skill Roadmaps</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                No two students learn the same way. SkillForge audits your background, identifies weaknesses in real time, and dynamically orders your courses.
              </p>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800/60 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Automated Gap Analysis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Micro-session "10-minute" mode
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-6">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. In-Browser Code Compiler</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                Practice coding challenges with multi-language execution (JavaScript, Python, Java, C++), instant test assertions, and automated Big-O complexity audits.
              </p>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800/60 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" /> Real-time code execution
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" /> AI Code Review & loop depth analysis
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. Placement Hub & Mock Screens</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                Prepare for actual technical screens with an AI Recruiter that assesses your clarity, depth, time complexity, and system design trade-offs.
              </p>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800/60 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> 4-Axis Technical Evaluation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> Instant Adaptive Feedback
              </li>
            </ul>
          </div>

          {/* Pillar 4 */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">4. Competitive Arena & Study Rooms</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                Stay consistent through daily streaks, peer leaderboards, XP rewards, and live collaborative study rooms to crack problems with classmates.
              </p>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800/60 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" /> Daily Challenge Questions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" /> Real-time peer collaboration
              </li>
            </ul>
          </div>

          {/* Pillar 5 */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">5. Placement Hub & Career Readiness</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                Recruiters look for proven competency. SkillForge continuously evaluates your GitHub capstones, coding playground accuracy, mock interview transcripts, and CS fundamentals into an evidence-backed readiness profile.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-300 pt-4 border-t border-slate-800/60">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Comprehensive Placement Hub</span>
              <span className="flex items-center gap-1.5"><FileCheck2 className="h-4 w-4" /> GitHub Project Rubric Grading</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRANSPARENT PRICING */}
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Simple & Transparent
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Plans for Every Stage of Your Career
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mb-8">
            Choose the plan that fits your current goals. You can start completely free.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl transition-colors ${
                billingCycle === 'monthly' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                billingCycle === 'annual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Annual Pass
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Starter Plan */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold text-slate-300 mb-1">Starter Learner</div>
              <p className="text-xs text-slate-500 mb-6">Explore fundamental courses and daily challenge questions.</p>
              <div className="text-4xl font-black text-white mb-6">
                $0 <span className="text-xs text-slate-500 font-normal">/ free forever</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Full Public Course Catalog Access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Daily Arena Challenges
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Peer Study Rooms
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Basic Quiz Evaluations
                </li>
              </ul>
            </div>
            <Link
              to="/catalog"
              className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold text-center transition-colors"
            >
              Browse Catalog Free
            </Link>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 border-2 border-indigo-500/50 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
              Most Popular
            </div>
            <div>
              <div className="text-sm font-bold text-indigo-300 mb-1">Career Readiness Pro</div>
              <p className="text-xs text-slate-400 mb-6">The full autonomous career progression engine.</p>
              <div className="text-4xl font-black text-white mb-6">
                {billingCycle === 'annual' ? '$29' : '$39'}{' '}
                <span className="text-xs text-slate-400 font-normal">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-200 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Personalized Dynamic Roadmap
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Unlimited In-Lecture AI Tutor
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" /> In-Browser Code Compiler & Review
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" /> GitHub Capstone Rubric Grading
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" /> AI Technical Mock Interviewer
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Placement Hub & Job Readiness Portfolio
                </li>
              </ul>
            </div>
            <Link
              to="/onboarding"
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold text-center transition-all shadow-lg shadow-indigo-500/30 hover:scale-[1.02]"
            >
              Start Free Trial & Onboard
            </Link>
          </div>

          {/* Campus & Enterprise */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold text-slate-300 mb-1">University & Enterprise</div>
              <p className="text-xs text-slate-500 mb-6">Cohort analytics, custom curriculum tracks & LMS sync.</p>
              <div className="text-4xl font-black text-white mb-6">
                Custom <span className="text-xs text-slate-500 font-normal">institution plan</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Instructor AI Studio & Course Builder
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" /> 5-Point Course Quality Health Auditor
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Campus Placement Analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Dedicated Account Manager
                </li>
              </ul>
            </div>
            <Link
              to="/auth"
              className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold text-center transition-colors"
            >
              Contact Campus Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FINAL LOGIN & PROCEED CTA CALLOUT */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-b from-indigo-950/50 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl">
          <h3 className="text-2xl sm:text-4xl font-black text-white mb-4">
            Take Your Next Step Today
          </h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
            Log in to continue where you left off, or complete your 2-minute skill onboarding to receive your custom learning roadmap.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02]"
            >
              <LogIn className="h-4 w-4" />
              Log In to SkillForge
            </Link>
            <Link
              to="/onboarding"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-sm border border-slate-700 transition-colors"
            >
              Create Account & Onboard
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

