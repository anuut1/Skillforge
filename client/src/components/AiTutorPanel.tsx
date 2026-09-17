import React, { useState } from 'react';
import { Send, Bot, Sparkles, User as UserIcon, RefreshCw, HelpCircle, Code, Lightbulb, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import client from '../api/client';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  suggestions?: string[];
}

interface AiTutorPanelProps {
  courseTitle: string;
  lectureTitle: string;
  compact?: boolean;
}

const QUICK_ACTIONS = [
  { label: 'Explain Simply', action: 'explain_simply', icon: Lightbulb },
  { label: 'Give Example', action: 'give_example', icon: FileText },
  { label: 'Test Me', action: 'test_me', icon: HelpCircle },
  { label: 'Summarize', action: 'summarize', icon: Sparkles },
  { label: 'Explain Code', action: 'explain_code', icon: Code }
];

const AiTutorPanel: React.FC<AiTutorPanelProps> = ({ courseTitle, lectureTitle, compact = false }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `👋 Hi! I'm your **SkillForge AI Tutor** for **${lectureTitle}**.\n\nAsk me anything or pick a quick prompt below!`,
      suggestions: ['Explain Simply', 'Give Example']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!compact);

  const sendMessage = async (textToSend?: string, actionType?: string) => {
    const text = textToSend || input;
    if (!text.trim() && !actionType) return;

    const userMsg: Message = { sender: 'user', text: text || `[${actionType}]` };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await client.post('/ai/tutor', {
        message: text,
        courseTitle,
        lectureTitle,
        action: actionType
      });

      const aiMsg: Message = {
        sender: 'ai',
        text: res.data.reply,
        suggestions: res.data.followUpSuggestions
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `In **${lectureTitle}**, understanding this foundational topic directly boosts your career roadmap score! Feel free to ask another question.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all ${compact ? 'h-full' : 'h-full'}`}>
      {/* Panel Header */}
      <div 
        onClick={() => compact && setIsExpanded(!isExpanded)}
        className={`px-3.5 py-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between ${compact ? 'cursor-pointer hover:bg-slate-900 transition-colors' : ''}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shrink-0 shadow-md shadow-indigo-500/20">
            <Bot className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-xs sm:text-sm truncate">AI Career & Tutor</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            </div>
            <div className="text-[11px] text-slate-400 truncate">Concept Copilot</div>
          </div>
        </div>

        {compact && (
          <button
            type="button"
            className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
            title={isExpanded ? 'Collapse panel' : 'Expand panel'}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* When expanded or not in compact mode */}
      {isExpanded && (
        <>
          {/* Quick Action Chips */}
          <div className="px-3 py-2 bg-slate-900 border-b border-slate-800/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_ACTIONS.map((qa) => {
              const Icon = qa.icon;
              return (
                <button
                  key={qa.action}
                  onClick={(e) => {
                    e.stopPropagation();
                    sendMessage(qa.label, qa.action);
                  }}
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800/90 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/20 whitespace-nowrap transition-colors"
                >
                  <Icon className="h-3 w-3" />
                  {qa.label}
                </button>
              );
            })}
          </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-sm ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-bl-none shadow-md'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed">{m.text}</div>

              {m.suggestions && m.suggestions.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-wrap gap-1.5">
                  {m.suggestions.map((s, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors text-left"
                    >
                      {s} →
                    </button>
                  ))}
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300">
                <UserIcon className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 w-fit">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            AI Tutor is thinking...
          </div>
        )}
      </div>

          {/* Input Box */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI Tutor..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors shadow-md shadow-indigo-500/20"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AiTutorPanel;
