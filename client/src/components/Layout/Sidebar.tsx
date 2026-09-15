import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, CheckCircle, PlayCircle } from 'lucide-react';
import type { Lecture } from '../../types';

interface SidebarProps {
  courseId: string;
  lectures: Lecture[];
}

const Sidebar: React.FC<SidebarProps> = ({ courseId, lectures }) => {
  return (
    <aside className="w-full md:w-80 border-r border-slate-800 bg-slate-900/50 min-h-[calc(100vh-4rem)] flex-shrink-0 flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <h3 className="font-semibold text-slate-200 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-400" />
          Course Content
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
        {lectures.map((lecture) => (
          <NavLink
            key={lecture.id}
            to={`/courses/${courseId}/lectures/${lecture.id}`}
            className={({ isActive }) =>
              `flex items-start gap-3 rounded-lg p-3 transition-colors ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`
            }
          >
            <div className="mt-0.5">
              {lecture.isCompleted ? (
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              ) : (
                <PlayCircle className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1 text-sm">
              <span className="font-medium block leading-tight mb-1">
                {lecture.order}. {lecture.title}
              </span>
              <span className="text-xs opacity-70">{lecture.duration} min</span>
            </div>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
