import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import StudentSidebar from '@/components/student/StudentSidebar';
import BgWatermark from '@/components/ui/BgWatermark';

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
    <div className="relative flex min-h-screen bg-slate-100 dark:bg-slate-950">
      <BgWatermark />
      <StudentSidebar />
      <div key={location.pathname} className="relative z-10 min-w-0 flex-1 animate-fade-in">
        <Outlet context={{ team }} />
      </div>
    </div>
  );
}
