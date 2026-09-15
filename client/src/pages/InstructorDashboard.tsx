import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { Course } from '../types';
import { BookOpen, Users, DollarSign, Plus, Edit, Trash2, Sparkles, ShieldCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const INSTRUCTOR_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Complete Web Development Bootcamp',
    description: 'Learn full-stack web development from scratch with React, Node.js, and MongoDB.',
    instructorId: 'i1',
    instructorName: 'Sarah Drasner',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    enrolledCount: 15420,
    lectureCount: 145,
    price: 89.99
  },
  {
    id: 'c4',
    title: 'Mastering React and Next.js',
    description: 'Build production-ready, server-rendered applications with React and Next.js 14.',
    instructorId: 'i1',
    instructorName: 'Sarah Drasner',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    enrolledCount: 5230,
    lectureCount: 65,
    price: 49.99
  }
];

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState(INSTRUCTOR_COURSES);

  // AI Course Generator Modal
  const [showAiBuilder, setShowAiBuilder] = useState(false);
  const [promptTopic, setPromptTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('Intermediate Engineers');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCurriculum, setGeneratedCurriculum] = useState<any>(null);

  // Course Quality Analyzer Modal
  const [qualityModalCourse, setQualityModalCourse] = useState<Course | null>(null);
  const [qualityReport, setQualityReport] = useState<any>(null);
  const [analyzingQuality, setAnalyzingQuality] = useState(false);

  const handleDelete = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const handleGenerateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptTopic.trim()) return;

    setIsGenerating(true);
    try {
      const res = await client.post('/instructor/ai/generate-course', {
        topic: promptTopic,
        targetAudience
      });
      setGeneratedCurriculum(res.data.curriculum);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenQualityAnalyzer = async (course: Course) => {
    setQualityModalCourse(course);
    setAnalyzingQuality(true);
    setQualityReport(null);

    try {
      const res = await client.get(`/instructor/course-quality/${course.id}`);
      setQualityReport(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingQuality(false);
    }
  };

  const totalStudents = courses.reduce((sum, course) => sum + course.enrolledCount, 0);
  const totalRevenue = courses.reduce((sum, course) => sum + (course.enrolledCount * (course.price || 0)), 0);

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="bg-slate-900 border-b border-slate-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Instructor Studio & AI Authoring
              </h1>
              <p className="text-slate-400">
                Welcome back, {user?.name || 'Instructor'}! Use AI curriculum assistants to generate course syllabi and audit course quality.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAiBuilder(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl transition-all font-semibold text-xs shadow-lg shadow-indigo-500/25"
              >
                <Sparkles className="h-4 w-4" />
                AI Course Generator
              </button>

              <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-colors font-medium text-xs">
                <Plus className="h-4 w-4" />
                New Course
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{courses.length}</div>
                <div className="text-sm text-slate-400">Active Courses</div>
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalStudents.toLocaleString()}</div>
                <div className="text-sm text-slate-400">Total Students</div>
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">${(totalRevenue).toLocaleString()}</div>
                <div className="text-sm text-slate-400">Total Revenue</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Course Management & AI Quality Scores</h2>
        
        {courses.length > 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="text-xs uppercase bg-slate-800/50 text-slate-300 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Course Name</th>
                    <th className="px-6 py-4">Students</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">AI Quality Audit</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={course.thumbnail} alt={course.title} className="w-16 h-10 object-cover rounded" />
                          <div>
                            <div className="font-medium text-slate-200 line-clamp-1">{course.title}</div>
                            <div className="text-xs text-slate-500">{course.lectureCount} lectures</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{course.enrolledCount.toLocaleString()}</td>
                      <td className="px-6 py-4">${course.price}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleOpenQualityAnalyzer(course)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-semibold transition-colors"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" /> Run 5-Pt Audit
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => navigate(`/courses/${course.id}`)}
                            className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(course.id)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
            <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-200 mb-2">No courses yet</h3>
            <p className="text-slate-400 mb-6">Create your first course to start teaching.</p>
          </div>
        )}
      </div>

      {/* AI COURSE GENERATOR MODAL */}
      {showAiBuilder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <h3 className="font-bold text-white text-lg">AI Curriculum Builder</h3>
              </div>
              <button
                onClick={() => {
                  setShowAiBuilder(false);
                  setGeneratedCurriculum(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">What do you want to teach?</label>
                <input
                  type="text"
                  required
                  value={promptTopic}
                  onChange={(e) => setPromptTopic(e.target.value)}
                  placeholder="e.g. Distributed Caching with Redis & Go"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Target Audience Level</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Beginner Programmers">Beginner Programmers</option>
                  <option value="Intermediate Engineers">Intermediate Engineers</option>
                  <option value="Senior Architects">Senior Architects</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGenerating || !promptTopic.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
              >
                {isGenerating ? 'Structuring Comprehensive Curriculum...' : 'Generate Syllabus & Learning Objectives'}
              </button>
            </form>

            {/* AI Generated Curriculum Result */}
            {generatedCurriculum && (
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-base">{generatedCurriculum.courseTitle}</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">
                    Estimated: {generatedCurriculum.estimatedHours} Hours
                  </span>
                </div>

                <div className="space-y-3">
                  {generatedCurriculum.modules?.map((m: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="font-bold text-indigo-300">{m.title}</div>
                      <div className="text-slate-400 space-y-0.5 pl-2">
                        {m.lectures?.map((lec: string, lIdx: number) => (
                          <div key={lIdx}>• {lec}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    alert('Curriculum accepted and saved to draft courses!');
                    setShowAiBuilder(false);
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Save as New Course Draft
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COURSE QUALITY AUDIT MODAL (Section 23) */}
      {qualityModalCourse && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-400" />
                <h3 className="font-bold text-white text-lg">AI Course Quality Audit</h3>
              </div>
              <button onClick={() => setQualityModalCourse(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {analyzingQuality ? (
              <div className="text-center py-8 text-xs text-slate-400">
                Auditing curriculum completeness, video engagement, and quiz coverage...
              </div>
            ) : qualityReport ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-400">Quality Health Rating</span>
                  <span className="text-2xl font-black text-emerald-400">{qualityReport.overallQualityScore} / 100</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Curriculum Structure</span>
                    <strong className="text-emerald-400">{qualityReport.breakdown.curriculumCompleteness}%</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Quiz & Assessment Depth</span>
                    <strong className="text-indigo-400">{qualityReport.breakdown.quizDepth}%</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Practical Coding Integration</span>
                    <strong className="text-amber-400">{qualityReport.breakdown.practicalExerciseRatio}%</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 space-y-1">
                  <div className="font-bold">Optimization Suggestion:</div>
                  <p>{qualityReport.suggestions[0] || 'Add 2 more interactive code challenges to reinforce database transactions.'}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;

