import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PlayCircle, Clock, Users, BookOpen, Star, ShieldCheck, Award, FileQuestion, ArrowLeft } from 'lucide-react';
import LectureList from '../components/LectureList';
import type { Course, Lecture } from '../types';
import client from '../api/client';

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    client.get(`/courses/${courseId}`)
      .then(res => {
        setCourse(res.data);
        if (res.data.lectures) {
          setLectures(res.data.lectures.map((l: any, idx: number) => ({
            id: l.id,
            courseId: courseId,
            title: l.title,
            description: l.description || `Module lesson covering core concepts and applied exercises in ${l.title}.`,
            duration: l.duration || 20,
            order: idx + 1,
            isCompleted: false
          })));
        }
      })
      .catch(err => {
        console.error('Failed to load course details:', err);
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading comprehensive course syllabus...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Course Not Found</h2>
        <p className="text-slate-400 text-sm mb-4">The course you are looking for does not exist or has been moved.</p>
        <Link to="/catalog" className="px-4 py-2 bg-indigo-600 rounded-xl text-white text-xs font-bold">
          Return to Course Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Top back banner */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/catalog" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Courses Catalog
          </Link>
          <span className="text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full font-bold">
            {course.category}
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-slate-900 border-b border-slate-800 pt-8 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left: Info */}
            <div className="flex-1 order-2 lg:order-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-3 py-1 rounded-full">
                  {course.category}
                </span>
                {course.difficulty && (
                  <span className="text-xs font-bold text-slate-300 bg-slate-800 px-3 py-1 rounded-full">
                    Level: {course.difficulty}
                  </span>
                )}
                {course.isCertificationPrep && (
                  <span className="text-xs font-black text-amber-300 bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-full flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-amber-400" /> Certification Track
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
                {course.title}
              </h1>

              <p className="text-sm md:text-base text-slate-300 mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* Certification Box with clear disclaimer */}
              {course.isCertificationPrep ? (
                <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wide">
                    <ShieldCheck className="h-4 w-4 text-amber-400" /> Target External Certification
                  </div>
                  <div className="text-sm font-bold text-white">
                    {course.targetCertification}
                  </div>
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    <strong>Official Note:</strong> {course.certDisclaimer}
                  </p>
                </div>
              ) : (
                <div className="mb-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                    <Award className="h-4 w-4 text-indigo-400" /> SkillForge Course Completion Certificate
                  </div>
                  <p className="text-xs text-slate-400">
                    Students who pass all lectures and the module mastery quiz receive an authenticated SkillForge completion credential.
                  </p>
                </div>
              )}

              {/* Skills covered */}
              {course.skills && course.skills.length > 0 && (
                <div className="mb-6">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Competencies You'll Build</div>
                  <div className="flex flex-wrap gap-1.5">
                    {course.skills.map((s, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 mb-8">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-white font-bold">{course.rating || 4.9}</span>
                  <span>(3.4k verified reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span>{course.enrolledCount.toLocaleString()} enrolled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Taught by <span className="font-semibold text-indigo-400">{course.instructorName}</span></span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {lectures.length > 0 ? (
                  <button
                    onClick={() => navigate(`/courses/${courseId}/lectures/${lectures[0].id}`)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                  >
                    <PlayCircle className="h-4 w-4" /> Start Learning Course
                  </button>
                ) : (
                  <span className="text-xs text-slate-500">Lectures loading...</span>
                )}
                <Link
                  to={`/courses/${courseId}/quiz/quiz-${courseId}`}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center gap-2"
                >
                  <FileQuestion className="h-4 w-4 text-emerald-400" /> Practice Quiz
                </Link>
              </div>
            </div>

            {/* Right: Video/Image */}
            <div className="lg:w-1/3 order-1 lg:order-2 shrink-0">
              <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl relative group bg-slate-800 aspect-video lg:aspect-[4/3]">
                <img src={course.thumbnail || course.thumbnailUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    onClick={() => lectures.length > 0 && navigate(`/courses/${courseId}/lectures/${lectures[0].id}`)}
                    className="w-16 h-16 bg-slate-900/80 backdrop-blur rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-600 transition-colors border border-slate-700 hover:border-indigo-500 shadow-xl"
                  >
                    <PlayCircle className="h-8 w-8 text-white ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-black text-white mb-4">Course Curriculum & Modules</h2>
          <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              {lectures.length} lessons
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-indigo-400" />
              {course.duration || `${lectures.length * 25} mins`}
            </div>
          </div>
          
          <LectureList courseId={courseId || ''} lectures={lectures} />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
