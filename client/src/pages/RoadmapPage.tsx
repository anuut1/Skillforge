import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, Lock, ArrowRight, BookOpen, Clock, Target, AlertCircle } from 'lucide-react';
import client from '../api/client';
import RecommendationFeedbackButton from '../components/common/RecommendationFeedbackButton';
import type { RoadmapMilestone } from '../types';

const RoadmapPage: React.FC = () => {
  const [careerGoal, setCareerGoal] = useState('Backend Developer');
  const [estimatedWeeks, setEstimatedWeeks] = useState(6);
  const [recommendedNextTopic, setRecommendedNextTopic] = useState('SQL Indexing & B-Trees');
  const [whyRecommended, setWhyRecommended] = useState('Weakness detected in index execution plans.');
  const [roadmap, setRoadmap] = useState<RoadmapMilestone[]>([
    {
      name: 'JAVA & OOP',
      progress: 82,
      status: 'MASTERED',
      time: 'Completed',
      weakAreas: [],
      completedTopics: ['Classes, Objects & Inheritance', 'Interface Segregation & Polymorphism', 'Java Collections (ArrayList, HashMap)', 'Exception Handling Hierarchies'],
      remainingTopics: ['Virtual Threads (Project Loom)', 'JVM Flight Recorder Profiling'],
      recommendedAction: 'Practice JVM Garbage Collection Tuning in Mock Interview',
      actionLink: '/interview'
    },
    {
      name: 'DATA STRUCTURES & ALGORITHMS',
      progress: 61,
      status: 'IN_PROGRESS',
      time: '14 hrs remaining',
      weakAreas: ['Trees', 'Graphs'],
      completedTopics: ['Two Pointers & Sliding Window', 'Binary Search Boundary Checks', 'Linked List Reversals', 'Stack & Monotonic Queue'],
      remainingTopics: ['Binary Tree DFS/BFS Traversal', 'Graph Topological Sort & Dijkstra', 'Dynamic Programming Tabulation'],
      recommendedAction: 'Solve LeetCode Trees & Graphs Pattern Questions',
      actionLink: '/playground'
    },
    {
      name: 'DATABASES & SQL',
      progress: 70,
      status: 'IN_PROGRESS',
      time: '8 hrs remaining',
      weakAreas: ['Indexing', 'Transactions'],
      completedTopics: ['Complex Joins & Aggregations', 'Group By & Window Functions', 'Foreign Key & Normalization (3NF)'],
      remainingTopics: ['B-Tree Indexing Execution Plans', 'ACID Isolation Levels & MVCC', 'Distributed Sharding'],
      recommendedAction: 'Study Relational Database Design & SQL Optimization Course',
      actionLink: '/courses/course-dbms-sql-optimization'
    },
    {
      name: 'OPERATING SYSTEMS',
      progress: 48,
      status: 'IN_PROGRESS',
      time: '12 hrs remaining',
      weakAreas: ['Virtual Memory', 'Deadlocks'],
      completedTopics: ['Process vs Thread Lifecycles', 'CPU Scheduling Algorithms'],
      remainingTopics: ['Page Tables & Translation Lookaside Buffer', 'Deadlock Detection & Bankers Algorithm', 'Linux Syscalls & File Descriptors'],
      recommendedAction: 'Take OS Virtual Memory & Paging Diagnostics Assessment',
      actionLink: '/courses/course-os-concurrency'
    },
    {
      name: 'COMPUTER NETWORKS',
      progress: 40,
      status: 'NEEDS_FOCUS',
      time: '10 hrs remaining',
      weakAreas: ['TCP/IP', 'HTTP/3'],
      completedTopics: ['OSI 7 Layer Encapsulation', 'DNS Lookup Hierarchy'],
      remainingTopics: ['TCP 3-Way Handshake & Congestion Control', 'TLS 1.3 Cryptographic Handshake', 'HTTP/2 vs HTTP/3 QUIC Multiplexing'],
      recommendedAction: 'Review Computer Networks & TCP/IP Protocol Suite',
      actionLink: '/courses/course-computer-networks'
    },
    {
      name: 'SYSTEM DESIGN & DISTRIBUTED SYSTEMS',
      progress: 20,
      status: 'LOCKED',
      time: '20 hrs remaining',
      weakAreas: ['Caching', 'Load Balancing'],
      completedTopics: ['Monolith vs Microservices Trade-offs'],
      remainingTopics: ['Distributed Caching (Redis/Memcached)', 'Consistent Hashing & Partitioning', 'CAP Theorem & Quorum Consensus', 'Rate Limiting & Circuit Breakers'],
      recommendedAction: 'Simulate Architecture Interview on High-Throughput Systems',
      actionLink: '/courses/course-system-design-interview'
    }
  ]);

  useEffect(() => {
    client.get('/roadmap')
      .then(res => {
        if (res.data) {
          setCareerGoal(res.data.careerGoal || 'Backend Developer');
          setEstimatedWeeks(res.data.estimatedWeeksRemaining || 6);
          setRecommendedNextTopic(res.data.recommendedNextTopic || 'SQL Indexing & B-Trees');
          setWhyRecommended(res.data.whyRecommended || 'Quiz weakness detected.');
          if (res.data.roadmap) setRoadmap(res.data.roadmap);
        }
      })
      .catch(err => console.error('Error fetching roadmap:', err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
                <Sparkles className="h-3.5 w-3.5" /> AI Dynamic Roadmap
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {careerGoal} Trajectory
              </h1>
              <p className="text-slate-400">
                Paced automatically based on your quiz accuracy, code submissions, and projects.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
              <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">~{estimatedWeeks} Weeks</div>
                <div className="text-xs text-slate-400">Estimated Completion Time</div>
              </div>
            </div>
          </div>

          {/* Action Recommendation Card */}
          <div className="mt-8 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 rounded-xl mt-1">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">Recommended Next Topic</div>
                <h3 className="text-xl font-bold text-white mb-1">{recommendedNextTopic}</h3>
                <p className="text-sm text-slate-300">💡 {whyRecommended}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <RecommendationFeedbackButton
                recommendationType="TOPIC"
                itemId={recommendedNextTopic}
                itemTitle={recommendedNextTopic}
                sourcePage="ROADMAP"
                metadata={{ whyRecommended }}
              />
              <Link
                to="/catalog"
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
              >
                Learn Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap List */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 max-w-4xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-400" /> Milestone Progression
        </h2>

        <div className="space-y-6">
          {roadmap.map((m, idx) => {
            const isMastered = m.status === 'MASTERED' || m.progress >= 80;
            const isLocked = m.status === 'LOCKED';
            const isFocus = m.status === 'NEEDS_FOCUS' || m.progress < 50;

            return (
              <div
                key={m.name}
                className={`bg-slate-900 border rounded-2xl p-6 transition-all shadow-lg ${
                  isLocked
                    ? 'border-slate-800 opacity-60'
                    : isMastered
                    ? 'border-emerald-500/30 hover:border-emerald-500/60'
                    : isFocus
                    ? 'border-amber-500/40 hover:border-amber-500/70'
                    : 'border-slate-800 hover:border-indigo-500/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700">
                      {idx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-white">{m.name}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-400">{m.time}</span>
                    {isLocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                        <Lock className="h-3 w-3" /> Locked
                      </span>
                    ) : isMastered ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" /> Mastered
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isFocus
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {m.progress}% Completed
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-800/80 my-3">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isMastered
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : isFocus
                        ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                    }`}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>

                {/* What You Have Mastered vs What Is Left breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs">
                  {/* COMPLETED / DONE */}
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Completed & Verified ({m.completedTopics?.length || 0})
                    </div>
                    {m.completedTopics && m.completedTopics.length > 0 ? (
                      <ul className="space-y-1 text-slate-300">
                        {m.completedTopics.map((item, cIdx) => (
                          <li key={cIdx} className="flex items-center gap-1.5 text-[11px]">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                            <span className="line-through text-slate-400">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[11px] text-slate-500 italic">No topics marked as mastered yet.</p>
                    )}
                  </div>

                  {/* LEFT / REMAINING */}
                  <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                      <Clock className="h-3.5 w-3.5 text-indigo-400" /> What Is Left to Complete ({m.remainingTopics?.length || 0})
                    </div>
                    {m.remainingTopics && m.remainingTopics.length > 0 ? (
                      <ul className="space-y-1 text-slate-300">
                        {m.remainingTopics.map((item, rIdx) => (
                          <li key={rIdx} className="flex items-center gap-1.5 text-[11px]">
                            <span className="w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[11px] text-emerald-400 font-semibold">✓ All milestone topics completed!</p>
                    )}
                  </div>
                </div>

                {/* Recommended Next Action for this Milestone */}
                {m.recommendedAction && !isLocked && (
                  <div className="mt-3.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-amber-400 font-bold">🎯 Next Step:</span>
                      <span className="text-slate-200">{m.recommendedAction}</span>
                    </div>
                    {m.actionLink && (
                      <Link
                        to={m.actionLink}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors shrink-0"
                      >
                        Start Step <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                )}

                {/* Weak Areas tags */}
                {m.weakAreas && m.weakAreas.length > 0 && (
                  <div className="flex items-center gap-2 mt-3 text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-400" /> Focus areas:
                    </span>
                    {m.weakAreas.map((w) => (
                      <span key={w} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {w}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
