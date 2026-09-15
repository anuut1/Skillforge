import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Role, User } from '../types';
import {
  GraduationCap,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
  Server,
  Cloud,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import client from '../api/client';
import { isCognitoEnabled, cognitoSignIn, cognitoSignUp } from '../lib/cognito';

const CAREER_GOALS = [
  'Software Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Scientist',
  'AI/ML Engineer',
  'Cloud Engineer',
  'DevOps Engineer',
  'Cybersecurity Engineer',
  'Other'
];

const SKILL_OPTIONS = [
  'Java', 'C++', 'Python', 'JavaScript', 'React', 'Node.js',
  'SQL', 'DBMS', 'OS', 'Computer Networks', 'DSA', 'AWS', 'Docker', 'Git'
];

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role] = useState<Role>('student');

  // Multi-step signup state
  const [signupStep, setSignupStep] = useState(1);
  const [careerGoal, setCareerGoal] = useState('Full Stack Developer');
  const [currentLevel, setCurrentLevel] = useState('Intermediate');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['JavaScript', 'React', 'SQL', 'Git']);
  const [registeredSummary, setRegisteredSummary] = useState<any>(null);

  // Forgot password modal
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Error & loading state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const usingCognito = isCognitoEnabled();

  // If already authenticated, redirect immediately to dashboard unless reviewing signup step 5
  useEffect(() => {
    if (isAuthenticated && signupStep !== 5) {
      navigate('/student');
    }
  }, [isAuthenticated, signupStep, navigate]);

  // Handle saved email if remembered
  useEffect(() => {
    const savedEmail = localStorage.getItem('skillforge_remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Password validation criteria
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const strengthScore = [hasMinLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  const strengthLabel = strengthScore <= 1 ? 'Weak' : strengthScore <= 3 ? 'Medium' : 'Strong';
  const strengthColor = strengthScore <= 1 ? 'text-red-400' : strengthScore <= 3 ? 'text-amber-400' : 'text-emerald-400';

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Client-side quick email validator
  const isValidEmail = (str: string) => /\S+@\S+\.\S+/.test(str);

  // ==========================================
  // LOGIN SUBMISSION (CASE 1 & CASE 2)
  // ==========================================
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoginFailed(false);

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    try {
      let token: string;
      let userData: User;

      if (usingCognito) {
        token = await cognitoSignIn(email, password);
        localStorage.setItem('token', token);
        const res = await client.get('/auth/me');
        userData = { ...res.data.user, role: res.data.user.role.toLowerCase() as Role };
      } else {
        const res = await client.post('/auth/login', { email: email.trim(), password });
        token = res.data.token;
        userData = { ...res.data.user, role: res.data.user.role.toLowerCase() as Role };
      }

      if (rememberMe) {
        localStorage.setItem('skillforge_remember_email', email.trim());
      } else {
        localStorage.removeItem('skillforge_remember_email');
      }

      login(token, userData);
      // Seamlessly land on personalized dashboard
      navigate(userData.role === 'instructor' ? '/instructor' : '/student');
    } catch (err: any) {
      setLoginFailed(true);
      const msg = err?.response?.data?.message || 'Incorrect email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // MULTI-STEP SIGNUP SUBMISSION
  // ==========================================
  const handleNextSignupStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    if (signupStep === 1) {
      if (!name.trim()) {
        setError('Full name is required.');
        return;
      }
      if (!email.trim() || !isValidEmail(email)) {
        setError('Please enter a valid email address.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (!hasUpper || !hasNumber || !hasSpecial) {
        setError('Password does not meet all security requirements.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setSignupStep(2);
    } else if (signupStep === 2) {
      setSignupStep(3);
    } else if (signupStep === 3) {
      setSignupStep(4);
    } else if (signupStep === 4) {
      executeSignup();
    }
  };

  const executeSignup = async () => {
    setLoading(true);
    setError('');

    try {
      let token: string;
      let userData: User;

      if (usingCognito) {
        await cognitoSignUp(email.trim(), password, name.trim());
        token = await cognitoSignIn(email.trim(), password);
        localStorage.setItem('token', token);
        const res = await client.get('/auth/me');
        userData = { ...res.data.user, role: res.data.user.role.toLowerCase() as Role };
      } else {
        const res = await client.post('/auth/register', {
          email: email.trim(),
          password,
          name: name.trim(),
          role: role.toUpperCase(),
          careerGoal,
          currentLevel,
          knownTechs: selectedSkills
        });
        token = res.data.token;
        userData = { ...res.data.user, role: res.data.user.role.toLowerCase() as Role };
      }

      setRegisteredSummary({
        name: userData.name,
        careerGoal,
        skillsCount: selectedSkills.length,
        readiness: currentLevel === 'Advanced' ? 82 : currentLevel === 'Intermediate' ? 68 : 45
      });
      setSignupStep(5);
      login(token, userData);
    } catch (err: any) {
      console.error('Registration error:', err);
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message;
      setError(serverMsg || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORGOT / RESET PASSWORD SUBMISSION
  // ==========================================
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotMsg('');

    if (!forgotEmail || !isValidEmail(forgotEmail)) {
      setForgotError('Please enter a valid account email.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await client.post('/auth/forgot-password', { email: forgotEmail.trim() });
      setForgotMsg(`Verification code generated: ${res.data.resetCode || '123456'}. Enter it below.`);
      if (res.data.resetCode) setResetCode(res.data.resetCode);
      setForgotStep(2);
    } catch (err: any) {
      setForgotError(err?.response?.data?.message || 'Error generating reset token.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (!resetCode || resetCode.length < 4) {
      setForgotError('Please enter the 6-digit verification code.');
      return;
    }
    if (newPassword.length < 8) {
      setForgotError('New password must be at least 8 characters long.');
      return;
    }

    setForgotLoading(true);
    try {
      await client.post('/auth/reset-password', {
        email: forgotEmail.trim(),
        token: resetCode.trim(),
        newPassword
      });
      setForgotMsg('Password updated successfully! You can now log in.');
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotStep(1);
        setEmail(forgotEmail);
        setIsLogin(true);
      }, 1800);
    } catch (err: any) {
      setForgotError(err?.response?.data?.message || 'Failed to reset password.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="w-full max-w-lg space-y-8">
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 flex items-center justify-center relative shadow-xl shadow-indigo-500/25">
              <GraduationCap className="h-full w-full text-white" />
              <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-1 border border-slate-800">
                {usingCognito ? <Cloud className="h-3.5 w-3.5 text-sky-400" /> : <Server className="h-3.5 w-3.5 text-emerald-400" />}
              </div>
            </div>
          </Link>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
            {isLogin ? 'Welcome back to SkillForge' : 'Create your SkillForge path'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {isLogin
              ? 'Enter your credentials to access your personalized AI career roadmap.'
              : 'Architect your personalized skill journey with AI-driven gap analysis.'}
          </p>
        </div>

        {/* Auth Card Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Top Toggle Switch */}
          <div className="flex border-b border-slate-800 mb-6">
            <button
              className={`flex-1 pb-3 text-xs sm:text-sm font-bold transition-colors ${
                isLogin ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-300'
              }`}
              onClick={() => {
                setIsLogin(true);
                setError('');
                setLoginFailed(false);
              }}
            >
              Log In
            </button>
            <button
              className={`flex-1 pb-3 text-xs sm:text-sm font-bold transition-colors ${
                !isLogin ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-300'
              }`}
              onClick={() => {
                setIsLogin(false);
                setError('');
                setLoginFailed(false);
              }}
            >
              Sign Up (5-Step)
            </button>
          </div>

          {/* Error Banner with Smart Recovery */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
              {loginFailed && (
                <div className="pt-2 border-t border-red-500/20 flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-400">Don't have an account yet?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      setError('');
                      setLoginFailed(false);
                    }}
                    className="font-bold text-indigo-400 hover:underline"
                  >
                    Create Account →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* 1. LOGIN FORM (SECTIONS 1, 2, 8) */}
          {/* ========================================== */}
          {isLogin ? (
            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password with Show/Hide */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-indigo-400 hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs text-slate-400 select-none">Remember me</span>
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? 'Authenticating...' : 'Log In'}
              </button>

              {/* Explicit New User Prominent Card */}
              <div className="mt-6 pt-5 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-400 mb-2">New to SkillForge?</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-300 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  Create your account <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          ) : (
            /* ========================================== */
            /* 2. MULTI-STEP SIGNUP FLOW (SECTION 4)      */
            /* ========================================== */
            <div>
              {/* Stepper Header */}
              {signupStep < 5 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2">
                    <span>Step {signupStep} of 4</span>
                    <span className="text-indigo-400">
                      {signupStep === 1 && 'Basic Information'}
                      {signupStep === 2 && 'Career Goal'}
                      {signupStep === 3 && 'Experience Level'}
                      {signupStep === 4 && 'Current Skills'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(signupStep / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 1: Basic Info */}
              {signupStep === 1 && (
                <form onSubmit={handleNextSignupStep} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
                        placeholder="Alex Morgan"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
                        placeholder="alex@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Real-time Password Strength Meter (Section 5) */}
                    <div className="mt-2 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs space-y-1.5">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-400">Password strength:</span>
                        <span className={strengthColor}>{strengthLabel}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px]">
                        <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {hasMinLength ? <Check className="h-3 w-3" /> : '○'} At least 8 chars
                        </span>
                        <span className={`flex items-center gap-1 ${hasUpper ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {hasUpper ? <Check className="h-3 w-3" /> : '○'} One uppercase
                        </span>
                        <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {hasNumber ? <Check className="h-3 w-3" /> : '○'} One number
                        </span>
                        <span className={`flex items-center gap-1 ${hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {hasSpecial ? <Check className="h-3 w-3" /> : '○'} One special char
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    Continue to Career Goal <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}

              {/* STEP 2: Career Goal */}
              {signupStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">What do you want to become?</h3>
                    <p className="text-xs text-slate-400">Select your target career track to calibrate your curriculum.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                    {CAREER_GOALS.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setCareerGoal(g)}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                          careerGoal === g
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                            : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupStep(3)}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-1.5"
                    >
                      Continue <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Current Level */}
              {signupStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">What is your current experience level?</h3>
                    <p className="text-xs text-slate-400">Helps our AI assign your starting problem difficulty.</p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { level: 'Beginner', desc: 'New to programming or early CS student. Need strong fundamentals.' },
                      { level: 'Intermediate', desc: 'Comfortable coding. Building full projects and practicing DSA.' },
                      { level: 'Advanced', desc: 'Experienced. Focusing on high-tier placement, System Design & FAANG screens.' }
                    ].map((item) => (
                      <button
                        key={item.level}
                        type="button"
                        onClick={() => setCurrentLevel(item.level)}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${
                          currentLevel === item.level
                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                            : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="font-bold text-xs text-white">{item.level}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSignupStep(2)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupStep(4)}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-1.5"
                    >
                      Select Skills <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Select Known Skills */}
              {signupStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Which skills have you already practiced?</h3>
                    <p className="text-xs text-slate-400">Select any you know to skip redundant introductory topics.</p>
                  </div>

                  <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto pr-1">
                    {SKILL_OPTIONS.map((skill) => {
                      const active = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            active
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {active ? '✓ ' : '+ '} {skill}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSignupStep(3)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={executeSignup}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      {loading ? 'Synthesizing Path...' : 'Complete & Generate Path'}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Personalized Start Confirmation */}
              {signupStep === 5 && (
                <div className="text-center py-4 space-y-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white mb-1">
                      Great! We've created your SkillForge path.
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Your personalized {registeredSummary?.careerGoal} roadmap, skill gap matrix, and daily challenge are live.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-left p-4 bg-slate-800/50 border border-slate-700/60 rounded-2xl text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Track</span>
                      <strong className="text-white">{registeredSummary?.careerGoal}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Initial Readiness</span>
                      <strong className="text-emerald-400">{registeredSummary?.readiness}%</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/student')}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all"
                  >
                    Open Personalized Dashboard →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL (SECTION 6) */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Reset Your Password</h3>
              </div>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotStep(1);
                  setForgotError('');
                  setForgotMsg('');
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {forgotError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {forgotError}
              </div>
            )}

            {forgotMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                {forgotMsg}
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your registered account email. We will generate an authentication verification code to securely reset your credentials.
                </p>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Account Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
                >
                  {forgotLoading ? 'Verifying Account...' : 'Generate Reset Code →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Verification Code</label>
                  <input
                    type="text"
                    required
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="e.g. 849201"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 font-mono tracking-wider"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                >
                  {forgotLoading ? 'Updating Password...' : 'Save New Password & Log In'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;

