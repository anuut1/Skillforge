import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GraduationCap, LogOut, User as UserIcon, Swords, Briefcase } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 shadow-lg shadow-indigo-500/25">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                SkillForge
              </span>
            </Link>

            {/* Platform Navigation */}
            <div className="hidden lg:flex items-center gap-5 text-xs font-semibold">
              <Link to="/dashboard" className="text-slate-300 hover:text-indigo-400 transition-colors">
                Dashboard
              </Link>
              <Link to="/roadmap" className="text-slate-300 hover:text-indigo-400 transition-colors">
                Roadmap
              </Link>
              <Link to="/skills/gap-analysis" className="text-slate-300 hover:text-indigo-400 transition-colors">
                Skill Gap
              </Link>
              <Link to="/catalog" className="text-slate-300 hover:text-indigo-400 transition-colors">
                Courses
              </Link>
              <Link to="/playground" className="text-slate-300 hover:text-indigo-400 transition-colors">
                Playground
              </Link>
              <Link to="/projects" className="text-slate-300 hover:text-indigo-400 transition-colors">
                Projects
              </Link>
              <Link to="/placement-hub" className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-indigo-400" /> Placement Hub
              </Link>
              <Link to="/arena" className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
                <Swords className="h-3.5 w-3.5" /> Arena
              </Link>
              <Link to="/profile" className="text-slate-300 hover:text-indigo-400 transition-colors">
                Profile
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">

            {isAuthenticated && user ? (
              <>
                <Link
                  to={user.role === 'instructor' ? '/instructor' : '/student'}
                  className="text-xs font-semibold text-white bg-indigo-600/80 hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-indigo-400 text-xs font-bold">
                    <UserIcon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-medium text-slate-200 hidden sm:block">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/onboarding"
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

