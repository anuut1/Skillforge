import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CheckCircle2, PlayCircle, Search, Clock, Compass } from 'lucide-react';
import type { Lecture } from '../../types';

interface SidebarProps {
  courseId: string;
  courseTitle?: string;
  lectures: Lecture[];
  onSelectLecture?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ courseId, courseTitle, lectures, onSelectLecture }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const completedCount = lectures.filter(l => l.isCompleted).length;
  const progressPercent = lectures.length > 0 ? Math.round((completedCount / lectures.length) * 100) : 0;

  const filteredLectures = searchTerm.trim()
    ? lectures.filter(l => l.title.toLowerCase().includes(searchTerm.toLowerCase().trim()))
    : lectures;

  return (
    <aside className="w-full md:w-80 lg:w-88 border-r border-slate-800 bg-slate-950/95 backdrop-blur-md min-h-[calc(100vh-4rem)] flex-shrink-0 flex flex-col">
      {/* Header & Course Progress */}
      <div className="p-4 border-b border-slate-800/80 space-y-3 bg-slate-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Compass className="h-4 w-4" />
            </div>
            <span>Course Syllabus</span>
          </div>
          <span className="text-[11px] font-mono text-indigo-400 font-bold px-2 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-500/30">
            {completedCount}/{lectures.length} Done
          </span>
        </div>

        {courseTitle && (
          <h4 className="text-xs font-semibold text-slate-300 truncate" title={courseTitle}>
            {courseTitle}
          </h4>
        )}

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>Overall Progress</span>
            <span className="font-mono text-slate-200">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Search / Filter Lectures */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search lectures & topics..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2 pointer-events-none" />
        </div>
      </div>

      {/* Lectures List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1 custom-scrollbar">
        {filteredLectures.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No lectures found matching "{searchTerm}"
          </div>
        ) : (
          filteredLectures.map((lecture) => (
            <NavLink
              key={lecture.id}
              to={`/courses/${courseId}/lectures/${lecture.id}`}
              onClick={onSelectLecture}
              className={({ isActive }) =>
                `flex items-start gap-3 rounded-xl p-3 transition-all group border ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                    : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="mt-0.5 shrink-0">
                    {lecture.isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 fill-emerald-400/20" />
                    ) : isActive ? (
                      <div className="h-4 w-4 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold animate-pulse">
                        ▶
                      </div>
                    ) : (
                      <PlayCircle className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${
                        isActive ? 'text-indigo-400' : 'text-slate-500'
                      }`}>
                        Lesson {lecture.order}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono shrink-0">
                        <Clock className="h-2.5 w-2.5" />
                        {lecture.duration}m
                      </span>
                    </div>
                    <span className={`font-medium text-xs leading-snug block line-clamp-2 ${
                      isActive ? 'text-white font-semibold' : 'text-slate-300 group-hover:text-white'
                    }`}>
                      {lecture.title}
                    </span>
                  </div>
                </>
              )}
            </NavLink>
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
