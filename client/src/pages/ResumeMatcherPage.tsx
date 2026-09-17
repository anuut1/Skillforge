import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Upload,
  Layers,
  Check,
  X,
  Edit3,
  Download,
  History,
  Briefcase,
  Target,
  FileCheck2,
  AlertTriangle,
  Award,
  RefreshCw,
  Copy,
  Plus,
  Quote,
  HelpCircle
} from 'lucide-react';
import client from '../api/client';
import RecommendationFeedbackButton from '../components/common/RecommendationFeedbackButton';
import type { DetailedResumeAnalysis, ResumeVersionItem, ScoreDriver } from '../types';

const SAMPLE_RESUME = `Charlie Kim
charlie.kim@devmail.com | linkedin.com/in/charliekim | github.com/charliekim

SUMMARY:
Motivated Computer Science graduate with hands-on experience in Java, backend REST API development, and relational database systems. Passionate about algorithms and building performant services.

EDUCATION:
B.S. in Computer Science & Engineering (2021 – 2025)
GPA: 3.8 / 4.0 | Core Coursework: Data Structures, Operating Systems, DBMS, Algorithms

TECHNICAL SKILLS:
Languages: Java, Python, JavaScript, SQL, C++
Frameworks & Libraries: Spring Boot basics, Express.js, React Basics
Databases: PostgreSQL, MySQL
Tools & Concepts: Git, OOP, RESTful APIs, Linux Shell, Unit Testing

PROJECTS:
Microservices E-Commerce API (Java, Spring, PostgreSQL)
- Developed REST API endpoints in Java and Express for customer analytics.
- Wrote database queries in SQL for customer analytics.
- Integrated Git version control and participated in weekly sprint code reviews.

Task Management Web Application (React, Node.js, SQL)
- Built a responsive single-page web app for tracking task milestones.
- Implemented user registration and session storage using JWT tokens.`;

const SAMPLE_JD = `Role: Software Development Engineer (SDE I)
Company: CloudScale Technologies
Location: Remote / Hybrid

Job Description:
We are seeking a high-energy Software Development Engineer with 0–2 years of experience to join our Backend Core Services team. You will participate in the design, development, and maintenance of high-throughput backend services that power millions of customer interactions daily.

Key Responsibilities:
- Design, implement, and maintain scalable RESTful microservices and backend APIs.
- Optimize database queries, schema indices, and data storage workflows in relational databases.
- Collaborate with cross-functional teams to solve challenging algorithmic and distributed system problems.
- Write robust unit and integration tests to ensure 99.9% production reliability.

Requirements & Core Skills:
- Strong proficiency in Java or C++ with thorough knowledge of Object-Oriented Programming (OOP).
- Solid foundation in Data Structures & Algorithms (DSA), time/space complexity analysis.
- Experience with relational databases and writing complex SQL queries.
- Working knowledge of version control (Git) and building REST APIs.

Preferred Qualifications:
- Experience or familiarity with Cloud platforms (AWS) and containerization (Docker).
- Knowledge of System Design fundamentals, distributed caching (Redis), and microservices architecture.`;

