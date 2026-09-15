import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swords, Trophy, Flame, Zap, Users, CheckCircle2 } from 'lucide-react';
import client from '../api/client';
import type { DailyChallengeData } from '../types';

const ArenaPage: React.FC = () => {
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallengeData | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [, setStudyRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [roomMessage, setRoomMessage] = useState('');

  // Daily challenge quiz selection
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    client.get('/daily-challenge')
      .then(res => setDailyChallenge(res.data))
      .catch(err => console.error(err));

    client.get('/arena/leaderboard')
      .then(res => setLeaderboard(res.data.leaderboard || []))
      .catch(err => console.error(err));

    client.get('/study-rooms')
      .then(res => {
        setStudyRooms(res.data || []);
        if (res.data?.length > 0) setSelectedRoom(res.data[0]);
      })
      .catch(err => console.error(err));
  }, []);

  const handlePostRoomMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !roomMessage.trim()) return;

    try {
      const res = await client.post('/study-rooms/message', {
        roomId: selectedRoom.id,
        content: roomMessage
      });

      setSelectedRoom({
        ...selectedRoom,
        messages: [res.data, ...(selectedRoom.messages || [])]
      });
      setRoomMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  const quizOptions: string[] = (() => {
    if (!dailyChallenge?.quizOptions) return [];
    try {
      return JSON.parse(dailyChallenge.quizOptions);
    } catch {
      return [];
    }
  })();

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="bg-slate-900 border-b border-slate-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
            <Swords className="h-3.5 w-3.5" /> Competitive & Collaborative Learning
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            SkillForge Arena & Daily Challenges
          </h1>
          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            Compete, practice daily high-yield questions, join collaborative study rooms, and earn XP and consistency streak badges.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT 2 COLS: Daily Challenge & Study Rooms */}
        <div className="lg:col-span-2 space-y-8">
          {/* DAILY CHALLENGE CARD */}
          {dailyChallenge && (
            <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Today's Daily Challenge</h2>
                    <span className="text-xs text-slate-400">Date: {dailyChallenge.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 fill-amber-400" /> +{dailyChallenge.xpReward} XP Reward
                  </span>
                </div>
              </div>

              {/* Part 1: Coding Challenge */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-indigo-400 uppercase mb-1">Coding Problem</div>
                  <div className="text-base font-bold text-white mb-1">{dailyChallenge.codingTitle}</div>
                  <div className="text-xs text-slate-400">{dailyChallenge.codingConcept}</div>
                </div>

                <Link
                  to="/coding/binary-search"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 shrink-0"
                >
                  Solve in Playground →
                </Link>
              </div>

              {/* Part 2: Quick Daily Concept Quiz */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-xs font-bold text-teal-400 uppercase mb-2">Daily Conceptual Question</div>
                <div className="text-sm font-semibold text-white mb-4 leading-relaxed">{dailyChallenge.quizQuestion}</div>

                <div className="space-y-2 mb-4">
                  {quizOptions.map((opt, idx) => {
                    const isSelected = quizAnswerSelected === idx;
                    const isCorrect = idx === dailyChallenge.quizCorrectIdx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => !quizSubmitted && setQuizAnswerSelected(idx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                          quizSubmitted
                            ? isCorrect
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              : isSelected
                              ? 'bg-red-500/20 border-red-500/40 text-red-300'
                              : 'bg-slate-900/60 border-slate-800 text-slate-500'
                            : isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={quizAnswerSelected === null}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold disabled:opacity-50 transition-colors"
                  >
                    Check Daily Answer
                  </button>
                ) : (
                  <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Answer confirmed! +25 XP credited to your profile.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* COLLABORATIVE STUDY ROOMS */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Collaborative Study Rooms</h2>
                <p className="text-xs text-slate-400">Team up with peers to solve algorithmic sets and share notes.</p>
              </div>
            </div>

            {selectedRoom && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white text-sm">{selectedRoom.title}</h3>
                    <p className="text-xs text-indigo-300 mt-0.5">Today's Goal: {selectedRoom.goal}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 shrink-0">
                    {selectedRoom.memberCount} active learners
                  </span>
                </div>

                {/* Messages feed */}
                <div className="max-h-56 overflow-y-auto space-y-2 p-2">
                  {selectedRoom.messages?.map((msg: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-800/80 border border-slate-800 text-xs">
                      <div className="font-bold text-indigo-400 mb-1">{msg.senderName}</div>
                      <div className="text-slate-300">{msg.content}</div>
                    </div>
                  ))}
                </div>

                {/* Message input */}
                <form onSubmit={handlePostRoomMessage} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={roomMessage}
                    onChange={(e) => setRoomMessage(e.target.value)}
                    placeholder="Share code snippet, question or note..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
                  >
                    Post
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COL: XP Leaderboard & Badges */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Global Leaderboard</h2>
                <p className="text-xs text-slate-400">Ranked by consistency, XP & mastery</p>
              </div>
            </div>

            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                    user.rank === 1
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : user.rank === 2
                      ? 'bg-slate-800/80 border-slate-700'
                      : 'bg-slate-800/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full font-black text-xs flex items-center justify-center ${
                      user.rank === 1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {user.rank}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">{user.name}</div>
                      <div className="text-[10px] text-indigo-400">{user.badge}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-white">{user.xp} XP</div>
                    <div className="text-[10px] text-amber-400 flex items-center gap-1 justify-end">
                      <Flame className="h-3 w-3 fill-amber-400" /> {user.streak}d streak
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArenaPage;
