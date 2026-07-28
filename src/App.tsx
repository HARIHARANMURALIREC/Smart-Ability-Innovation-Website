import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import ProtectedRoute from '@/routes/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import { CardSkeleton } from '@/components/ui/Skeleton';

const PublicLayout = lazy(() => import('@/layouts/PublicLayout'));
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'));
const StudentLayout = lazy(() => import('@/layouts/StudentLayout'));
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const StudentDashboard = lazy(() => import('@/pages/student/StudentDashboard'));
const StudentProblems = lazy(() => import('@/pages/student/StudentProblems'));
const StudentSubmission = lazy(() => import('@/pages/student/StudentSubmission'));
const StudentTeam = lazy(() => import('@/pages/student/StudentTeam'));
const StudentDocuments = lazy(() => import('@/pages/student/StudentDocuments'));
const TeamMembersSetupPage = lazy(() => import('@/pages/TeamMembersSetupPage'));
const MemberRegisterPage = lazy(() => import('@/pages/MemberRegisterPage'));
const TeamLeaderRegisterPage = lazy(() => import('@/pages/TeamLeaderRegisterPage'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminTeams = lazy(() => import('@/pages/admin/AdminTeams'));
const AdminSubmissions = lazy(() => import('@/pages/admin/AdminSubmissions'));
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics'));
const AdminProblemStats = lazy(() => import('@/pages/admin/AdminProblemStats'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/features', element: <LandingPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/register-team-leader', element: <TeamLeaderRegisterPage /> },
      { path: '/member-register', element: <MemberRegisterPage /> },
      { path: '/student-login', element: <LoginPage /> },
      { path: '/admin-login', element: <Navigate to="/admin" replace /> },
    ],
  },
  {
    path: '/student/setup-members',
    element: (
      <ProtectedRoute role="student">
        <TeamMembersSetupPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/student',
    element: (
      <ProtectedRoute role="student">
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <StudentDashboard /> },
      { path: 'problems', element: <StudentProblems /> },
      { path: 'submission', element: <StudentSubmission /> },
      { path: 'team', element: <StudentTeam /> },
      { path: 'documents', element: <StudentDocuments /> },
    ],
  },
  {
    path: '/team-details',
    element: <Navigate to="/student/team" replace />,
  },
  {
    path: '/admin',
    children: [
      { index: true, element: <AdminLoginPage /> },
      {
        element: (
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'teams', element: <AdminTeams /> },
          { path: 'submissions', element: <AdminSubmissions /> },
          { path: 'problems', element: <AdminProblemStats /> },
          { path: 'analytics', element: <AdminAnalytics /> },
          { path: 'settings', element: <AdminSettings /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Suspense fallback={<PageFallback />}>
              <RouterProvider router={router} />
            </Suspense>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