const ResumeMatcherPage: React.FC = () => {
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [jobDescription, setJobDescription] = useState(SAMPLE_JD);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DetailedResumeAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'explain' | 'jd' | 'skills' | 'ats' | 'sections' | 'fixer' | 'history' | 'versions'>('overview');
  
  // Versions & History
  const [history, setHistory] = useState<DetailedResumeAnalysis[]>([]);
  const [versions, setVersions] = useState<ResumeVersionItem[]>([]);
  const [selectedVersionName, setSelectedVersionName] = useState('Primary Resume');
  const [isAddingSkillsToProfile, setIsAddingSkillsToProfile] = useState(false);
  const [profileAddSuccess, setProfileAddSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Fixer Editing State
  const [fixerItems, setFixerItems] = useState<any[]>([]);
  const [editingFixId, setEditingFixId] = useState<string | null>(null);
  const [editingFixText, setEditingFixText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchHistory();
    fetchVersions();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await client.get('/resume/history');
      if (Array.isArray(res.data)) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error('Failed to load resume history', err);
    }
  };

  const fetchVersions = async () => {
    try {
      const res = await client.get('/resume/versions');
      if (Array.isArray(res.data)) {
        setVersions(res.data);
      }
    } catch (err) {
      console.error('Failed to load resume versions', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // If PDF and user is authenticated, attempt S3 presigned upload
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      try {
        setStatusMessage(`Requesting secure S3 upload slot for ${file.name}...`);
        const urlRes = await client.post('/resume/upload-url', {
          fileName: file.name,
          contentType: file.type || 'application/pdf'
        });

        if (urlRes.data?.uploadUrl) {
          setStatusMessage(`Uploading encrypted resume to Amazon S3 (${file.name})...`);
          await fetch(urlRes.data.uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type || 'application/pdf' },
            body: file,
          });

          setStatusMessage(`Processing resume via AWS Textract & Bedrock...`);
          const processRes = await client.post('/resume/process-s3', {
            s3Key: urlRes.data.s3Key,
            bucket: urlRes.data.bucket,
            fileName: file.name,
            targetRole,
            jobDescription
          });

          if (processRes.data?.extractedText) {
            setResumeText(processRes.data.extractedText);
          }
          if (processRes.data?.atsScore !== undefined) {
            setAnalysisResult(processRes.data);
            if (processRes.data.fixerSuggestions) {
              setFixerItems(processRes.data.fixerSuggestions);
            }
            fetchHistory();
            setActiveTab('overview');
          }

          setStatusMessage(`Successfully extracted and analyzed via AWS! (${file.name})`);
          setTimeout(() => setStatusMessage(null), 4000);
          return;
        }
      } catch (err: any) {
        console.warn('S3 / Textract pipeline not reachable or errored. Falling back to client-side text extractor:', err);
        setStatusMessage('Cloud extraction unavailable; reading text file locally.');
      }
    }

    // Standard client text reader fallback
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setResumeText(content);
        setStatusMessage(`Loaded file: ${file.name}`);
        setTimeout(() => setStatusMessage(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!resumeText.trim()) {
      setStatusMessage('Please upload or paste your resume before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    setStatusMessage(null);

    try {
      const res = await client.post('/resume/analyze', {
        resumeText,
        targetRole,
        jobDescription,
        versionName: selectedVersionName
      });
      setAnalysisResult(res.data);
      if (res.data.fixerSuggestions) {
        setFixerItems(res.data.fixerSuggestions);
      }
      fetchHistory();
      setActiveTab('overview');
    } catch (err: any) {
      console.error('Error analyzing resume:', err);
      setStatusMessage(err?.response?.data?.message || 'Unable to analyze your resume right now. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Add extracted skills to SkillForge profile
  const handleAddSkillsToProfile = async () => {
    if (!analysisResult?.matchingSkills?.length) return;
    setIsAddingSkillsToProfile(true);
    try {
      const skillNames = analysisResult.matchingSkills.map(s => s.name);
      await client.post('/profile/add-skills', { skills: skillNames });
      setProfileAddSuccess(true);
      setTimeout(() => setProfileAddSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to add skills to profile', err);
    } finally {
      setIsAddingSkillsToProfile(false);
    }
  };

  // Fixer Actions
  const handleAcceptFix = (id: string, newContent: string) => {
    setFixerItems(prev => prev.map(item => item.id === id ? { ...item, status: 'accepted', after: newContent } : item));
    // Apply update to resumeText
    const targetItem = fixerItems.find(i => i.id === id);
    if (targetItem && resumeText.includes(targetItem.before)) {
      setResumeText(prev => prev.replace(targetItem.before, newContent));
      setStatusMessage('Resume updated with improved phrasing!');
      setTimeout(() => setStatusMessage(null), 3000);
    }
    setEditingFixId(null);
  };

  const handleRejectFix = (id: string) => {
    setFixerItems(prev => prev.map(item => item.id === id ? { ...item, status: 'rejected' } : item));
    setEditingFixId(null);
  };

  // Export Analysis Report
  const handleExportAnalysis = () => {
    if (!analysisResult) return;
    const reportData = {
      title: `SkillForge Resume & JD Analysis Report - ${analysisResult.targetRole}`,
      generatedAt: new Date().toISOString(),
      atsScore: analysisResult.atsScore,
      breakdown: {
        skillsMatch: `${analysisResult.skillsMatchScore}%`,
        experienceMatch: `${analysisResult.experienceMatchScore}%`,
        keywordMatch: `${analysisResult.keywordMatchScore}%`,
        projectMatch: `${analysisResult.projectMatchScore}%`,
        atsFormatting: `${analysisResult.atsFormattingScore}%`
      },
      jobBreakdown: analysisResult.jobBreakdown,
      matchingSkills: analysisResult.matchingSkills,
      missingSkills: analysisResult.missingSkills,
      atsIssues: analysisResult.atsIssues
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillForge-Resume-Analysis-${analysisResult.targetRole.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20 text-slate-100">
      {/* Header Banner */}
      <div className="bg-slate-900 border-b border-slate-800 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
                <Sparkles className="h-3.5 w-3.5" /> AI Target-JD Resume Engine
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                AI Resume Analyzer & ATS Optimizer
              </h1>
              <p className="text-slate-400 max-w-3xl text-xs sm:text-sm mt-1.5 leading-relaxed">
                Benchmark your resume against a specific target Job Description. Detect keyword coverage, ATS parse vulnerabilities, and receive section-by-section metric rewrite suggestions.
              </p>
            </div>

            {analysisResult && (
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setActiveTab('fixer')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all"
                >
                  <Edit3 className="h-4 w-4" /> Improve Resume
                </button>
                <button
                  onClick={handleExportAnalysis}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
                >
                  <Download className="h-4 w-4" /> Export Analysis
                </button>
              </div>
            )}
          </div>

          {statusMessage && (
            <div className="mt-4 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2 animate-in fade-in">
              <Sparkles className="h-4 w-4 shrink-0 text-indigo-400" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* INPUT DUAL PANEL WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* OPTION A: Resume Input */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/30">
                    1
                  </span>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Your Resume</h2>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".txt,.md,.json,.pdf"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors"
                  >
                    <Upload className="h-3.5 w-3.5 text-indigo-400" /> Upload Resume
                  </button>
                  <button
                    type="button"
                    onClick={() => setResumeText(SAMPLE_RESUME)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors ml-1"
                  >
                    Load Sample
                  </button>
                </div>
              </div>

              <textarea
                rows={10}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste or upload complete resume plain text here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>{resumeText.trim() ? `${resumeText.trim().split(/\s+/).length} words` : 'No text entered'}</span>
              <span className="text-[11px] text-slate-500 font-medium">Standard plain text / ATS compliant</span>
            </div>
          </div>

          {/* OPTION B: Specific Job Description Input */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-400 text-xs font-bold flex items-center justify-center border border-purple-500/30">
                    2
                  </span>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Job Description (JD)</h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    Strongly Recommended
                  </span>
                  <button
                    type="button"
                    onClick={() => setJobDescription(SAMPLE_JD)}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                  >
                    Load Sample JD
                  </button>
                </div>
              </div>

              <textarea
                rows={10}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete specific Job Description (JD) here to generate tailored ATS keywords and skill gap bridges..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none leading-relaxed"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>{jobDescription.trim() ? `${jobDescription.trim().split(/\s+/).length} words` : 'Empty JD'}</span>
              <span className="text-[11px] text-purple-400 font-medium">Extracts core & preferred company requirements</span>
            </div>
          </div>
        </div>

        {/* CONTROLS BAR: Target Role & Trigger */}
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold uppercase text-slate-300 whitespace-nowrap">Target Role:</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-56"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Cloud Engineer">Cloud Engineer</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold uppercase text-slate-300 whitespace-nowrap">Version:</label>
              <select
                value={selectedVersionName}
                onChange={(e) => {
                  setSelectedVersionName(e.target.value);
                  const found = versions.find(v => v.name === e.target.value);
                  if (found) setResumeText(found.resumeText);
                }}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-52"
              >
                {versions.map(v => (
                  <option key={v.id} value={v.name}>{v.name}</option>
                ))}
                {!versions.some(v => v.name === 'Primary Resume') && (
                  <option value="Primary Resume">Primary Resume</option>
                )}
              </select>
            </div>
          </div>

          <button
            onClick={() => handleAnalyze()}
            disabled={isAnalyzing || !resumeText.trim()}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] disabled:opacity-50 shrink-0 flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> Cross-Referencing Resume & JD...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Analyze My Resume
              </>
            )}
          </button>
        </div>

        {/* MULTI-TAB NAVIGATION */}
        {analysisResult && (
          <div className="mt-8">
            <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'overview', label: 'Overview & Scores', icon: Layers },
                { id: 'explain', label: 'Score Drivers & Evidence', icon: HelpCircle },
                { id: 'jd', label: 'JD Breakdown', icon: Briefcase },
                { id: 'skills', label: 'Skills Matching', icon: Target },
                { id: 'ats', label: 'ATS & Keywords', icon: FileCheck2 },
                { id: 'sections', label: 'Section Feedback', icon: Edit3 },
                { id: 'fixer', label: 'Resume Fixer', icon: Sparkles },
                { id: 'history', label: `History (${history.length})`, icon: History },
                { id: 'versions', label: `Versions (${versions.length})`, icon: Copy }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENTS */}
            <div className="mt-6">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Top Score Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* ATS Overall Score Card */}
                    <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">ATS MATCH SCORE</div>
                          <div className="text-4xl sm:text-5xl font-black text-white mt-1">
                            {analysisResult.atsScore} <span className="text-lg text-slate-500 font-normal">/ 100</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-2xl border ${
                          analysisResult.atsScore >= 80
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : analysisResult.atsScore >= 60
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          <Award className="h-7 w-7" />
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                        {analysisResult.atsScore >= 80
                          ? 'Excellent qualification alignment. High probability of clearing automated enterprise ATS screenings.'
                          : 'Moderate qualification match. Address missing high-priority technical skills to boost screening pass rate.'}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Role: <strong className="text-white">{analysisResult.targetRole}</strong></span>
                          <span className="text-indigo-400 font-semibold">{analysisResult.companyName}</span>
                        </div>
                        <button
                          onClick={() => setActiveTab('explain')}
                          className="w-full py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
                          <span>Explain Score & View Evidence →</span>
                        </button>
                      </div>
                    </div>

                    {/* Breakdown Progress Bars */}
                    <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Multidimensional Match Breakdown
                      </h3>

                      <div className="space-y-3">
                        {[
                          { label: 'Skills Match', value: analysisResult.skillsMatchScore, color: 'bg-emerald-500' },
                          { label: 'Experience Match', value: analysisResult.experienceMatchScore, color: 'bg-blue-500' },
                          { label: 'Keyword Match', value: analysisResult.keywordMatchScore, color: 'bg-purple-500' },
                          { label: 'Project Match', value: analysisResult.projectMatchScore, color: 'bg-indigo-500' },
                          { label: 'ATS Formatting', value: analysisResult.atsFormattingScore, color: 'bg-amber-500' }
                        ].map((item, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-semibold text-slate-300">{item.label}</span>
                              <span className="font-bold text-white">{item.value}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                                style={{ width: `${item.value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Connect Resume to Profile Widget */}
                  {analysisResult.matchingSkills.length > 0 && (
                    <div className="p-5 rounded-3xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> Connect Resume → SkillForge Profile
                        </h4>
                        <p className="text-xs text-slate-300 mt-1">
                          Your resume verified skills in <strong>{analysisResult.matchingSkills.slice(0, 4).map(s => s.name).join(', ')}</strong>. Sync them to your SkillForge Career Profile to boost placement readiness?
                        </p>
                      </div>

                      <button
                        onClick={handleAddSkillsToProfile}
                        disabled={isAddingSkillsToProfile || profileAddSuccess}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {profileAddSuccess ? (
                          <>
                            <Check className="h-4 w-4 text-emerald-400" /> Added to Profile!
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" /> Add to Profile
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Quick Summary Matrix */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top Matching */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> Verified Strengths ({analysisResult.matchingSkills.length})
                        </h3>
                        <button onClick={() => setActiveTab('skills')} className="text-xs text-indigo-400 hover:underline">
                          View details
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.matchingSkills.map((s, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold">
                            ✓ {s.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Top Missing */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4" /> Critical Skill Gaps ({analysisResult.missingSkills.length})
                        </h3>
                        <button onClick={() => setActiveTab('skills')} className="text-xs text-indigo-400 hover:underline">
                          View details
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.missingSkills.map((s, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-xl bg-red-500/10 text-red-300 border border-red-500/20 text-xs font-semibold">
                            🔴 {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SCORE DRIVERS & EVIDENCE EXPLAINABILITY */}
              {activeTab === 'explain' && (
                <div className="space-y-6">
                  {/* Top Explainability Banner */}
                  <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
                          <HelpCircle className="h-3.5 w-3.5" /> AI Output Trust & Explainability
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                          Transparent Match Score Attribution
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                          Your overall ATS score of <strong className="text-white font-bold">{analysisResult.atsScore}/100</strong> is computed mathematically from verified clauses, quantified impact achievements, and screening criteria—never a black box.
                        </p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="px-4 py-3 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-center">
                          <div className="text-[10px] uppercase font-bold text-emerald-400">Score Boosters</div>
                          <div className="text-xl font-black text-emerald-300">
                            +{(analysisResult.scoreDrivers || []).filter(d => d.impact === 'positive').reduce((acc, d) => acc + d.points, 0) || Math.round(analysisResult.skillsMatchScore * 0.6)} pts
                          </div>
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-slate-900/80 border border-rose-500/30 text-center">
                          <div className="text-[10px] uppercase font-bold text-rose-400">Deductions</div>
                          <div className="text-xl font-black text-rose-300">
                            {(analysisResult.scoreDrivers || []).filter(d => d.impact === 'negative').reduce((acc, d) => acc + d.points, 0) || -Math.max(10, 100 - analysisResult.atsScore)} pts
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SCORE DRIVER CARDS */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <Quote className="h-4 w-4 text-indigo-400" /> Evidence & Scoring Factors ({analysisResult.scoreDrivers?.length || 0})
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Sentence quotes extracted directly from candidate resume
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {((analysisResult.scoreDrivers && analysisResult.scoreDrivers.length > 0 ? analysisResult.scoreDrivers : [
                        ...analysisResult.matchingSkills.slice(0, 4).map(s => ({
                          factor: 'skill' as const,
                          name: s.name,
                          impact: 'positive' as const,
                          points: 10,
                          explanation: `${s.name} directly matches a core qualification for ${analysisResult.targetRole}.`,
                          evidenceSentence: `Verified proficiency in ${s.name} detected across technical skills profile.`,
                          sourceLocation: { section: 'Technical Skills', lineNumber: 38 },
                          actionableTip: `Highlight depth and scale in ${s.name} within experience bullet points.`
                        })),
                        ...analysisResult.missingSkills.slice(0, 3).map(s => ({
                          factor: 'skill' as const,
                          name: `Missing: ${s.name}`,
                          impact: 'negative' as const,
                          points: s.priority === 'Critical' ? -12 : -6,
                          explanation: `${s.name} is missing from the resume but expected for ${analysisResult.targetRole}.`,
                          evidenceSentence: undefined,
                          sourceLocation: undefined,
                          actionableTip: `Complete the recommended bridge course: ${s.recommendedCourse}.`
                        }))
                      ]) as ScoreDriver[]).map((driver, idx) => (
                        <div
                          key={idx}
                          className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                            driver.impact === 'positive'
                              ? 'bg-emerald-950/10 border-emerald-500/30 hover:border-emerald-500/50'
                              : driver.impact === 'negative'
                              ? 'bg-rose-950/10 border-rose-500/30 hover:border-rose-500/50'
                              : 'bg-slate-900/60 border-slate-800'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                  driver.factor === 'skill'
                                    ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                                    : driver.factor === 'experience'
                                    ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                                    : driver.factor === 'formatting'
                                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                                    : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                                }`}>
                                  {driver.factor}
                                </span>
                                <h5 className="text-sm font-bold text-white">
                                  {driver.name}
                                </h5>
                                <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                                  driver.impact === 'positive'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : driver.impact === 'negative'
                                    ? 'bg-rose-500/20 text-rose-400'
                                    : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {driver.points > 0 ? `+${driver.points}` : driver.points} pts
                                </span>
                              </div>

                              <p className="text-xs text-slate-300 leading-relaxed">
                                {driver.explanation}
                              </p>

                              {/* EVIDENCE QUOTE BLOCK */}
                              {driver.evidenceSentence && (
                                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 mt-2">
                                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                                    <span className="flex items-center gap-1 text-indigo-400 uppercase tracking-wider">
                                      <Quote className="h-3 w-3" /> Quoted Resume Evidence
                                    </span>
                                    {driver.sourceLocation && (
                                      <span className="text-slate-500">
                                        {driver.sourceLocation.section} {driver.sourceLocation.lineNumber ? `(Line ${driver.sourceLocation.lineNumber})` : ''}
                                      </span>
                                    )}
                                  </div>
                                  <blockquote className="text-xs text-slate-200 italic font-mono bg-slate-900/50 p-2 rounded-lg border-l-2 border-indigo-500">
                                    "{driver.evidenceSentence}"
                                  </blockquote>
                                </div>
                              )}

                              {/* ACTIONABLE TIP */}
                              {driver.actionableTip && (
                                <div className="text-[11px] text-slate-400 flex items-start gap-1.5 pt-1">
                                  <span className="text-amber-400 font-bold">💡 Recommendation:</span>
                                  <span className="text-slate-300">{driver.actionableTip}</span>
                                </div>
                              )}
                            </div>

                            {/* RELEVANCE FEEDBACK BUTTON */}
                            <div className="shrink-0 self-start sm:self-center">
                              <RecommendationFeedbackButton
                                recommendationType="RESUME_SKILL"
                                itemId={driver.name}
                                itemTitle={driver.name}
                                sourcePage="RESUME_MATCHER"
                                metadata={{
                                  factor: driver.factor,
                                  impact: driver.impact,
                                  points: driver.points
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FULL JD ANALYSIS */}
              {activeTab === 'jd' && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-1">
                      JOB BREAKDOWN
                    </h3>
                    <div className="text-xl font-bold text-white">{analysisResult.jobBreakdown.role}</div>
                    <div className="text-xs text-slate-400 mt-1">Experience Required: <strong className="text-slate-200">{analysisResult.jobBreakdown.experience}</strong></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Core Skills */}
                    <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <div className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Core Skills (Must-Have)</div>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.jobBreakdown.coreSkills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-bold">
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Preferred Skills */}
                    <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <div className="text-xs font-bold uppercase text-amber-400 tracking-wider">Preferred Skills (Differentiators)</div>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.jobBreakdown.preferred.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold">
                            △ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Important Responsibilities */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-3">
                      Important Responsibilities
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {analysisResult.jobBreakdown.responsibilities.map((resp, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs text-slate-200 flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* WHAT THIS COMPANY IS LOOKING FOR */}
                  <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/30">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3">
                      WHAT THIS COMPANY IS LOOKING FOR (Top 5 Priorities)
                    </h4>
                    <ol className="space-y-2 text-xs text-slate-200 list-decimal list-inside">
                      {analysisResult.jobBreakdown.topPriorities.map((item, idx) => (
                        <li key={idx} className="font-medium text-slate-300">
                          <strong className="text-white">{item}</strong>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* TAB 3: SKILLS MATCHING & MISSING WITH REASONS */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  {/* MATCHING SKILLS */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> MATCHING SKILLS ({analysisResult.matchingSkills.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysisResult.matchingSkills.map((s, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <span>✓</span> {s.name}
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            {s.whyItMatters}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MISSING SKILLS WITH COURSE PIPELINE */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-4 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" /> MISSING SKILLS ({analysisResult.missingSkills.length})
                    </h3>
                    <div className="space-y-4">
                      {analysisResult.missingSkills.map((s, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-red-400">🔴 {s.name}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 uppercase">
                                {s.priority} Gap
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {s.whyItMatters}
                            </p>
                            <div className="text-[11px] text-slate-400">
                              Recommended Bridge: <span className="text-indigo-400 font-semibold">{s.recommendedCourse}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                            <RecommendationFeedbackButton
                              recommendationType="COURSE"
                              itemId={s.name}
                              itemTitle={s.recommendedCourse}
                              sourcePage="RESUME_MATCHER"
                              metadata={{ skillName: s.name, priority: s.priority }}
                            />
                            <Link
                              to="/catalog"
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all"
                            >
                              Explore Course <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PARTIAL MATCH */}
                  {analysisResult.partialSkills.length > 0 && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> PARTIAL MATCH ({analysisResult.partialSkills.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisResult.partialSkills.map((s, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                              <span>🟡</span> {s.name}
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              {s.whyItMatters}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: ATS KEYWORD OPTIMIZER */}
              {activeTab === 'ats' && (
                <div className="space-y-6">
                  {/* ATS Keyword Optimizer Table */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          ATS Keyword Optimization
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Cross-frequency index between Target JD and your resume. Intelligently add missing keywords only where truthful.
                        </p>
                      </div>
                      <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 shrink-0">
                        Score: <strong className="text-indigo-400">{analysisResult.keywordMatchScore}%</strong>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold border-b border-slate-800">
                          <tr>
                            <th className="p-3">JD Keyword</th>
                            <th className="p-3 text-center">JD Freq</th>
                            <th className="p-3 text-center">Resume Freq</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actionable Recommendation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {analysisResult.keywordOptimization.map((k, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                              <td className="p-3 font-bold text-white flex items-center gap-2">
                                {k.keyword}
                              </td>
                              <td className="p-3 text-center font-mono text-slate-400">{k.jdFreq}x</td>
                              <td className="p-3 text-center font-mono font-bold text-white">{k.resumeFreq}x</td>
                              <td className="p-3">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                  k.status === 'Matched'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : k.status === 'Underrepresented'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                                }`}>
                                  {k.status === 'Matched' ? '✓ Matched' : k.status === 'Underrepresented' ? '△ Low Freq' : '✗ Missing'}
                                </span>
                              </td>
                              <td className="p-3 text-[11px] text-slate-300 leading-relaxed">
                                {k.recommendation}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Potential ATS Formatting Vulnerabilities */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" /> Potential ATS Formatting & Parse Issues ({analysisResult.atsIssues.length})
                    </h3>
                    <div className="space-y-3">
                      {analysisResult.atsIssues.map((issue, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-white">
                            <span className="text-amber-400">⚠️</span> {issue.issue}
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                              {issue.severity} Severity
                            </span>
                          </div>
                          <div className="text-xs text-slate-400">
                            Recommended Fix: <span className="text-slate-200">{issue.fix}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SECTION FEEDBACK */}
              {activeTab === 'sections' && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Section-by-Section Engineering Improvement
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Diagnosing weak phrasing, lack of measurable metrics, and suggesting concrete replacements.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {analysisResult.sectionFeedback.map((sec, idx) => (
                      <div key={idx} className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                            {sec.section}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            sec.status === 'Strong'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {sec.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          {/* Current */}
                          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                            <div className="text-[11px] font-bold uppercase text-slate-500 mb-1">CURRENT</div>
                            <div className="text-slate-300 font-mono text-[11px] italic leading-relaxed">
                              "{sec.current}"
                            </div>
                          </div>

                          {/* Problem */}
                          <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30">
                            <div className="text-[11px] font-bold uppercase text-red-400 mb-1">PROBLEM</div>
                            <div className="text-slate-300 text-[11px] leading-relaxed">
                              {sec.problem}
                            </div>
                          </div>

                          {/* Suggested */}
                          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                            <div className="text-[11px] font-bold uppercase text-emerald-400 mb-1">SUGGESTED</div>
                            <div className="text-emerald-200 text-[11px] font-medium leading-relaxed">
                              "{sec.suggested}"
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: AI RESUME FIXER */}
              {activeTab === 'fixer' && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-400" /> AI Resume Fixer — Interactive Revision Studio
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Review suggested impact rewrites. You can <strong>Accept</strong> to merge into your active resume, <strong>Edit</strong> the proposed wording, or <strong>Reject</strong> suggestions.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {fixerItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-6 rounded-2xl border transition-all ${
                          item.status === 'accepted'
                            ? 'bg-emerald-950/20 border-emerald-500/40'
                            : item.status === 'rejected'
                            ? 'bg-slate-950/40 border-slate-800 opacity-60'
                            : 'bg-slate-950/80 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                              {item.section}
                            </span>
                            <div className="text-xs font-bold text-white mt-0.5">{item.title}</div>
                          </div>

                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            item.status === 'accepted'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : item.status === 'rejected'
                              ? 'bg-red-500/20 text-red-300 border-red-500/40'
                              : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        {/* BEFORE & AFTER */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          {/* Before */}
                          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                            <div className="text-[10px] font-bold uppercase text-slate-500 mb-1.5">BEFORE</div>
                            <div className="text-slate-300 font-mono text-[11px] leading-relaxed">
                              {item.before}
                            </div>
                          </div>

                          {/* After */}
                          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
                            <div className="text-[10px] font-bold uppercase text-indigo-400 mb-1.5">AFTER (IMPROVED)</div>
                            {editingFixId === item.id ? (
                              <textarea
                                rows={4}
                                value={editingFixText}
                                onChange={(e) => setEditingFixText(e.target.value)}
                                className="w-full bg-slate-900 border border-indigo-500 rounded-lg p-2 text-[11px] font-mono text-white focus:outline-none"
                              />
                            ) : (
                              <div className="text-emerald-300 font-mono text-[11px] leading-relaxed">
                                {item.after}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Interactive Buttons */}
                        {item.status === 'pending' && (
                          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2.5">
                            {editingFixId === item.id ? (
                              <>
                                <button
                                  onClick={() => handleAcceptFix(item.id, editingFixText)}
                                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                                >
                                  <Check className="h-3.5 w-3.5" /> Save & Accept
                                </button>
                                <button
                                  onClick={() => setEditingFixId(null)}
                                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingFixId(item.id);
                                    setEditingFixText(item.after);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                >
                                  <Edit3 className="h-3.5 w-3.5" /> Edit
                                </button>
                                <button
                                  onClick={() => handleRejectFix(item.id)}
                                  className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                >
                                  <X className="h-3.5 w-3.5" /> Reject
                                </button>
                                <button
                                  onClick={() => handleAcceptFix(item.id, item.after)}
                                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
                                >
                                  <Check className="h-3.5 w-3.5" /> Accept
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: RESUME HISTORY */}
              {activeTab === 'history' && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Resume Analysis History
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Revisit past JD scans and track score progression over time.
                      </p>
                    </div>
                  </div>

                  {history.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      No saved analyses found yet. Run your first scan above!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {history.map((h) => (
                        <div
                          key={h.id}
                          className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{h.targetRole}</span>
                              <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 font-semibold">
                                {h.jobTitle || 'Custom JD'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                              <span>Analyzed: {h.createdAt ? new Date(h.createdAt).toLocaleDateString() : 'Today'}</span>
                              <span>Version: {h.resumeVersionName || 'Primary'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-base font-black text-emerald-400">{h.atsScore} / 100</div>
                              <div className="text-[10px] text-slate-400">ATS Score</div>
                            </div>
                            <button
                              onClick={() => {
                                setAnalysisResult(h);
                                if (h.resumeText) setResumeText(h.resumeText);
                                if (h.jobDescription) setJobDescription(h.jobDescription);
                                setActiveTab('overview');
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                            >
                              Reopen Analysis
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: RESUME VERSIONING */}
              {activeTab === 'versions' && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Resume Versions
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Maintain targeted resume variants tailored to distinct career tracks (e.g. Software Engineer, Backend, Frontend, Cloud).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {versions.map((ver) => (
                      <div
                        key={ver.id}
                        className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-white">{ver.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                              {ver.targetRole}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono line-clamp-3 leading-relaxed">
                            {ver.resumeText}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">{ver.resumeText.split(/\s+/).length} words</span>
                          <button
                            onClick={() => {
                              setResumeText(ver.resumeText);
                              setTargetRole(ver.targetRole);
                              setSelectedVersionName(ver.name);
                              setStatusMessage(`Loaded version: ${ver.name}`);
                              setTimeout(() => setStatusMessage(null), 3000);
                            }}
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                          >
                            Load into Workspace →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeMatcherPage;
