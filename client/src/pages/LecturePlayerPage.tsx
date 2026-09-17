import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Sparkles,
  FileText,
  CheckCircle2,
  HelpCircle,
  Code,
  BookOpen,
  ExternalLink,
  Check,
  Award
} from 'lucide-react';
import Sidebar from '../components/Layout/Sidebar';
import AiTutorPanel from '../components/AiTutorPanel';
import type { Lecture } from '../types';
import { COURSES_CATALOG } from '../data/courseCatalog';
import { getTopicDetail } from '../data/topicContentCatalog';

const MOCK_LECTURES: Lecture[] = [
  { id: 'dsa-l1', courseId: 'course-dsa-masterclass', title: 'Asymptotic Analysis: Big-O, Big-Omega & Space Invariants', description: 'Overview of time complexity and space invariants.', videoUrl: '', duration: 40, order: 1, isCompleted: true },
  { id: 'dsa-l2', courseId: 'course-dsa-masterclass', title: 'Two Pointers & Sliding Window Patterns', description: 'Mastering two pointer and sliding window patterns.', videoUrl: '', duration: 50, order: 2, isCompleted: false },
  { id: 'dsa-l3', courseId: 'course-dsa-masterclass', title: 'Binary Search Edge Cases & Monotonic Predicates', description: 'Binary search boundaries and templates.', videoUrl: '', duration: 45, order: 3, isCompleted: false }
];

