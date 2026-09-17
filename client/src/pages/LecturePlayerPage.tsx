import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Sparkles, FileText, CheckCircle2, HelpCircle, Code } from 'lucide-react';
import Sidebar from '../components/Layout/Sidebar';
import AiTutorPanel from '../components/AiTutorPanel';
import type { Lecture } from '../types';
import { COURSES_CATALOG } from '../data/courseCatalog';

const MOCK_LECTURES: Lecture[] = [
  { id: 'l1', courseId: 'c1', title: 'Introduction to Full-Stack Architecture', description: 'Overview of system layers, client-server lifecycle, and REST contracts.', videoUrl: '', duration: 15, order: 1, isCompleted: true },
  { id: 'l2', courseId: 'c1', title: 'Database Indexing & B-Tree Execution Plans', description: 'Deep dive into clustered indexes, selectivity, and query latency.', videoUrl: '', duration: 25, order: 2, isCompleted: false },
  { id: 'l3', courseId: 'c1', title: 'REST API Authentication with JWT & Refresh Tokens', description: 'Stateless authentication, token rotation, and security headers.', videoUrl: '', duration: 35, order: 3, isCompleted: false },
  { id: 'l4', courseId: 'c1', title: 'Transactions, ACID & Concurrency Control', description: 'Pessimistic vs Optimistic locking, isolation levels, and dirty reads.', videoUrl: '', duration: 40, order: 4, isCompleted: false },
];

const LecturePlayerPage: React.FC = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'summary' | 'notes' | 'quiz' | 'practice'>('summary');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const matchedCourse = COURSES_CATALOG.find(c => c.id === courseId);
  const effectiveLectures: Lecture[] = matchedCourse && matchedCourse.lectures && matchedCourse.lectures.length > 0
    ? matchedCourse.lectures.map((l, idx) => ({
        id: l.id,
        courseId: courseId || 'c1',
        title: l.title,
        description: `Deep-dive lecture module on ${l.title} with applied coding demonstrations and architectural breakdown.`,
        videoUrl: '',
        duration: l.duration,
        order: idx + 1,
        isCompleted: idx === 0
      }))
    : MOCK_LECTURES;

  const currentIndex = effectiveLectures.findIndex(l => l.id === lectureId);
  const lecture = effectiveLectures[currentIndex >= 0 ? currentIndex : 0] || MOCK_LECTURES[0];
  
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < effectiveLectures.length - 1;

  const goPrev = () => {
    if (hasPrev) navigate(`/courses/${courseId}/lectures/${effectiveLectures[currentIndex - 1].id}`);
  };

  const goNext = () => {
    if (hasNext) navigate(`/courses/${courseId}/lectures/${effectiveLectures[currentIndex + 1].id}`);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-950">
      {/* LEFT: Course Navigation Sidebar */}
      <div className="hidden md:block">
        <Sidebar courseId={courseId || 'c1'} lectures={effectiveLectures} />
      </div>
      
      {/* CENTER: Video Player, Controls & Tabbed Details */}
      <main className="flex-1 overflow-y-auto border-r border-slate-800">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          
          {/* Video Player */}
          <div className="w-full aspect-video bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6 relative flex items-center justify-center group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40 z-10 pointer-events-none"></div>
            
            {isVideoPlaying ? (
              <iframe
                src="https://www.youtube.com/embed/aircAruvnKk?autoplay=1"
                title={lecture.title}
                className="w-full h-full border-0 relative z-20"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div 
                onClick={() => setIsVideoPlaying(true)}
                className="flex flex-col items-center gap-3 cursor-pointer z-20 group"
              >
                <div className="w-20 h-20 rounded-full bg-indigo-600/90 group-hover:bg-indigo-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 transition-transform group-hover:scale-110">
                  <Play className="h-8 w-8 text-white ml-1 fill-white" />
                </div>
                <span className="text-sm font-semibold text-slate-200">Click to Play Lecture Stream</span>
                <span className="text-xs text-slate-400">{lecture.duration} mins • High Definition</span>
              </div>
            )}
          </div>

          {/* Lecture Info & Navigation Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                  Module 1 • Lecture {lecture.order}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {lecture.title}
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                {lecture.description}
              </p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={goPrev}
                disabled={!hasPrev}
                className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous Lecture"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={goNext}
                disabled={!hasNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold text-sm shadow-lg shadow-indigo-500/20"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* BOTTOM TABS: AI Summary, Notes, Quiz, Practice */}
          <div className="mt-8">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === 'summary' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="h-4 w-4" /> AI Lecture Summary
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === 'notes' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="h-4 w-4" /> Lecture Notes
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="h-4 w-4" /> Adaptive Quiz
              </button>
              <button
                onClick={() => setActiveTab('practice')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === 'practice' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code className="h-4 w-4" /> Coding Practice
              </button>
            </div>

            {/* TAB CONTENT: AI SUMMARY */}
            {activeTab === 'summary' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" /> Key Takeaways
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Database indexes create supplemental B-Tree data structures that drastically reduce I/O disk page fetches.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Stateless REST design delegates user session context to cryptographically signed JWT payloads.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Always evaluate index write amplification costs before indexing high-frequency write tables.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-300">
                  <div className="font-bold text-indigo-300 mb-1">Common Interview Question:</div>
                  "How does an EXPLAIN ANALYZE query plan differ between an Index Scan and a Sequential Table Scan?"
                </div>
              </div>
            )}

            {/* TAB CONTENT: NOTES */}
            {activeTab === 'notes' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-sm text-slate-300 space-y-3">
                <p><strong>Architecture Notes:</strong></p>
                <p>1. In modern microservice patterns, each service owns its private database schema.</p>
                <p>2. Index selectivity is measured by \`COUNT(DISTINCT column) / COUNT(*)\`. Low selectivity columns (like boolean flags) rarely benefit from traditional B-Trees.</p>
                <p>3. JWT claims should remain lean to reduce HTTP header transport overhead on every incoming request.</p>
              </div>
            )}

            {/* TAB CONTENT: ADAPTIVE QUIZ */}
            {activeTab === 'quiz' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center">
                <HelpCircle className="h-10 w-10 text-indigo-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Test Your Knowledge on {lecture.title}</h3>
                <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
                  Take the adaptive quiz to update your mastery score and bridge weaknesses on your career roadmap.
                </p>
                <button
                  onClick={() => navigate(`/courses/${courseId || 'c1'}/quiz/web-quiz`)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20"
                >
                  Start 5-Question Quiz Now →
                </button>
              </div>
            )}

            {/* TAB CONTENT: PRACTICE */}
            {activeTab === 'practice' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center">
                <Code className="h-10 w-10 text-purple-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Hands-on Coding Challenge</h3>
                <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
                  Implement the core algorithmic patterns taught in this lecture with our integrated interactive playground.
                </p>
                <Link
                  to="/coding/two-sum"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-500/20"
                >
                  Launch Coding Playground →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* RIGHT: AI Tutor Assistant */}
      <aside className="w-full lg:w-96 p-4 bg-slate-950 flex flex-col h-[600px] lg:h-auto">
        <AiTutorPanel
          courseTitle="Full-Stack Web Engineering"
          lectureTitle={lecture.title}
        />
      </aside>
    </div>
  );
};

export default LecturePlayerPage;

