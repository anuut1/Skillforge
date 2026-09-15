import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, CheckCircle, Clock } from 'lucide-react';
import type { Lecture } from '../types';

interface LectureListProps {
  courseId: string;
  lectures: Lecture[];
}

const LectureList: React.FC<LectureListProps> = ({ courseId, lectures }) => {
  return (
    <div className="flex flex-col gap-2">
      {lectures.map((lecture) => (
        <Link
          key={lecture.id}
          to={`/courses/${courseId}/lectures/${lecture.id}`}
          className="flex items-center justify-between p-4 rounded-xl border border-slate-700/50 bg-slate-800/50 hover:bg-slate-800 hover:border-indigo-500/30 transition-all group"
        >
          <div className="flex items-start gap-4">
            <div className="mt-0.5">
              {lecture.isCompleted ? (
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              ) : (
                <PlayCircle className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300" />
              )}
            </div>
            <div>
              <h4 className="text-slate-200 font-medium group-hover:text-white transition-colors">
                {lecture.order}. {lecture.title}
              </h4>
              <p className="text-sm text-slate-500 mt-1">{lecture.description}</p>
            </div>
          </div>
          <div className="flex items-center text-slate-400 text-sm whitespace-nowrap ml-4">
            <Clock className="h-4 w-4 mr-1.5" />
            {lecture.duration} min
          </div>
        </Link>
      ))}
      {lectures.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          No lectures available for this course yet.
        </div>
      )}
    </div>
  );
};

export default LectureList;
