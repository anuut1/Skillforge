import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, ArrowRight, Layers, ShieldCheck, Zap } from 'lucide-react';
import client from '../api/client';
import type { SkillNode } from '../types';

const SkillGapPage: React.FC = () => {
  const [targetRole, setTargetRole] = useState('Backend Developer');
  const [readinessScore, setReadinessScore] = useState(67);
  const [summary, setSummary] = useState('You are 67% ready for a Backend Developer role.');
  const [categories, setCategories] = useState<Record<string, SkillNode[]>>({
    'Java & Core Architecture': [
      { id: 's1', name: 'OOP Principles', level: 88, status: 'STRONG', description: 'Polymorphism, abstraction, encapsulation' },
      { id: 's2', name: 'Collections Framework', level: 82, status: 'STRONG', description: 'Lists, Sets, Maps, Iterators' },
      { id: 's3', name: 'Multithreading & Concurrency', level: 58, status: 'IMPROVING', description: 'Thread pools, volatile, locks' },
      { id: 's4', name: 'JVM Memory & Garbage Collection', level: 50, status: 'IMPROVING', description: 'Heap, Metaspace, GC algorithms' }
    ],
    'Databases & Storage': [
      { id: 's5', name: 'SQL Queries & Aggregations', level: 85, status: 'STRONG', description: 'GROUP BY, HAVING, subqueries' },
      { id: 's6', name: 'Table Joins & Relationships', level: 65, status: 'IMPROVING', description: 'INNER, LEFT, CROSS joins' },
      { id: 's7', name: 'Database Indexing (B-Trees)', level: 32, status: 'GAP', description: 'Clustered indexes, selectivity' },
      { id: 's8', name: 'Transactions & ACID Guarantees', level: 38, status: 'GAP', description: 'Isolation levels, 2-phase commit' }
    ],
    'Backend & Microservices': [
      { id: 's9', name: 'RESTful API Design', level: 78, status: 'STRONG', description: 'HTTP verbs, URI patterns, error models' },
      { id: 's10', name: 'Authentication & JWT Security', level: 35, status: 'GAP', description: 'Stateless auth, refresh tokens' },
      { id: 's11', name: 'Spring Boot Architecture', level: 30, status: 'GAP', description: 'IoC, Spring MVC, Spring Data JPA' },
      { id: 's12', name: 'Microservices & Message Queues', level: 25, status: 'GAP', description: 'Event-driven, RabbitMQ, Kafka' }
    ]
  });

  const [recommendations, setRecommendations] = useState([
    { topic: 'SQL Indexing & Query Optimization', reason: 'Critical gap in database performance required for backend positions.' },
    { topic: 'REST API Authentication (JWT)', reason: 'High-priority missing skill on industry benchmark tests.' },
    { topic: 'Spring Boot & Microservices', reason: 'High demand in recent job descriptions matching your career goal.' }
  ]);

  useEffect(() => {
    client.get('/skills/gap-analysis')
      .then(res => {
        if (res.data) {
          if (res.data.targetRole) setTargetRole(res.data.targetRole);
          if (res.data.readinessScore !== undefined) setReadinessScore(res.data.readinessScore);
          if (res.data.summary) setSummary(res.data.summary);
          if (res.data.categories && Object.keys(res.data.categories).length > 0) {
            setCategories(res.data.categories);
          }
          if (res.data.recommendations) setRecommendations(res.data.recommendations);
        }
      })
      .catch(e => console.error('Error loading gap analysis:', e));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 border-b border-slate-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
                <Sparkles className="h-3.5 w-3.5" /> Skill Gap Matrix
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {targetRole} Readiness Analyzer
              </h1>
              <p className="text-slate-400 text-lg">
                {summary}
              </p>
            </div>

            {/* Career Readiness Score Badge */}
            <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl flex items-center gap-5">
              <div className="relative flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-indigo-400 transition-all duration-1000 ease-out"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * readinessScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-black text-white">{readinessScore}</span>
                  <span className="text-xs text-slate-400 block -mt-1">%</span>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">Career Readiness</div>
                <div className="text-xl font-bold text-white">{readinessScore} / 100</div>
                <div className="text-xs text-slate-300 mt-1">Based on quizzes, code & projects</div>
              </div>
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-slate-800/80 text-xs font-medium">
            <span className="text-slate-500 font-semibold uppercase">Legend:</span>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> Strong Skill (70%+)
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <span className="w-3 h-3 rounded-full bg-amber-500" /> Improving (40% - 69%)
            </div>
            <div className="flex items-center gap-2 text-red-400">
              <span className="w-3 h-3 rounded-full bg-red-500" /> Critical Skill Gap (&lt;40%)
            </div>
            <div className="flex items-center gap-2 text-sky-400">
              <span className="w-3 h-3 rounded-full bg-sky-500" /> Recommended Action
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Hierarchical Skill Trees */}
        <div className="lg:col-span-2 space-y-8">
          {Object.entries(categories).map(([categoryName, skills]) => (
            <div key={categoryName} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
                  <Layers className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-white">{categoryName}</h2>
              </div>

              <div className="space-y-4">
                {skills.map((skill) => {
                  const isStrong = skill.level >= 70;
                  const isImproving = skill.level >= 40 && skill.level < 70;
                  const isGap = skill.level < 40;

                  return (
                    <div
                      key={skill.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isStrong
                          ? 'border-emerald-500/20 bg-emerald-500/5'
                          : isImproving
                          ? 'border-amber-500/20 bg-amber-500/5'
                          : 'border-red-500/30 bg-red-500/5'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          {isStrong && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
                          {isImproving && <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />}
                          {isGap && <XCircle className="h-5 w-5 text-red-400 shrink-0" />}
                          <span className="font-semibold text-white text-base">{skill.name}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-300">{skill.level}%</span>
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                              isStrong
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : isImproving
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {isStrong ? 'Strong' : isImproving ? 'Improving' : 'Skill Gap'}
                          </span>
                        </div>
                      </div>

                      {skill.description && (
                        <p className="text-xs text-slate-400 ml-7 mb-3">{skill.description}</p>
                      )}

                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden ml-0 sm:ml-7 sm:w-[calc(100%-1.75rem)]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isStrong
                              ? 'bg-emerald-500'
                              : isImproving
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Col: AI Recommendations */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="p-2.5 bg-sky-500/10 rounded-xl text-sky-400">
                <Zap className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Targeted Skill Bridges</h2>
            </div>

            <div className="space-y-4">
              {recommendations.map((rec, i) => (
                <div key={i} className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-400 mb-1">
                    <span>Priority {i + 1}</span>
                  </div>
                  <h3 className="font-semibold text-white mb-1.5">{rec.topic}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{rec.reason}</p>
                  <Link
                    to="/catalog"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Start module <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <Link
                to="/interview"
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all"
              >
                <ShieldCheck className="h-4 w-4" /> Test Gaps in Mock Interview
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGapPage;
