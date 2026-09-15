import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Code2, Clock, Calendar, ShieldCheck } from 'lucide-react';
import client from '../api/client';

const CAREER_GOALS = [
  'Software Developer',
  'Full Stack Developer',
  'Backend Developer',
  'Frontend Developer',
  'Data Analyst',
  'Data Scientist',
  'AI/ML Engineer',
  'Cloud Engineer',
  'DevOps Engineer',
  'Cybersecurity Engineer',
  'Mobile Developer',
  'Competitive Programmer',
  'Interview Preparation',
  'Custom Goal'
];

const LEVELS = [
  { id: 'Beginner', desc: 'Starting from scratch, building fundamentals and basics.' },
  { id: 'Intermediate', desc: 'Comfortable with syntax, building projects, want job readiness.' },
  { id: 'Advanced', desc: 'Strong foundation, targeting senior architecture & FAANG interviews.' }
];

const TECHNOLOGIES = [
  'Java', 'C++', 'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js',
  'SQL', 'PostgreSQL', 'MongoDB', 'Git', 'Docker', 'AWS', 'Spring Boot', 'Linux'
];

const COMMITMENTS = [
  { id: '15 min/day', desc: 'Micro-learning pace for busy schedules' },
  { id: '30 min/day', desc: 'Consistent steady daily habit' },
  { id: '1 hour/day', desc: 'Recommended standard for quick progress' },
  { id: '2+ hours/day', desc: 'Intensive boot-camp mode' }
];

const DEADLINES = [
  'Placement',
  'Internship',
  'Certification',
  'Personal learning',
  'Exam preparation'
];

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [careerGoal, setCareerGoal] = useState('Backend Developer');
  const [currentLevel, setCurrentLevel] = useState('Intermediate');
  const [selectedTechs, setSelectedTechs] = useState<string[]>(['Java', 'SQL', 'Git']);
  const [weeklyTimeCommit, setWeeklyTimeCommit] = useState('1 hour/day');
  const [goalDeadline, setGoalDeadline] = useState('Placement');
  const [loading, setLoading] = useState(false);

  const toggleTech = (tech: string) => {
    if (selectedTechs.includes(tech)) {
      setSelectedTechs(selectedTechs.filter(t => t !== tech));
    } else {
      setSelectedTechs([...selectedTechs, tech]);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await client.post('/onboarding', {
        careerGoal,
        currentLevel,
        knownTechs: selectedTechs,
        weeklyTimeCommit,
        goalDeadline
      });
      navigate('/student');
    } catch (e) {
      console.error(e);
      navigate('/student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" /> AI Personalized Setup
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Build Your Career Trajectory</h1>
          <p className="text-slate-400">Step {step} of 5 — SkillForge customizes your curriculum in real-time.</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === i ? 'w-10 bg-indigo-500' : step > i ? 'w-6 bg-emerald-500' : 'w-6 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Wizard Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
          {/* STEP 1: CAREER GOAL */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">What do you want to become?</h2>
                  <p className="text-sm text-slate-400">Select your target career goal to anchor your roadmap.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-2">
                {CAREER_GOALS.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setCareerGoal(goal)}
                    className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                      careerGoal === goal
                        ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-md shadow-indigo-500/10 font-semibold'
                        : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <span>{goal}</span>
                    {careerGoal === goal && <CheckCircle2 className="h-5 w-5 text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: CURRENT LEVEL */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">What is your current experience level?</h2>
                  <p className="text-sm text-slate-400">We will adjust course recommendations and quiz difficulty accordingly.</p>
                </div>
              </div>

              <div className="space-y-4">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setCurrentLevel(lvl.id)}
                    className={`w-full flex items-start justify-between p-5 rounded-xl border text-left transition-all ${
                      currentLevel === lvl.id
                        ? 'border-indigo-500 bg-indigo-500/10 text-white'
                        : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-lg text-white mb-1">{lvl.id}</div>
                      <div className="text-sm text-slate-400">{lvl.desc}</div>
                    </div>
                    {currentLevel === lvl.id && <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0 mt-1" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: TECHNOLOGIES */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                  <Code2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Select technologies you already know</h2>
                  <p className="text-sm text-slate-400">SkillForge marks these as baseline skills in your Skill Gap Graph.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 mb-4">
                {TECHNOLOGIES.map((tech) => {
                  const selected = selectedTechs.includes(tech);
                  return (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleTech(tech)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        selected
                          ? 'border-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                          : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {tech} {selected ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500">Selected {selectedTechs.length} technologies</p>
            </div>
          )}

          {/* STEP 4: TIME COMMITMENT */}
          {step === 4 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">How much time can you spend learning?</h2>
                  <p className="text-sm text-slate-400">SkillForge paces your daily challenges and spaced repetition.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {COMMITMENTS.map((com) => (
                  <button
                    key={com.id}
                    type="button"
                    onClick={() => setWeeklyTimeCommit(com.id)}
                    className={`p-5 rounded-xl border text-left transition-all ${
                      weeklyTimeCommit === com.id
                        ? 'border-indigo-500 bg-indigo-500/10 text-white'
                        : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-lg text-white mb-1">{com.id}</div>
                    <div className="text-xs text-slate-400">{com.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: GOAL DEADLINE */}
          {step === 5 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">What is your target deadline / intent?</h2>
                  <p className="text-sm text-slate-400">Allows SkillForge to highlight interviews and career milestones.</p>
                </div>
              </div>

              <div className="space-y-3">
                {DEADLINES.map((dl) => (
                  <button
                    key={dl}
                    type="button"
                    onClick={() => setGoalDeadline(dl)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                      goalDeadline === dl
                        ? 'border-indigo-500 bg-indigo-500/10 text-white font-medium'
                        : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{dl}</span>
                    {goalDeadline === dl && <CheckCircle2 className="h-5 w-5 text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-500/20"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/30 hover:scale-[1.02]"
              >
                {loading ? 'Synthesizing Roadmap...' : 'Generate My Career Roadmap 🚀'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
