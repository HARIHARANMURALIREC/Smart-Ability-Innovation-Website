import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, GraduationCap, FileCheck2, Clock, ArrowRight, Activity as ActivityIcon, Download } from 'lucide-react';
import { getIcon } from '@/utils/icons';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import DashboardHeader from '@/components/admin/DashboardHeader';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { BarChart } from '@/components/admin/Charts';
import { REGISTRATION_CHART, SUBMISSION_CHART, SAMPLE_ACTIVITIES } from '@/data';
import { teamMemberCount } from '@/utils';
import TeamDetailsModal from '@/components/admin/TeamDetailsModal';
import ExportTeamsModal from '@/components/admin/ExportTeamsModal';
import { getProjectAbstractById } from '@/data/projectAbstracts';
import type { Team } from '@/types';

export default function AdminDashboard() {
  const { user, teams, refreshTeams } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Team | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    void refreshTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user || user.role !== 'admin') return <Navigate to="/admin" replace />;

  const totalStudents = teams.reduce((s, t) => s + teamMemberCount(t), 0);
  const submitted = teams.filter((t) => t.submissionStatus === 'submitted').length;
  const pending = teams.length - submitted;

  const recentTeams = teams.slice(0, 5);

  const handleExportExcel = () => {
    setExportOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <DashboardHeader
        title="Admin Dashboard"
        subtitle="Overview of the entire innovation"
        breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Dashboard' }]}
        actions={
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={teams.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            Export Excel
          </button>
        }
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Stat cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Teams" value={teams.length} icon={Users} tone="brand" trend="+12% this week" to="/admin/teams" />
          <StatCard label="Total Students" value={totalStudents} icon={GraduationCap} tone="accent" trend="+8% growth" />
          <StatCard label="Submitted Projects" value={submitted} icon={FileCheck2} tone="emerald" trend="On track" to="/admin/submissions" />
          <StatCard label="Pending Projects" value={pending} icon={Clock} tone="amber" trend="Needs attention" />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Weekly Registrations</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Teams registered per day</p>
              </div>
              <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-bold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">+24%</span>
            </div>
            <BarChart data={REGISTRATION_CHART} color="from-brand-500 to-accent-500" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Weekly Submissions</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Projects submitted per week</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">+18%</span>
            </div>
            <BarChart data={SUBMISSION_CHART} color="from-emerald-500 to-sky-500" />
          </motion.div>
        </div>

        {/* Recent teams + activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Recently Registered Teams</h3>
              <button onClick={() => navigate('/admin/teams')} className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline dark:text-brand-300">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              {recentTeams.map((t) => (
                <button key={t.id} onClick={() => setSelected(t)} className="flex w-full items-center gap-3 rounded-xl border border-slate-200/60 bg-white/40 p-3 text-left transition-colors hover:border-brand-300 hover:bg-brand-50/40 dark:border-slate-700/60 dark:bg-slate-800/30 dark:hover:bg-slate-800/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
                    {t.teamName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{t.teamName}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {t.leaderName} · {teamMemberCount(t)} members
                      {(() => {
                        const project = getProjectAbstractById(t.selectedProjectId);
                        return project
                          ? ` · PS-${String(project.problemNumber).padStart(2, '0')}`
                          : ' · No problem';
                      })()}
                    </p>
                  </div>
                  <StatusBadge status={t.submissionStatus} size="sm" />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <ActivityIcon className="h-5 w-5 text-brand-600 dark:text-brand-300" />
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {SAMPLE_ACTIVITIES.slice(0, 5).map((a) => {
                const Icon = getIcon(a.icon);
                const toneCls: Record<string, string> = {
                  brand: 'bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300',
                  accent: 'bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-300',
                  sky: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300',
                  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
                  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
                };
                return (
                  <div key={a.id} className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneCls[a.tone]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">{a.title}</p>
                      <p className="text-[11px] text-slate-400">{a.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <TeamDetailsModal open={!!selected} onClose={() => setSelected(null)} team={selected} />

      <ExportTeamsModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        teams={teams}
        onExported={(count) => success('Export started', `Downloading Excel with ${count} teams.`)}
      />
    </div>
  );
}
