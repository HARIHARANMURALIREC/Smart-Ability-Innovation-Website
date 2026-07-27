import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Users, FileCheck2, Building2, Award } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import DashboardHeader from '@/components/admin/DashboardHeader';
import StatCard from '@/components/ui/StatCard';
import { BarChart, DonutChart } from '@/components/admin/Charts';
import { REGISTRATION_CHART, SUBMISSION_CHART, DEPARTMENT_DISTRIBUTION } from '@/data';
import { teamMemberCount } from '@/utils';

export default function AdminAnalytics() {
  const { user, teams } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/admin" replace />;

  const totalStudents = teams.reduce((s, t) => s + teamMemberCount(t), 0);
  const submitted = teams.filter((t) => t.submissionStatus === 'submitted').length;
  const colleges = new Set(teams.map((t) => t.college)).size;
  const submissionRate = teams.length ? Math.round((submitted / teams.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <DashboardHeader
        title="Analytics"
        subtitle="Deep dive into innovation metrics"
        breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Analytics' }]}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Teams" value={teams.length} icon={Users} tone="brand" />
          <StatCard label="Total Students" value={totalStudents} icon={TrendingUp} tone="accent" />
          <StatCard label="Submission Rate" value={submissionRate} icon={FileCheck2} tone="emerald" trend={`${submissionRate}% completed`} />
          <StatCard label="Colleges" value={colleges} icon={Building2} tone="sky" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 lg:col-span-2">
            <div className="mb-5">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Registration Trend</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daily team registrations over the week</p>
            </div>
            <BarChart data={REGISTRATION_CHART} color="from-brand-500 to-accent-500" height={220} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card p-6">
            <div className="mb-5">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Department Mix</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Teams by department</p>
            </div>
            <DonutChart data={DEPARTMENT_DISTRIBUTION} />
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="mb-5">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Submission Velocity</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Projects submitted per week</p>
            </div>
            <BarChart data={SUBMISSION_CHART} color="from-emerald-500 to-sky-500" height={220} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card p-6">
            <h3 className="mb-4 font-display text-base font-bold text-slate-900 dark:text-white">Top Performing Colleges</h3>
            <div className="space-y-3">
              {Array.from(new Set(teams.map((t) => t.college))).slice(0, 5).map((college, i) => {
                const collegeTeams = teams.filter((t) => t.college === college);
                const collegeSubmitted = collegeTeams.filter((t) => t.submissionStatus === 'submitted').length;
                const rate = collegeTeams.length ? Math.round((collegeSubmitted / collegeTeams.length) * 100) : 0;
                return (
                  <div key={college} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white">{i + 1}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{college}</p>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${rate}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{rate}%</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-brand-500 shadow-glow">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Innovation Health</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {submissionRate >= 60 ? 'On track — submissions are progressing well.' : submissionRate >= 30 ? 'Moderate pace — encourage teams to submit soon.' : 'Low submission rate — consider sending reminders.'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
