import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Existing Pages
import AuthPage from './pages/AuthPage';
import CatalogPage from './pages/CatalogPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LecturePlayerPage from './pages/LecturePlayerPage';
import QuizPage from './pages/QuizPage';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';

// AI Platform Expansion Pages
import OnboardingPage from './pages/OnboardingPage';
import RoadmapPage from './pages/RoadmapPage';
import SkillGapPage from './pages/SkillGapPage';
import CodingPlaygroundPage from './pages/CodingPlaygroundPage';
import ProjectsPage from './pages/ProjectsPage';
import ResumeMatcherPage from './pages/ResumeMatcherPage';
import InterviewSimulatorPage from './pages/InterviewSimulatorPage';
import PlacementHubPage from './pages/PlacementHubPage';
import ArenaPage from './pages/ArenaPage';
import ProfilePage from './pages/ProfilePage';

import LandingPage from './pages/LandingPage';
import AuthenticatedLayout from './components/Layout/AuthenticatedLayout';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Marketing & Entry Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>

          {/* Protected Connected Platform Application Shell with Omnipresent Navigation */}
          <Route element={<ProtectedRoute allowedRoles={['student', 'instructor']} />}>
            <Route element={<AuthenticatedLayout />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/instructor" element={<InstructorDashboard />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/skills/gap-analysis" element={<SkillGapPage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/courses" element={<CatalogPage />} />
              <Route path="/courses/:courseId" element={<CourseDetailPage />} />
              <Route path="/courses/:courseId/lectures/:lectureId" element={<LecturePlayerPage />} />
              <Route path="/courses/:courseId/quiz/:quizId" element={<QuizPage />} />
              <Route path="/quiz/:quizId" element={<QuizPage />} />
              <Route path="/playground" element={<CodingPlaygroundPage />} />
              <Route path="/coding/:slug?" element={<CodingPlaygroundPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/placement-hub" element={<PlacementHubPage />} />
              <Route path="/arena" element={<ArenaPage />} />
              <Route path="/resume" element={<ResumeMatcherPage />} />
              <Route path="/interview" element={<InterviewSimulatorPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
