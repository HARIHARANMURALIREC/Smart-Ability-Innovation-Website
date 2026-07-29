import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import StudentSidebar from '@/components/student/StudentSidebar';

export default function StudentLayout() {
  const { user, teams } = useAuth();
  const location = useLocation();

  if (!user || user.role !== 'student') {
    return <Navigate to="/student-login" replace />;
  }

  const team = teams.find((t) => t.id === user.teamId);
  if (!team) {
    return <Navigate to="/student-login" replace />;
  }

  if (user.isLeader && !team.membersComplete) {
    return <Navigate to="/student/setup-members" replace />;
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-100 dark:bg-black lg:flex-row">
      <StudentSidebar />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <div key={location.pathname} className="min-w-0 flex-1 animate-fade-in">
          <Outlet context={{ team }} />
        </div>
        <footer className="border-t border-slate-200/60 px-4 py-5 dark:border-slate-800/60">
          <p className="flex items-center justify-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            Developed with
            <Heart className="heart-multicolor h-4 w-4" fill="currentColor" stroke="currentColor" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">TEAM OG</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
