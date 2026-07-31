import { motion } from 'framer-motion';
import DashboardHeader from '@/components/admin/DashboardHeader';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export default function StudentVenue() {
  const { theme } = useTheme();
  const { user, teams } = useAuth();

  const myTeamName = user?.teamId
    ? (teams.find((t) => t.id === user.teamId)?.teamName ?? '')
    : '';

  const chartSrc = `/seating-chart.html?theme=${theme}${
    myTeamName ? `&myteam=${encodeURIComponent(myTeamName)}` : ''
  }`;

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        title="Venue & Seating"
        subtitle="Find your team's table in Rooms Anew201 & Anew202"
        breadcrumbs={[{ label: 'Student', to: '/student/dashboard' }, { label: 'Venue' }]}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 px-2 py-3 sm:px-4"
      >
        <iframe
          key={chartSrc}
          src={chartSrc}
          title="SmartAbility 2026 — Seating Chart"
          className="h-[calc(100vh-9rem)] w-full rounded-2xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-800 dark:bg-black"
        />
      </motion.div>
    </div>
  );
}
