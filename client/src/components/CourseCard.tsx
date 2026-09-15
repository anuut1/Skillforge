import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Award, ShieldCheck, Clock, Star } from 'lucide-react';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link to={`/courses/${course.id}`} className="group flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden transition-all hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
        <img
          src={course.thumbnail || course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <span className="rounded-lg bg-slate-950/80 backdrop-blur px-2.5 py-1 text-[11px] font-bold text-slate-200 border border-slate-700">
            {course.category}
          </span>
          {course.difficulty && (
            <span className="rounded-lg bg-indigo-950/80 backdrop-blur px-2.5 py-1 text-[11px] font-bold text-indigo-300 border border-indigo-500/30">
              {course.difficulty}
            </span>
          )}
        </div>

        {course.isCertificationPrep && (
          <div className="absolute top-2.5 right-2.5 rounded-lg bg-amber-500/20 backdrop-blur px-2 py-1 text-[10px] font-black text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-md">
            <Award className="h-3 w-3 text-amber-400" />
            <span>CERT PREP</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          {course.duration && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="h-3.5 w-3.5 text-indigo-400" /> {course.duration}
            </span>
          )}
          {course.rating && (
            <span className="flex items-center gap-1 text-[11px] text-amber-400 font-bold ml-auto">
              <Star className="h-3.5 w-3.5 fill-amber-400" /> {course.rating}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-100 line-clamp-2 mb-2 group-hover:text-indigo-400 transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed flex-1">
          {course.description}
        </p>

        {course.targetCertification && (
          <div className="mb-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 flex items-start gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1 font-medium">Prep for: {course.targetCertification}</span>
          </div>
        )}

        {course.skills && course.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {course.skills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-mono">
                {skill}
              </span>
            ))}
            {course.skills.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] text-slate-500 font-mono">
                +{course.skills.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="mt-auto pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-slate-500" />
              {course.enrolledCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-slate-500" />
              {course.lectureCount} lessons
            </span>
          </div>
          <span className="font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">
            View Syllabus →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
