import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import client from '../../api/client';
import {
  GraduationCap,
  LayoutDashboard,
  Map,
  Compass,
  Code2,
  FolderGit2,
  Briefcase,
  BookOpen,
  User,
  LogOut,
  Bell,
  Search,
  Check,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  FileText
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const AuthenticatedLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard shortcut listener for Ctrl+K / Cmd+K (Section 23)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await client.get('/auth/notifications');
        setNotifications(res.data || []);
      } catch (err) {
        console.error('Failed to load notifications', err);
      }
    };

    fetchNotifications();
  }, [location.pathname]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await client.patch(`/auth/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await client.patch('/auth/notifications/all/read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('road') || q.includes('track') || q.includes('path')) {
      navigate('/roadmap');
    } else if (q.includes('gap') || q.includes('skill') || q.includes('analys')) {
      navigate('/skills/gap-analysis');
    } else if (q.includes('code') || q.includes('play') || q.includes('two sum') || q.includes('problem')) {
      navigate('/coding/two-sum');
    } else if (q.includes('project') || q.includes('capstone')) {
      navigate('/projects');
    } else if (q.includes('place') || q.includes('job') || q.includes('prep')) {
      navigate('/placement-hub');
    } else if (q.includes('resume') || q.includes('cv') || q.includes('ats')) {
      navigate('/resume');
    } else if (q.includes('arena') || q.includes('chal') || q.includes('lead')) {
      navigate('/coding');
    } else if (q.includes('interv') || q.includes('mock')) {
      navigate('/interview');
    } else {
      navigate('/catalog');
    }
    setSearchQuery('');
  };

  const navLinks = [
    { to: user?.role === 'instructor' ? '/instructor' : '/student', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/roadmap', label: 'Roadmap', icon: Map },
    { to: '/skills/gap-analysis', label: 'Skill Gap', icon: Compass },
    { to: '/catalog', label: 'Courses', icon: BookOpen },
    { to: '/playground', label: 'Playground', icon: Code2 },
    { to: '/projects', label: 'Projects', icon: FolderGit2 },
    { to: '/placement-hub', label: 'Placement Hub', icon: Briefcase },
    { to: '/resume', label: 'Resume Analyzer', icon: FileText },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 h-16 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <GraduationCap className="h-full w-full text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight hidden sm:inline-block">
              Skill<span className="text-indigo-400">Forge</span>
            </span>
          </Link>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden sm:flex items-center flex-1 max-w-md mx-6">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features, roadmaps, problems, skills..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </form>
        </div>

        {/* Right: Notifications & Profile Menu */}
        <div className="flex items-center gap-3">
          {/* Notifications Drawer Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setUserDropdownOpen(false);
              }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors relative"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="p-3.5 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-semibold text-indigo-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-3.5 text-xs transition-colors flex items-start gap-3 ${
                          n.isRead ? 'bg-slate-900/50 text-slate-400' : 'bg-slate-800/30 text-slate-200'
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                          <Sparkles className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-200">{n.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{n.message}</div>
                        </div>
                        {!n.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(n.id)}
                            className="text-slate-500 hover:text-emerald-400 p-1"
                            title="Mark as read"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No notifications yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setUserDropdownOpen(!userDropdownOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2.5 p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden md:inline-block max-w-[120px] truncate">
                {user?.name || 'User'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-slate-800">
                  <div className="text-xs font-bold text-white truncate">{user?.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                  <div className="mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 uppercase">
                    {user?.role}
                  </div>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  Edit Profile & Goals
                </Link>

                <div className="border-t border-slate-800 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* BODY WITH PERSISTENT SIDEBAR */}
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800 py-6 px-4 space-y-1 overflow-y-auto shrink-0">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Platform Navigation
          </div>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </aside>

        {/* MOBILE SIDEBAR MODAL */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-slate-950/80 backdrop-blur-sm flex">
            <div className="w-64 bg-slate-900 h-full p-4 flex flex-col space-y-2 border-r border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="font-bold text-white text-sm">Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 pt-2">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-xs font-semibold text-red-400 w-full px-3 py-2 rounded-xl hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* MAIN OUTLET CONTENT */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          <Outlet />
        </main>
      </div>

      {/* GLOBAL COMMAND PALETTE (Section 23 - Ctrl+K) */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-24 px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Input Header */}
            <div className="p-4 border-b border-slate-800 flex items-center gap-3">
              <Search className="h-5 w-5 text-indigo-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or jump to feature... (or Esc to close)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                ESC
              </span>
            </div>

            {/* Command Links */}
            <div className="p-2 max-h-80 overflow-y-auto space-y-1">
              {[
                { label: 'Go to Dashboard', to: '/student', desc: 'AI flight path and personalized daily status' },
                { label: 'Start Today\'s Mission', to: '/student', desc: 'Complete adaptive daily sprint (+120 XP)' },
                { label: 'Open Career Roadmap', to: '/roadmap', desc: 'Inspect hierarchical milestone progression' },
                { label: 'Analyze Skill Gap', to: '/skills/gap-analysis', desc: 'Identify critical missing competencies' },
                { label: 'Open Coding Playground', to: '/coding/two-sum', desc: 'Practice DSA problems with AI evaluation' },
                { label: 'Explore Applied Projects', to: '/projects', desc: 'Build and evaluate industry-standard capstones' },
                { label: 'Open Placement Hub', to: '/placement-hub', desc: 'Access 200+ company questions & interview cheatsheets' },
                { label: 'Start AI Mock Interview', to: '/interview', desc: 'Simulate live FAANG-standard technical screen' },
                { label: 'View Cryptographic Skill Passport', to: '/passport', desc: 'Verified evidence of code and projects' },
                { label: 'Edit Profile & Settings', to: '/profile', desc: 'Update career track, timeline, and known techs' }
              ]
                .filter(cmd => !searchQuery || cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) || cmd.desc.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((cmd) => (
                  <button
                    key={cmd.label}
                    onClick={() => {
                      setCommandPaletteOpen(false);
                      setSearchQuery('');
                      navigate(cmd.to);
                    }}
                    className="w-full p-3 rounded-2xl hover:bg-slate-800 text-left transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {cmd.label}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{cmd.desc}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthenticatedLayout;

