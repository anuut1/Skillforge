import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, ArrowRight, Layers, ShieldCheck, Zap, BookOpen, FileText, Code2, ExternalLink } from 'lucide-react';
import client from '../api/client';
import RecommendationFeedbackButton from '../components/common/RecommendationFeedbackButton';
import type { SkillNode } from '../types';

const SkillGapPage: React.FC = () => {
  const [targetRole, setTargetRole] = useState('Backend Developer');
  const [readinessScore, setReadinessScore] = useState(67);
  const [summary, setSummary] = useState('You are 67% ready for a Backend Developer role.');
  const [categories, setCategories] = useState<Record<string, SkillNode[]>>({
    'Java & Core Architecture': [
      {
        id: 's1',
        name: 'OOP Principles',
        level: 88,
        status: 'STRONG',
        description: 'Polymorphism, abstraction, encapsulation, and SOLID architecture.',
        bridgeCourseId: 'course-java-programming',
        bridgeCourseTitle: 'Mastering Java & OOP for High-Scale Backends',
        materials: [
          { type: 'CHEATSHEET', title: 'SOLID Principles in Clean Java Design Cheatsheet', link: '/courses/course-java-programming', durationOrCount: '10 min read' },
          { type: 'PRACTICE', title: 'Refactoring Codebase to Strategy Pattern Challenge', link: '/playground', durationOrCount: '3 problems' }
        ]
      },
      {
        id: 's2',
        name: 'Collections Framework',
        level: 82,
        status: 'STRONG',
        description: 'Lists, Sets, Maps, Iterators, and Concurrent Collections.',
        bridgeCourseId: 'course-java-programming',
        bridgeCourseTitle: 'Mastering Java & OOP for High-Scale Backends',
        materials: [
          { type: 'DOC', title: 'HashMap Collision Treeification Internals Guide', link: '/courses/course-java-programming', durationOrCount: '15 min read' }
        ]
      },
      {
        id: 's3',
        name: 'Multithreading & Concurrency',
        level: 58,
        status: 'IMPROVING',
        description: 'Thread pools, volatile, locks, synchronization, and race conditions.',
        bridgeCourseId: 'course-java-programming',
        bridgeCourseTitle: 'Mastering Java & OOP for High-Scale Backends',
        materials: [
          { type: 'COURSE', title: 'Module 4: Concurrency & Virtual Threads in Practice', link: '/courses/course-java-programming/lectures/jv-l4', durationOrCount: '60 mins' },
          { type: 'CHEATSHEET', title: 'Java Concurrency Utilities: CountDownLatch vs CyclicBarrier', link: '/courses/course-java-programming', durationOrCount: '8 min read' },
          { type: 'PRACTICE', title: 'Producer-Consumer Thread Synchronization Exercise', link: '/playground', durationOrCount: '1 coding challenge' }
        ]
      },
      {
        id: 's4',
        name: 'JVM Memory & Garbage Collection',
        level: 50,
        status: 'IMPROVING',
        description: 'Heap, Metaspace, GC algorithms (G1, ZGC), and heap dump analysis.',
        bridgeCourseId: 'course-java-programming',
        bridgeCourseTitle: 'Mastering Java & OOP for High-Scale Backends',
        materials: [
          { type: 'COURSE', title: 'Module 5: JVM Memory Architecture: Heap, Stack & G1 GC', link: '/courses/course-java-programming/lectures/jv-l5', durationOrCount: '55 mins' },
          { type: 'DOC', title: 'Debugging OutOfMemoryError (OOM) via VisualVM & JConsole', link: '/courses/course-java-programming', durationOrCount: '12 min guide' }
        ]
      }
    ],
    'Databases & Storage': [
      {
        id: 's5',
        name: 'SQL Queries & Aggregations',
        level: 85,
        status: 'STRONG',
        description: 'GROUP BY, HAVING, subqueries, and window functions.',
        bridgeCourseId: 'course-dbms-sql-optimization',
        bridgeCourseTitle: 'Relational Database Design & SQL Optimization',
        materials: [
          { type: 'PRACTICE', title: 'Advanced Window Functions (RANK, DENSE_RANK, LEAD, LAG)', link: '/playground', durationOrCount: '4 queries' }
        ]
      },
      {
        id: 's6',
        name: 'Table Joins & Relationships',
        level: 65,
        status: 'IMPROVING',
        description: 'INNER, LEFT, CROSS joins, and foreign key cascading.',
        bridgeCourseId: 'course-dbms-sql-optimization',
        bridgeCourseTitle: 'Relational Database Design & SQL Optimization',
        materials: [
          { type: 'COURSE', title: 'Module 1: Relational Modeling & Normalization: Eliminating Anomalies', link: '/courses/course-dbms-sql-optimization/lectures/db-l1', durationOrCount: '40 mins' }
        ]
      },
      {
        id: 's7',
        name: 'Database Indexing (B-Trees)',
        level: 32,
        status: 'GAP',
        description: 'Clustered vs non-clustered indexes, selectivity, and composite indexes.',
        bridgeCourseId: 'course-dbms-sql-optimization',
        bridgeCourseTitle: 'Relational Database Design & SQL Optimization',
        materials: [
          { type: 'COURSE', title: 'Module 2: Deep Dive: B-Tree vs Hash vs GiST Index Mechanics', link: '/courses/course-dbms-sql-optimization/lectures/db-l2', durationOrCount: '55 mins' },
          { type: 'COURSE', title: 'Module 3: Reading EXPLAIN ANALYZE & Eliminating Sequential Scans', link: '/courses/course-dbms-sql-optimization/lectures/db-l3', durationOrCount: '50 mins' },
          { type: 'CHEATSHEET', title: 'PostgreSQL Compound Index Leftmost Prefix Rules', link: '/courses/course-dbms-sql-optimization', durationOrCount: '5 min read' }
        ]
      },
      {
        id: 's8',
        name: 'Transactions & ACID Guarantees',
        level: 38,
        status: 'GAP',
        description: 'Isolation levels (Read Committed to Serializable), MVCC, and deadlocks.',
        bridgeCourseId: 'course-dbms-sql-optimization',
        bridgeCourseTitle: 'Relational Database Design & SQL Optimization',
        materials: [
          { type: 'COURSE', title: 'Module 4: ACID Guarantees, MVCC & Deadlocks in High Concurrency', link: '/courses/course-dbms-sql-optimization/lectures/db-l4', durationOrCount: '45 mins' },
          { type: 'PRACTICE', title: 'Banking Ledger Transaction Simulation Capstone', link: '/projects', durationOrCount: 'Full Capstone' }
        ]
      }
    ],
    'Backend & Microservices': [
      {
        id: 's9',
        name: 'RESTful API Design',
        level: 78,
        status: 'STRONG',
        description: 'HTTP verbs, URI patterns, error models (RFC 7807), and pagination.',
        bridgeCourseId: 'course-rest-api-design',
        bridgeCourseTitle: 'Production REST API Design & Security',
        materials: [
          { type: 'CHEATSHEET', title: 'RESTful HTTP Status Codes & Idempotency Rules', link: '/courses/course-rest-api-design', durationOrCount: '5 min read' }
        ]
      },
      {
        id: 's10',
        name: 'Authentication & JWT Security',
        level: 35,
        status: 'GAP',
        description: 'Stateless auth, refresh token rotation, OAuth2, and OWASP API security.',
        bridgeCourseId: 'course-rest-api-design',
        bridgeCourseTitle: 'Production REST API Design & Security',
        materials: [
          { type: 'COURSE', title: 'Module 4: OWASP API Top 10: Defending Against BOLA & Token Forgery', link: '/courses/course-rest-api-design/lectures/rest-l4', durationOrCount: '50 mins' },
          { type: 'DOC', title: 'Secure Refresh Token Storage (HttpOnly Cookies vs Memory)', link: '/courses/course-rest-api-design', durationOrCount: '10 min read' }
        ]
      },
      {
        id: 's11',
        name: 'Spring Boot Architecture',
        level: 30,
        status: 'GAP',
        description: 'IoC container, Spring MVC, Spring Data JPA, and actuator monitoring.',
        bridgeCourseId: 'course-spring-boot-microservices',
        bridgeCourseTitle: 'Spring Boot 3 & Microservices Architecture',
        materials: [
          { type: 'COURSE', title: 'Module 1: Spring Core: IoC & Dependency Injection Internals', link: '/courses/course-spring-boot-microservices/lectures/sb-l1', durationOrCount: '40 mins' },
          { type: 'COURSE', title: 'Module 2: Spring Data JPA: Entity Mappings & N+1 Query Fixes', link: '/courses/course-spring-boot-microservices/lectures/sb-l2', durationOrCount: '50 mins' },
          { type: 'PRACTICE', title: 'Build Production Banking REST API Capstone', link: '/projects', durationOrCount: 'Full Project' }
        ]
      },
      {
        id: 's12',
        name: 'Microservices & Message Queues',
        level: 25,
        status: 'GAP',
        description: 'Event-driven architecture, Apache Kafka, RabbitMQ, and circuit breakers.',
        bridgeCourseId: 'course-spring-boot-microservices',
        bridgeCourseTitle: 'Spring Boot 3 & Microservices Architecture',
        materials: [
          { type: 'COURSE', title: 'Module 4: Event-Driven Microservices with Apache Kafka', link: '/courses/course-spring-boot-microservices/lectures/sb-l4', durationOrCount: '60 mins' },
          { type: 'COURSE', title: 'Module 5: API Gateway, Eureka & Resilience4j Circuit Breakers', link: '/courses/course-spring-boot-microservices/lectures/sb-l5', durationOrCount: '55 mins' }
        ]
      }
    ]
  });

  const [recommendations, setRecommendations] = useState([
    {
      topic: 'SQL Indexing & Query Optimization',
      reason: 'Critical gap in database performance required for backend positions.',
      actionLink: '/courses/course-dbms-sql-optimization',
      actionTitle: 'Launch Indexing Course'
    },
    {
      topic: 'REST API Authentication (JWT)',
      reason: 'High-priority missing skill on industry benchmark tests.',
      actionLink: '/courses/course-rest-api-design',
      actionTitle: 'Launch API Security Course'
    },
    {
      topic: 'Spring Boot & Microservices',
      reason: 'High demand in recent job descriptions matching your career goal.',
      actionLink: '/courses/course-spring-boot-microservices',
      actionTitle: 'Launch Microservices Track'
    }
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

                      {/* Learning Materials & Bridge Module for what they are lacking */}
                      {skill.materials && skill.materials.length > 0 && (
                        <div className="mt-3.5 pt-3.5 border-t border-slate-800/80 ml-0 sm:ml-7 space-y-2">
                          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                            {isGap ? 'Materials to Close This Critical Gap:' : 'Curated Study & Practice Materials:'}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {skill.materials.map((mat, mIdx) => (
                              <Link
                                key={mIdx}
                                to={mat.link}
                                className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex items-center justify-between group"
                              >
                                <div className="flex items-center gap-2 min-w-0 pr-2">
                                  {mat.type === 'COURSE' ? (
                                    <BookOpen className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                                  ) : mat.type === 'CHEATSHEET' ? (
                                    <FileText className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                                  ) : mat.type === 'PRACTICE' ? (
                                    <Code2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                  ) : (
                                    <ExternalLink className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                                  )}
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                                      {mat.title}
                                    </p>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      {mat.type} • {mat.durationOrCount}
                                    </span>
                                  </div>
                                </div>
                                <ArrowRight className="h-3 w-3 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
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
                  <div className="flex items-center justify-between gap-2 text-xs font-bold text-sky-400 mb-1">
                    <span>Priority {i + 1}</span>
                    <RecommendationFeedbackButton
                      recommendationType="TOPIC"
                      itemId={rec.topic}
                      itemTitle={rec.topic}
                      sourcePage="SKILL_GAP"
                      metadata={{ reason: rec.reason }}
                    />
                  </div>
                  <h3 className="font-semibold text-white mb-1.5">{rec.topic}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{rec.reason}</p>
                  <Link
                    to={(rec as any).actionLink || '/catalog'}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {(rec as any).actionTitle || 'Start module'} <ArrowRight className="h-3 w-3" />
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
