import React, { useState } from 'react';
import { ThumbsDown, Check, X, MessageSquare, AlertCircle } from 'lucide-react';
import client from '../../api/client';
import type { RecommendationFeedbackPayload } from '../../types';

interface Props {
  recommendationType: 'COURSE' | 'PROJECT' | 'QUESTION' | 'RESUME_SKILL' | 'TOPIC';
  itemId: string;
  itemTitle: string;
  sourcePage: string;
  metadata?: any;
  onDismiss?: () => void;
  className?: string;
}

const REASONS = [
  { id: 'not_relevant', label: 'Not relevant to my target role' },
  { id: 'already_know', label: 'I already know this topic' },
  { id: 'too_easy', label: 'Too basic / too easy' },
  { id: 'too_difficult', label: 'Too advanced / out of scope' },
];

export const RecommendationFeedbackButton: React.FC<Props> = ({
  recommendationType,
  itemId,
  itemTitle,
  sourcePage,
  metadata,
  onDismiss,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState('not_relevant');
  const [customComment, setCustomComment] = useState('');

  const handleSubmit = async (reasonOverride?: string) => {
    const reasonToSend = reasonOverride || selectedReason;
    setLoading(true);
    try {
      const payload: RecommendationFeedbackPayload = {
        recommendationType,
        itemId,
        itemTitle,
        sourcePage,
        reason: reasonToSend,
        userComment: customComment.trim() || undefined,
        metadata,
      };

      await client.post('/recommendations/feedback', payload);
      setSubmitted(true);
      setIsOpen(false);

      if (onDismiss) {
        setTimeout(() => {
          onDismiss();
        }, 1200);
      }
    } catch (error) {
      console.warn('Failed to send recommendation feedback:', error);
      // Still give optimistic confirmation to student
      setSubmitted(true);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium ${className}`}>
        <Check className="h-3.5 w-3.5" />
        <span>Feedback noted</span>
      </span>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800 transition-colors"
        title="Flag recommendation as not relevant"
      >
        <ThumbsDown className="h-3 w-3" />
        <span className="hidden sm:inline">Not relevant</span>
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 bottom-full mb-2 z-50 w-72 p-3 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
              <span>Provide Feedback</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            Help SkillForge improve your recommendations for <strong className="text-slate-200">{itemTitle}</strong>:
          </p>

          <div className="space-y-1.5">
            {REASONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setSelectedReason(r.id);
                  handleSubmit(r.id);
                }}
                disabled={loading}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center justify-between"
              >
                <span>{r.label}</span>
                <span className="text-[10px] text-indigo-400">Flag</span>
              </button>
            ))}
          </div>

          <div className="pt-1">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
              <MessageSquare className="h-3 w-3" />
              <span>Optional note</span>
            </div>
            <input
              type="text"
              value={customComment}
              onChange={(e) => setCustomComment(e.target.value)}
              placeholder="Why isn't this relevant?"
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={loading}
            className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      )}
    </div>
  );
};
export default RecommendationFeedbackButton;
