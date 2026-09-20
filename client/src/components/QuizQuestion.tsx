import React from 'react';
import type { QuizQuestion as QuizQuestionType } from '../types';

interface QuizQuestionProps {
  question: QuizQuestionType;
  index: number;
  selectedValue: number | null;
  onSelect: (value: number) => void;
  showResult?: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  index,
  selectedValue,
  onSelect,
  showResult = false,
}) => {
  const optionsList: string[] = Array.isArray(question.options)
    ? question.options
    : (() => {
        try {
          return JSON.parse(question.options as string);
        } catch {
          return [];
        }
      })();

  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-medium text-slate-100 mb-4">
        {index + 1}. {question.text || question.questionText}
      </h3>
      <div className="flex flex-col gap-3">
        {optionsList.map((option: string, optIdx: number) => {
          const isSelected = selectedValue === optIdx;
          const isCorrect = question.correctOptionIndex === optIdx;
          
          let optionClasses = "flex items-center gap-3 p-4 rounded-lg border transition-all cursor-pointer ";
          
          if (showResult) {
            if (isCorrect) {
              optionClasses += "border-emerald-500/50 bg-emerald-500/10 text-emerald-200";
            } else if (isSelected && !isCorrect) {
              optionClasses += "border-red-500/50 bg-red-500/10 text-red-200";
            } else {
              optionClasses += "border-slate-700/50 bg-slate-800/50 opacity-50";
            }
          } else {
            if (isSelected) {
              optionClasses += "border-indigo-500 bg-indigo-500/10 text-indigo-100";
            } else {
              optionClasses += "border-slate-700/50 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600 text-slate-300";
            }
          }

          return (
            <label key={optIdx} className={optionClasses}>
              <input
                type="radio"
                name={`question-${question.id}`}
                value={optIdx}
                checked={isSelected}
                onChange={() => !showResult && onSelect(optIdx)}
                disabled={showResult}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-600 bg-slate-700"
              />
              <span className="flex-1 font-medium">{option}</span>
              {showResult && isCorrect && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Correct
                </span>
              )}
              {showResult && isSelected && !isCorrect && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  Your Answer
                </span>
              )}
            </label>
          );
        })}
      </div>

      {showResult && question.explanation && (
        <div className="mt-4 p-4 rounded-lg bg-slate-800/80 border border-slate-700 text-sm">
          <div className="flex items-center gap-1.5 font-semibold text-indigo-400 mb-1">
            <span>Explanation:</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
