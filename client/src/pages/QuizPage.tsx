import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award } from 'lucide-react';
import QuizQuestion from '../components/QuizQuestion';
import type { Quiz } from '../types';

const MOCK_QUIZ: Quiz = {
  id: 'q1',
  courseId: 'c1',
  title: 'React Fundamentals Quiz',
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
      text: 'What does JSX stand for?',
      options: ['JavaScript XML', 'Java Syntax Extension', 'JSON X', 'JavaScript eXecution'],
      correctOptionIndex: 0,
    }
  ]
};

const QuizPage: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    let currentScore = 0;
    MOCK_QUIZ.questions.forEach(q => {
      if (answers[q.id] === q.correctOptionIndex) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setIsSubmitted(true);
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount = MOCK_QUIZ.questions.length;
  const progress = (answeredCount / totalCount) * 100;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">{MOCK_QUIZ.title}</h1>
          
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
            <p className="text-slate-400 mb-6">You scored {score} out of {totalCount}</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => navigate(`/courses/${courseId}`)}
                className="px-6 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors font-medium border border-slate-700"
              >
                Back to Course
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {MOCK_QUIZ.questions.map((question, index) => (
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