const LecturePlayerPage: React.FC = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'summary' | 'resources' | 'practice' | 'quiz'>('summary');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});

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
        isCompleted: Boolean(completedTopics[l.id] || idx === 0)
      }))
    : MOCK_LECTURES;

  const currentIndex = effectiveLectures.findIndex(l => l.id === lectureId);
  const currentLecture = effectiveLectures[currentIndex >= 0 ? currentIndex : 0] || MOCK_LECTURES[0];
  const activeLectureId = currentLecture.id;

  // Retrieve rich matched content for this topic
  const topicDetail = getTopicDetail(
    activeLectureId,
    courseId || 'course-dsa-masterclass',
    currentLecture.title,
    currentLecture.duration
  );

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < effectiveLectures.length - 1;

  const goPrev = () => {
    setIsVideoPlaying(false);
    if (hasPrev) navigate(`/courses/${courseId}/lectures/${effectiveLectures[currentIndex - 1].id}`);
  };

  const goNext = () => {
    setIsVideoPlaying(false);
    if (hasNext) navigate(`/courses/${courseId}/lectures/${effectiveLectures[currentIndex + 1].id}`);
  };

  const toggleTopicCompletion = () => {
    setCompletedTopics(prev => ({
      ...prev,
      [activeLectureId]: !prev[activeLectureId]
    }));
  };

  const isCompleted = completedTopics[activeLectureId] || false;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-950">
      {/* LEFT: Course Navigation Sidebar */}
      <div className="hidden md:block">
        <Sidebar courseId={courseId || 'course-dsa-masterclass'} lectures={effectiveLectures} />
      </div>
      
      {/* CENTER: Video Player, Controls & Tabbed Details */}
      <main className="flex-1 overflow-y-auto border-r border-slate-800">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          
          {/* Video Player */}
          <div className="w-full aspect-video bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6 relative flex items-center justify-center group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40 z-10 pointer-events-none"></div>
            
            {isVideoPlaying ? (
              <iframe
                src={`https://www.youtube.com/embed/${topicDetail.youtubeEmbedId}?autoplay=1&rel=0`}
                title={topicDetail.title}
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
                <span className="text-sm font-semibold text-slate-200">Play Lecture Stream: {topicDetail.title}</span>
                <span className="text-xs text-slate-400">{topicDetail.duration} mins • Full HD Tutorial</span>
              </div>
            )}
          </div>

          {/* Lecture Info & Navigation Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                  Lecture {currentLecture.order} of {effectiveLectures.length}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20">
                  {topicDetail.category}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {topicDetail.title}
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                {topicDetail.description}
              </p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={toggleTopicCompletion}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  isCompleted 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title="Toggle Completion Status"
              >
                {isCompleted ? <Check className="h-4 w-4" /> : null}
                <span>{isCompleted ? 'Completed' : 'Mark as Done'}</span>
              </button>

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
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold text-sm shadow-lg shadow-indigo-500/20"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* TAB BAR: AI Summary, Study Resources, Coding Practice, Adaptive Quiz */}
          <div className="mt-8">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'summary' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="h-4 w-4" /> Topic Overview
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'resources' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="h-4 w-4" /> Study Resources ({topicDetail.resources.length})
              </button>
              <button
                onClick={() => setActiveTab('practice')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'practice' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code className="h-4 w-4" /> Coding Practice ({topicDetail.codingProblems.length})
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'quiz' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="h-4 w-4" /> Diagnostic Quiz
              </button>
            </div>

            {/* TAB CONTENT: TOPIC OVERVIEW & LEARNING OBJECTIVES */}
            {activeTab === 'summary' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> What You Will Learn in This Lecture
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {topicDetail.learningObjectives.map((obj, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                        <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Key Takeaways & Architecture Principles
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {topicDetail.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-indigo-950/30 rounded-xl border border-indigo-500/30 text-xs text-slate-300 space-y-1.5">
                  <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Award className="h-4 w-4" /> Common Interview Question:
                  </div>
                  <div className="font-medium text-white text-sm">
                    "{topicDetail.interviewQuestion.question}"
                  </div>
                  <div className="text-slate-400 pt-1">
                    <strong className="text-indigo-200">Key Evaluation Points:</strong> {topicDetail.interviewQuestion.keyPoints}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: STUDY RESOURCES (Articles, Docs, Curated Videos) */}
            {activeTab === 'resources' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Curated External Study Resources
                  </h3>
                  <span className="text-xs text-slate-400">Direct topic-specific documentation & deep-dives</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {topicDetail.resources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-950 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          res.type === 'video' ? 'bg-red-500/10 text-red-400' :
                          res.type === 'documentation' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {res.type === 'video' ? <Play className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                            {res.title}
                          </div>
                          <div className="text-[11px] text-slate-400 capitalize">
                            {res.type} Resource • Verified External Reference
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: CODING PRACTICE (Redirects directly to DSA Playground) */}
            {activeTab === 'practice' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Hands-on Coding Problems for {topicDetail.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      All coding practice takes place in the unified SkillForge DSA Playground with multi-language execution and AI code review.
                    </p>
                  </div>
                  <Link
                    to={`/playground?category=${encodeURIComponent(topicDetail.category)}`}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    Open Category in Playground →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {topicDetail.codingProblems.map((prob) => (
                    <div
                      key={prob.id}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-white">{prob.title}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {prob.difficulty}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                            {prob.category}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          Solve with Python, JavaScript, Java, or C++ in SkillForge Playground
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {prob.leetcodeUrl && (
                          <a
                            href={prob.leetcodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                            title="Practice on LeetCode"
                          >
                            <span>LeetCode</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        <Link
                          to={`/coding/${prob.slug}`}
                          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
                        >
                          <Code className="h-3.5 w-3.5" />
                          <span>Solve in Playground</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: ADAPTIVE QUIZ */}
            {activeTab === 'quiz' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                  <HelpCircle className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-white">Diagnostic Knowledge Check: {topicDetail.title}</h3>
                <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                  Take the diagnostic quiz for this module to evaluate conceptual mastery, uncover knowledge gaps, and automatically update your Placement Readiness score.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigate(`/quiz/${topicDetail.quizId || 'cs-quiz'}`)}
                    className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/25"
                  >
                    Start Diagnostic Quiz Now →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* RIGHT: AI Tutor Assistant */}
      <aside className="w-full lg:w-96 p-4 bg-slate-950 flex flex-col h-[600px] lg:h-auto">
        <AiTutorPanel
          courseTitle={matchedCourse?.title || "Full-Stack Web Engineering"}
          lectureTitle={topicDetail.title}
        />
      </aside>
    </div>
  );
};

export default LecturePlayerPage;
