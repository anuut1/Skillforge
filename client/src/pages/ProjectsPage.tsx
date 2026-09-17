import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Code2 } from 'lucide-react';
import client from '../api/client';
import type { ProjectItem } from '../types';
import { DEFAULT_PROJECTS } from '../data/defaultProjects';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(DEFAULT_PROJECTS[0]);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  useEffect(() => {
    client.get('/projects')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProjects(res.data);
          setSelectedProject(res.data[0]);
        }
      })
      .catch(err => {
        console.warn('Backend /projects offline, defaulting to curated projects:', err);
      });
  }, []);

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !githubUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await client.post('/projects/submit', {
        projectId: selectedProject.id,
        githubUrl,
        liveDemoUrl,
        notes
      });
      setEvaluationResult(res.data.evaluation);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading project portal...
      </div>
    );
  }

  const techs: string[] = (() => {
    try { return JSON.parse(selectedProject.technologies); } catch { return []; }
  })();

  const reqs: string[] = (() => {
    try { return JSON.parse(selectedProject.requirements); } catch { return []; }
  })();

  const milestones: string[] = (() => {
    try { return JSON.parse(selectedProject.milestones); } catch { return []; }
  })();

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Applied Capstone Engineering
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Project-Based Portfolio & AI Evaluation
          </h1>
          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            Build production-grade systems from scratch. Submit your GitHub repository for AI inspection across Code Quality, Feature Completion, Documentation, and Automated Testing.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* PROJECT MATCHING ENGINE BANNER (Section 18) */}
        <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5 shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                AI Project Matching Engine
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                Target Recommendation: Real-Time Collaborative Task Platform
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Matched to close your gap in <strong>Distributed Concurrency & WebSockets</strong> (+4.5% placement readiness).
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 w-fit shrink-0">
            ✓ 100% Curriculum Coverage
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Project Selector & Specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Switcher Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProject(p);
                  setEvaluationResult(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                  selectedProject.id === p.id
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>

          {/* Project Details Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {selectedProject.difficulty}
              </span>
              <span className="text-xs text-slate-400">
                Anchors Skill: <strong className="text-slate-200">{selectedProject.relatedSkillName}</strong>
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">{selectedProject.title}</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">{selectedProject.description}</p>

            {/* Tech Stack Chips */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {techs.map((t, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-slate-800 text-xs font-medium text-indigo-300 border border-slate-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Core Technical Requirements</h3>
              <div className="space-y-2">
                {reqs.map((r, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Development Milestones</h3>
              <div className="space-y-2">
                {milestones.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Submission & AI Evaluation Results */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-indigo-400" /> Submit for Evaluation
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Paste your public GitHub repository. Our automated engine analyzes structure, testing, commits, and code quality.
            </p>

            <form onSubmit={handleSubmitProject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">GitHub Repository URL *</label>
                <input
                  type="url"
                  required
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Live Demo / Deployed URL (Optional)</label>
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  placeholder="https://myproject.up.railway.app"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Implementation Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mention concurrency locks, caching strategies, or test suites implemented..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !githubUrl.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Evaluating Code & Tests...' : 'Submit & Trigger AI Evaluation'}
              </button>
            </form>

            {/* AI EVALUATION REPORT */}
            {evaluationResult && (
              <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-indigo-400">Project Score</span>
                  <span className="text-2xl font-black text-white">{evaluationResult.overallScore} / 100</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Code Quality</span>
                      <span>{evaluationResult.codeQuality}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${evaluationResult.codeQuality}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Feature Completion</span>
                      <span>{evaluationResult.featureScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${evaluationResult.featureScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Documentation</span>
                      <span>{evaluationResult.docsScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${evaluationResult.docsScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Testing Coverage</span>
                      <span>{evaluationResult.testingScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: `${evaluationResult.testingScore}%` }} />
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs space-y-1 text-slate-300">
                  <div className="font-bold text-indigo-300 mb-1">Improvement Suggestions:</div>
                  {evaluationResult.improvementSuggestions.map((s: string, idx: number) => (
                    <div key={idx}>• {s}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
