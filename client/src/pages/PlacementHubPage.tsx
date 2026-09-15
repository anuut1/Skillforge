import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Code, Cpu, Brain, ArrowRight, CheckCircle2 } from 'lucide-react';

const PLACEMENT_SECTIONS = [
  {
    id: 'dsa',
    title: 'DSA Interview Sprint',
    icon: Code,
    desc: 'Master the top 75 high-frequency LeetCode interview patterns across Two Pointers, Trees, Graphs, and DP.',
    topics: ['Sliding Window & Pointers', 'Graph BFS/DFS & Dijkstra', 'Dynamic Programming Tabulation', 'Trie & Segment Trees'],
    link: '/coding/two-sum',
    cta: 'Practice LeetCode Patterns'
  },
  {
    id: 'cs-core',
    title: 'CS Core Fundamentals',
    icon: Cpu,
    desc: 'Crack technical questions across DBMS, Operating Systems, Computer Networks, and Low-Level Architecture.',
    topics: ['OS: Virtual Memory & Page Tables', 'DBMS: Indexing, ACID & Transactions', 'Networks: OSI, TCP Handshake & TLS', 'OOP & SOLID Clean Design'],
    link: '/courses/c1/quiz/cs-quiz',
    cta: 'Take Diagnostics Assessment'
  },
  {
    id: 'system-design',
    title: 'System Design & Scalability',
    icon: Brain,
    desc: 'Prepare for High-Level (HLD) and Low-Level (LLD) architectural interviews for Tier-1 engineering jobs.',
    topics: ['Load Balancers & Reverse Proxies', 'Consistent Hashing & Partitioning', 'Message Queues (Kafka/RabbitMQ)', 'Database Sharding & Caching (Redis)'],
    link: '/interview',
    cta: 'Simulate Architecture Interview'
  },
  {
    id: 'aptitude',
    title: 'Aptitude & Reasoning Hub',
    icon: Briefcase,
    desc: 'Prepare for quantitative, logical reasoning, and verbal aptitude rounds utilized by top tech companies.',
    topics: ['Quantitative Mathematics', 'Logical Deduction & Puzzles', 'Verbal Communication', 'Data Interpretation'],
    link: '/catalog',
    cta: 'Browse Aptitude Tracks'
  }
];

const PlacementHubPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="bg-slate-900 border-b border-slate-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
            <Briefcase className="h-3.5 w-3.5" /> Career Readiness Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            SkillForge Placement Hub
          </h1>
          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            Everything required to secure Tier-1 tech placements: DSA pattern recognition, CS fundamental deep-dives, System Design, and automated AI Mock Interviews.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PLACEMENT_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 hover:border-indigo-500/40 transition-all shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h2 className="text-xl font-bold text-white mb-2">{sec.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{sec.desc}</p>

                  <div className="space-y-2 mb-8">
                    {sec.topics.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={sec.link}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/80 hover:bg-indigo-600 text-white text-xs font-bold transition-all group"
                >
                  <span>{sec.cta}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlacementHubPage;
