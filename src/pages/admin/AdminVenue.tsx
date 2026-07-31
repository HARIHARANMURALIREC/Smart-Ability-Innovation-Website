import { motion } from 'framer-motion';
import DashboardHeader from '@/components/admin/DashboardHeader';
import { useTheme } from '@/context/ThemeContext';

export default function AdminVenue() {
  const { theme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        title="Venue & Seating"
        subtitle="Hall seating chart for Rooms Anew201 & Anew202"
        breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Venue' }]}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 px-2 py-3 sm:px-4"
      >
        <iframe
          key={theme}
          src={`/seating-chart.html?theme=${theme}`}
          title="SmartAbility 2026 — Seating Chart"
          className="h-[calc(100vh-9rem)] w-full rounded-2xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-800 dark:bg-black"
        />
      </motion.div>
    </div>
  );
}
