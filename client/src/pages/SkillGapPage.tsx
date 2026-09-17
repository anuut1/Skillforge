import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  Layers,
  ShieldCheck,
  Zap,
  BookOpen,
  Code2,
  ExternalLink,
  Award,
  Video,
  Flame,
  Briefcase
} from 'lucide-react';
import client from '../api/client';
import RecommendationFeedbackButton from '../components/common/RecommendationFeedbackButton';
import type { SkillNode } from '../types';

const SkillGapPage: React.FC = () => {
  const [targetRole, setTargetRole] = useState('Software Engineer & Backend Developer');
  const [readinessScore, setReadinessScore] = useState(68);
  const [summary, setSummary] = useState('You are 68% ready for your target engineering role.');
  
  const [categories, setCategories] = useState<Record<string, SkillNode[]>>({
    'Data Structures & Algorithms (DSA)': [
      {
        id: 'dsa-1',
        name: 'Two Pointers & Sliding Window',
        level: 85,
        status: 'STRONG',
        description: 'Optimal array exploration, subarray sums, and boundary shrinking techniques.',
        materials: [
          {
            type: 'STRIVER',
            title: "Striver's TakeUforward: Two Pointers & Sliding Window Playlist",
            link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
            durationOrCount: 'Video & Sheet',
            badgeText: "Striver's DSA"
          },
          {
            type: 'LEETCODE',
            title: 'Solve Two Sum on SkillForge',
            link: '/coding/two-sum',
            leetcodeSlug: 'two-sum',
            durationOrCount: 'Coding Challenge',
            badgeText: 'SkillForge + LeetCode'
          }
        ]
      },
      {
        id: 'dsa-2',
        name: 'Binary Search (Monotonic Predicates)',
        level: 75,
        status: 'STRONG',
        description: 'Upper/lower bound, search in rotated sorted arrays, and min-max answer predicates.',
        materials: [
          {
            type: 'STRIVER',
            title: "Striver's Binary Search Playlist: BS on Answers & Arrays",
            link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
            durationOrCount: 'Video & Patterns',
            badgeText: "Striver's DSA"
          },
          {
            type: 'LEETCODE',
            title: 'Solve Search in Rotated Sorted Array',
            link: '/coding/search-in-rotated-sorted-array',
            leetcodeSlug: 'search-in-rotated-sorted-array',
            durationOrCount: 'Medium Problem',
            badgeText: 'SkillForge + LeetCode'
          }
        ]
      },
      {
        id: 'dsa-3',
        name: 'Trees, BST & DFS/BFS Traversal',
        level: 38,
        status: 'GAP',
        description: 'Recursive tree properties, diameter, lowest common ancestor, and level-order serialization.',
        materials: [
          {
            type: 'STRIVER',
            title: "Striver's Tree Series: Complete Binary Trees & BST A2Z",
            link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
            durationOrCount: 'Striver Playlist',
            badgeText: "Striver's DSA"
          },
          {
            type: 'LEETCODE',
            title: 'Solve Invert / Max Depth of Binary Tree',
            link: '/coding/maximum-depth-of-binary-tree',
            leetcodeSlug: 'maximum-depth-of-binary-tree',
            durationOrCount: 'Essential Pattern',
            badgeText: 'SkillForge + LeetCode'
          }
        ]
      },
      {
        id: 'dsa-4',
        name: 'Graph Theory & Shortest Path (Dijkstra / BFS)',
        level: 30,
        status: 'GAP',
        description: 'Cycle detection, topological sort (Kahn’s), Dijkstra, and Disjoint Set Union (DSU).',
        materials: [
          {
            type: 'STRIVER',
            title: "Striver's Graph Series: BFS, DFS, Dijkstra & DSU Masterclass",
            link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
            durationOrCount: 'Full Series',
            badgeText: "Striver's DSA"
          },
          {
            type: 'LEETCODE',
            title: 'Solve Course Schedule (Topological Sort)',
            link: '/coding/course-schedule',
            leetcodeSlug: 'course-schedule',
            durationOrCount: 'Placement Favorite',
            badgeText: 'SkillForge + LeetCode'
          }
        ]
      }
    ],
    'Databases & SQL Optimization': [
      {
        id: 's5',
        name: 'SQL Joins & Window Aggregations',
        level: 82,
        status: 'STRONG',
        description: 'Complex grouping, HAVING, subqueries, and analytical window functions.',
        materials: [
          {
            type: 'COURSE',
            title: 'Relational Database Design & SQL Optimization Course',
            link: '/courses/course-dbms-sql-optimization',
            durationOrCount: 'SkillForge Interactive'
          },
          {
            type: 'COURSERA',
            title: 'Coursera: Meta Database Engineer Professional Certificate',
            link: 'https://www.coursera.org/professional-certificates/meta-database-engineer',
            durationOrCount: 'Accredited Track',
            badgeText: 'Coursera Enrollment'
          }
        ]
      },
      {
        id: 's7',
        name: 'B-Tree Indexing & Query Execution Plans',
        level: 32,
        status: 'GAP',
        description: 'Clustered vs non-clustered indexes, selectivity, and eliminating sequential scans.',
        materials: [
          {
            type: 'VIDEO',
            title: 'Video Lecture: Deep Dive B-Tree vs Hash vs GiST Index Mechanics',
            link: '/courses/course-dbms-sql-optimization/lectures/db-l2',
            durationOrCount: '55 mins video',
            badgeText: 'Direct Video Match'
          },
          {
            type: 'UDEMY',
            title: 'Udemy: Complete SQL Tuning & Performance Optimization',
            link: 'https://www.udemy.com/topic/sql-performance-tuning/',
            durationOrCount: 'External Course',
            badgeText: 'Udemy Course'
          }
        ]
      },
      {
        id: 's8',
        name: 'Transactions, ACID & Concurrency Control',
        level: 36,
        status: 'GAP',
        description: 'Isolation levels (Read Committed to Serializable), MVCC, and deadlocks.',
        materials: [
          {
            type: 'VIDEO',
            title: 'Video Lecture: ACID Guarantees, MVCC & Deadlocks in High Concurrency',
            link: '/courses/course-dbms-sql-optimization/lectures/db-l4',
            durationOrCount: '45 mins video',
            badgeText: 'Direct Video Match'
          },
          {
            type: 'COURSERA',
            title: 'Coursera: Database Architecture & Distributed Systems (Stanford/Duke)',
            link: 'https://www.coursera.org/search?query=database%20systems',
            durationOrCount: 'Accredited Track',
            badgeText: 'Coursera Enrollment'
          }
        ]
      }
    ],
    'Cloud Architecture & DevOps': [
      {
        id: 'cloud-1',
        name: 'AWS Core Cloud Infrastructure (IAM, VPC, EC2)',
        level: 45,
        status: 'IMPROVING',
        description: 'Virtual private clouds, compute provisioning, security groups, and object storage.',
        materials: [
          {
            type: 'COURSE',
            title: 'AWS Cloud Fundamentals Track',
            link: '/courses/course-aws-fundamentals',
            durationOrCount: '8 hours prep'
          },
          {
            type: 'COURSERA',
            title: 'Coursera: AWS Cloud Practitioner Essentials (Amazon Web Services)',
            link: 'https://www.coursera.org/learn/aws-cloud-practitioner-essentials',
            durationOrCount: 'Official AWS Badge',
            badgeText: 'Coursera Exam Prep'
          }
        ]
      },
      {
        id: 'cloud-2',
        name: 'Docker Containerization & Microservices',
        level: 35,
        status: 'GAP',
        description: 'Multi-stage Dockerfiles, container networking, volumes, and microservices decoupling.',
        materials: [
          {
            type: 'VIDEO',
            title: 'Video Lecture: Writing Production-Grade Multi-Stage Dockerfiles',
            link: '/courses/course-docker-fundamentals/lectures/dk-l2',
            durationOrCount: '45 mins video',
            badgeText: 'Direct Video Match'
          },
          {
            type: 'UDEMY',
            title: 'Udemy: Docker and Kubernetes The Complete Guide by Stephen Grider',
            link: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/',
            durationOrCount: 'Best-Seller',
            badgeText: 'Udemy Certification'
          }
        ]
      }
    ]
  });

  const [recommendations, setRecommendations] = useState([
    {
      topic: 'Striver’s Tree & Graph Pattern Sprints',
      reason: 'Critical gap in hierarchical algorithmic patterns required by Google, Amazon, and top product companies.',
      actionLink: '/coding/course-schedule',
      actionTitle: 'Practice Graph Problem on SkillForge'
    },
    {
      topic: 'Database B-Tree Indexing & Query Tuning',
      reason: 'Frequent bottleneck on senior backend rounds. Master EXPLAIN ANALYZE and compound indexes.',
      actionLink: '/courses/course-dbms-sql-optimization/lectures/db-l2',
      actionTitle: 'Watch Indexing Video Lecture'
    },
    {
      topic: 'AWS Cloud Certification Preparation',
      reason: 'Industry-standard accreditation for cloud backend engineers. Enroll on official Coursera AWS program.',
      actionLink: 'https://www.coursera.org/learn/aws-cloud-practitioner-essentials',
      isExternal: true,
      actionTitle: 'Open Coursera Certification ↗'
    }
  ]);

  useEffect(() => {
    client.get('/skills/gap-analysis')
      .then(res => {
        if (res.data) {
          if (res.data.targetRole) setTargetRole(res.data.targetRole);
          if (res.data.readinessScore !== undefined) setReadinessScore(res.data.readinessScore);
          if (res.data.summary) setSummary(res.data.summary);
          // If server categories have materials, preserve; otherwise default enriched catalog stays active
          if (res.data.categories && Object.keys(res.data.categories).length > 0) {
            const hasServerMaterials = Object.values(res.data.categories).some((arr: any) =>
              Array.isArray(arr) && arr.some(item => item.materials && item.materials.length > 0)
            );
            if (hasServerMaterials) {
              setCategories(res.data.categories);
            }
          }
          if (res.data.recommendations && res.data.recommendations.length > 0) {
            setRecommendations(res.data.recommendations);
          }
        }
      })
      .catch(e => console.error('Error loading gap analysis:', e));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* Header Banner */}
      <div className="bg-slate-900 border-b border-slate-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
                <Sparkles className="h-3.5 w-3.5" /> Skill Gap Matrix & Diagnostic Compass
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                {targetRole} Readiness Analyzer
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                {summary} SkillForge pinpoints precisely what you are lacking, matches exact video lectures to each topic, connects DSA topics with Striver’s TakeUforward roadmaps, and provides Coursera/Udemy links for external certifications.
              </p>
            </div>

            {/* Career Readiness Score Badge */}
            <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl flex items-center gap-5 shrink-0">
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
                <div className="text-xs text-slate-300 mt-1">Based on coding tests & technical gaps</div>
              </div>
            </div>
          </div>

          {/* Educational Disclaimer Banner */}
          <div className="mt-8 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">SkillForge Guidance Policy:</strong> We provide the roadmap, diagnostic tests, in-browser coding runner, and exact resource links. For accredited certifications, we direct you to official programs on <strong>Coursera</strong>, <strong>Udemy</strong>, and <strong>AWS</strong>.
              </div>
            </div>
            <Link
              to="/placement-hub"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 shrink-0"
            >
              Explore Placement Hub <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-slate-800/80 text-xs font-medium">
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Hierarchical Skill Trees */}
        <div className="lg:col-span-2 space-y-8">
          {Object.entries(categories).map(([categoryName, skills]) => (
            <div key={categoryName} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
                  <Layers className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-white">{categoryName}</h2>
              </div>

              <div className="space-y-6">
                {skills.map((skill) => {
                  const isStrong = skill.level >= 70;
                  const isImproving = skill.level >= 40 && skill.level < 70;
                  const isGap = skill.level < 40;

                  return (
                    <div
                      key={skill.id}
                      className={`p-5 rounded-2xl border transition-all ${
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
                          <span className="font-bold text-white text-base">{skill.name}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-300">{skill.level}%</span>
                          <span
                            className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
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
                        <p className="text-xs text-slate-400 ml-0 sm:ml-7 mb-3 leading-relaxed">
                          {skill.description}
                        </p>
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

                      {/* Learning Materials Matching The Topic Directly */}
                      {skill.materials && skill.materials.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-800/80 ml-0 sm:ml-7 space-y-2.5">
                          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                              {isGap ? 'Direct Materials to Close This Critical Gap:' : 'Curated Study & Practice Modules:'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-2.5">
                            {skill.materials.map((mat, mIdx) => {
                              const isExternal = mat.link.startsWith('http');
                              const isStriver = mat.type === 'STRIVER';
                              const isCoursera = mat.type === 'COURSERA';
                              const isUdemy = mat.type === 'UDEMY';

                              return (
                                <div
                                  key={mIdx}
                                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                >
                                  <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 text-indigo-400">
                                      {isStriver ? (
                                        <Flame className="h-4 w-4 text-orange-400" />
                                      ) : isCoursera || isUdemy ? (
                                        <Award className="h-4 w-4 text-amber-400" />
                                      ) : mat.type === 'VIDEO' ? (
                                        <Video className="h-4 w-4 text-sky-400" />
                                      ) : mat.type === 'LEETCODE' || mat.type === 'PRACTICE' ? (
                                        <Code2 className="h-4 w-4 text-emerald-400" />
                                      ) : (
                                        <BookOpen className="h-4 w-4 text-indigo-400" />
                                      )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                        <p className="text-xs font-bold text-slate-200 truncate">
                                          {mat.title}
                                        </p>
                                        {mat.badgeText && (
                                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                            {mat.badgeText}
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-[11px] text-slate-400">
                                        {mat.durationOrCount}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Action Buttons: Dual Link Support (SkillForge vs External / LeetCode) */}
                                  <div className="flex items-center gap-2 shrink-0">
                                    {mat.leetcodeSlug && (
                                      <a
                                        href={`https://leetcode.com/problems/${mat.leetcodeSlug}/`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors"
                                        title="Practice directly on LeetCode"
                                      >
                                        <span>LeetCode</span>
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    )}

                                    {isExternal ? (
                                      <a
                                        href={mat.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-sm"
                                      >
                                        <span>{isCoursera ? 'Coursera ↗' : isUdemy ? 'Udemy ↗' : 'Study Resource ↗'}</span>
                                      </a>
                                    ) : (
                                      <Link
                                        to={mat.link}
                                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-colors border border-slate-700"
                                      >
                                        <span>{mat.type === 'VIDEO' ? 'Watch Lecture' : 'Solve Here'}</span>
                                        <ArrowRight className="h-3 w-3" />
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
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

        {/* Right Col: AI Recommendations & Quick Bridges */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-24">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="p-2.5 bg-sky-500/10 rounded-xl text-sky-400">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Targeted Skill Bridges</h2>
                <p className="text-[11px] text-slate-400">Ranked by hiring impact</p>
              </div>
            </div>

            <div className="space-y-4">
              {recommendations.map((rec, i) => {
                const isExt = (rec as any).isExternal;
                return (
                  <div key={i} className="p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5">
                    <div className="flex items-center justify-between gap-2 text-xs font-bold text-sky-400 mb-1.5">
                      <span>Priority {i + 1} Bridge</span>
                      <RecommendationFeedbackButton
                        recommendationType="TOPIC"
                        itemId={rec.topic}
                        itemTitle={rec.topic}
                        sourcePage="SKILL_GAP"
                        metadata={{ reason: rec.reason }}
                      />
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1.5">{rec.topic}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">{rec.reason}</p>
                    
                    {isExt ? (
                      <a
                        href={(rec as any).actionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        {(rec as any).actionTitle}
                      </a>
                    ) : (
                      <Link
                        to={(rec as any).actionLink || '/catalog'}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        {(rec as any).actionTitle || 'Start module'} <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
              <Link
                to="/interview"
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all"
              >
                <ShieldCheck className="h-4 w-4" /> Test Gaps in AI Mock Interview
              </Link>

              <Link
                to="/placement-hub"
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700"
              >
                <Briefcase className="h-4 w-4 text-amber-400" /> Open Placement Hub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGapPage;
