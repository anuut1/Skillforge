import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award } from 'lucide-react';
import QuizQuestion from '../components/QuizQuestion';
import type { Quiz } from '../types';
import client from '../api/client';

import { ALL_QUIZZES } from '../data/quizzesCatalog';

const DEFAULT_QUIZ: Quiz = {
  id: 'general-quiz',
  courseId: 'c1',
  title: 'Technical Fundamentals Quiz',
  questions: [
    {
      id: 'qq1',
      text: 'What is the hook used to manage state in a functional component?',
      options: ['useEffect', 'useState', 'useContext', 'useReducer'],
      correctOptionIndex: 1,
    },
    {
      id: 'qq2',
      text: 'Which of the following is NOT a rule of React Hooks?',
      options: [
        'Hooks can only be called inside React function components',
        'Hooks can only be called at the top level',
        'Hooks can be called inside loops and conditions',
        'Custom hooks must start with "use"'
      ],
      correctOptionIndex: 2,
    },
    {
      id: 'qq3',
      text: 'What is the primary benefit of B-Tree indexing in relational databases?',
      options: ['Logarithmic search and ordered range scan', 'Eliminates storage need', 'Ensures 100% memory caching', 'Replaces foreign keys'],
      correctOptionIndex: 0,
    }
  ]
};

const QuizPage: React.FC = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();

  const activeQuiz: Quiz = (quizId && ALL_QUIZZES[quizId])
    || (courseId && ALL_QUIZZES[`quiz-${courseId}`])
    || (quizId && ALL_QUIZZES[quizId.replace(/^quiz-/, '')])
    || (quizId === 'cs-quiz' ? ALL_QUIZZES['cs-quiz'] : null)
    || DEFAULT_QUIZ;

  
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    let currentScore = 0;
    activeQuiz.questions.forEach(q => {
      if (answers[q.id] === q.correctOptionIndex) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setIsSubmitted(true);

    const assessmentResult = {
      assessmentId: `asmt_${Date.now()}`,
      quizId: activeQuiz.id,
      title: activeQuiz.title,
      score: currentScore,
      totalQuestions: totalCount,
      percentage: Math.round((currentScore / totalCount) * 100),
      correct: currentScore,
      incorrect: totalCount - currentScore,
      submittedAt: new Date().toISOString(),
      answers
    };

    try {
      const historyStr = localStorage.getItem('skillforge_assessment_history');
      const prevHistory = historyStr ? JSON.parse(historyStr) : [];
      localStorage.setItem('skillforge_assessment_history', JSON.stringify([assessmentResult, ...prevHistory]));
      // Also update completed map
      const completedMapStr = localStorage.getItem('skillforge_completed_quizzes');
      const completedMap = completedMapStr ? JSON.parse(completedMapStr) : {};
      completedMap[activeQuiz.id] = {
        score: currentScore,
        total: totalCount,
        percentage: Math.round((currentScore / totalCount) * 100),
        date: new Date().toISOString()
      };
      localStorage.setItem('skillforge_completed_quizzes', JSON.stringify(completedMap));
    } catch (e) {
      console.error('Failed saving assessment result to local storage', e);
    }

    // Attempt backend sync
    client.post('/quiz/submit', assessmentResult).catch(() => {});
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount = activeQuiz.questions.length;
  const progress = (answeredCount / totalCount) * 100;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">{activeQuiz.title}</h1>
          
          {/* Progress Bar */}
          {!isSubmitted && (
            <div className="w-full bg-slate-800 rounded-full h-2.5 mb-2 border border-slate-700">
              <div 
                className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          {!isSubmitted && (
            <p className="text-sm text-slate-400 text-right">{answeredCount} of {totalCount} answered</p>
          )}
        </div>

        {isSubmitted && (
          <div className="mb-8 bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center shadow-xl">
            <Award className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Quiz Completed!</h2>
            <div className="flex justify-center items-center gap-6 my-6">
              <div className="text-center px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-2xl font-black text-indigo-400">{score}/{totalCount}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Score</div>
              </div>
              <div className="text-center px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-2xl font-black text-emerald-400">{Math.round((score / totalCount) * 100)}%</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Percentage</div>
              </div>
              <div className="text-center px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-2xl font-black text-emerald-400">{score}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Correct</div>
              </div>
              <div className="text-center px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-2xl font-black text-red-400">{totalCount - score}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Incorrect</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              Detailed explanations and question solutions are shown below for each question.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => {
                  setAnswers({});
                  setIsSubmitted(false);
                  setScore(0);
                }}
                className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors font-semibold text-sm shadow-md"
              >
                Retake Assessment
              </button>
              <button 
                onClick={() => navigate(courseId ? `/courses/${courseId}` : '/placement-hub')}
                className="px-6 py-2.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors font-medium border border-slate-700 text-sm"
              >
                {courseId ? 'Back to Course' : 'Back to Placement Hub'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {activeQuiz.questions.map((question, index) => (
            <QuizQuestion
              key={question.id}
              index={index}
              question={question}
              selectedValue={answers[question.id] ?? null}
              onSelect={(val) => handleSelect(question.id, val)}
              showResult={isSubmitted}
            />
          ))}
        </div>

        {!isSubmitted && (
          <div className="mt-8 flex justify-end border-t border-slate-800 pt-6">
            <button
              onClick={handleSubmit}
              disabled={answeredCount < totalCount}
              className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
            >
              Submit Answers
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default QuizPage;
