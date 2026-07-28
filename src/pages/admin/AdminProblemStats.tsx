import { useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbulb, Lock, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import DashboardHeader from '@/components/admin/DashboardHeader';
import StatCard from '@/components/ui/StatCard';
import { BarChart } from '@/components/admin/Charts';
import {
  PROJECT_ABSTRACTS,
  countTeamsPerProblem,
} from '@/data/projectAbstracts';
import { MAX_TEAMS_PER_PROBLEM } from '@/utils';
import type { Team } from '@/types';

export default function AdminProblemStats() {
  const { user, teams, refreshTeams } = useAuth();

  useEffect(() => {
    void refreshTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user || user.role !== 'admin') return <Navigate to="/admin" replace />;

  const counts = useMemo(() => countTeamsPerProblem(teams), [teams]);

  const rows = useMemo(
    () =>
      PROJECT_ABSTRACTS.map((project) => {
        const registered = counts[project.id] ?? 0;
        const teamsOnProblem = teams.filter((t) => t.selectedProjectId === project.id);
        const isFull = registered >= MAX_TEAMS_PER_PROBLEM;
        const isHardware = project.domain === 'Hardware/IoT';

        return {
          project,
          registered,
          teamsOnProblem,
          isFull,
          isHardware,
          seatsLeft: Math.max(0, MAX_TEAMS_PER_PROBLEM - registered),
        };
      }),
    [counts, teams],
  );

  const totalSelected = teams.filter((t) => t.selectedProjectId).length;
  const noSelection = teams.length - totalSelected;
  const fullProblems = rows.filter((r) => r.isFull).length;

  const chartData = rows.map((r) => ({
    label: `PS-${String(r.project.problemNumber).padStart(2, '0')}`,
    value: r.registered,
  }));

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <DashboardHeader
        title="Problem Statements"
        subtitle="Team registrations per problem statement"
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Problem Statements' },
        ]}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Teams"
            value={teams.length}
            icon={Users}
            tone="brand"
          />
          <StatCard
            label="With PS Selected"
            value={totalSelected}
            icon={Lightbulb}
            tone="accent"
          />
          <StatCard
            label="No PS Yet"
            value={noSelection}
            icon={Users}
            tone="amber"
          />
          <StatCard
            label="Full (Locked)"
            value={fullProblems}
            icon={Lock}
            tone="emerald"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="mb-5">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Registrations by Problem
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Max {MAX_TEAMS_PER_PROBLEM} teams per problem statement
            </p>
          </div>
          <BarChart data={chartData} color="from-brand-500 to-accent-500" height={220} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="space-y-4"
        >
          {rows.map((row, index) => (
            <ProblemRow key={row.project.id} row={row} index={index} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function ProblemRow({
  row,
  index,
}: {
  row: {
    project: (typeof PROJECT_ABSTRACTS)[number];
    registered: number;
    teamsOnProblem: Team[];
    isFull: boolean;
    isHardware: boolean;
    seatsLeft: number;
  };
  index: number;
}) {
  const { project, registered, teamsOnProblem, isFull, isHardware, seatsLeft } = row;
  const fillPercent = Math.min(100, (registered / MAX_TEAMS_PER_PROBLEM) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`glass-card overflow-hidden p-5 ${
        isFull ? 'ring-1 ring-rose-300/60 dark:ring-rose-500/30' : ''
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-600 text-sm font-bold text-white">
              {project.problemNumber}
            </span>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              PS-{String(project.problemNumber).padStart(2, '0')}: {project.title}
            </h3>
            {isFull && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                <Lock className="h-3 w-3" /> Locked
              </span>
            )}
            {isHardware && (
              <span className="rounded-full bg-lime-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-lime-800 dark:bg-lime-900/30 dark:text-lime-300">
                Hardware
              </span>
            )}
          </div>

          <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
            {project.domain} · {project.difficulty}
          </p>

          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {registered} / {MAX_TEAMS_PER_PROBLEM} teams
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {isFull ? 'Full' : `${seatsLeft} seats left`}
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className={`h-full rounded-full transition-all ${
                isFull
                  ? 'bg-gradient-to-r from-rose-500 to-rose-600'
                  : 'bg-gradient-to-r from-brand-500 to-accent-500'
              }`}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>

        <div className="w-full shrink-0 lg:w-72">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Registered Teams
          </p>
          {teamsOnProblem.length > 0 ? (
            <ul className="max-h-32 space-y-1.5 overflow-y-auto">
              {teamsOnProblem.map((team) => (
                <li
                  key={team.id}
                  className="rounded-lg border border-slate-200/60 bg-white/50 px-3 py-2 text-sm dark:border-slate-700/60 dark:bg-slate-800/40"
                >
                  <p className="font-semibold text-slate-900 dark:text-white">{team.teamName}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {team.leaderName} · {team.college}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-dashed border-slate-300 px-3 py-4 text-center text-sm text-slate-400 dark:border-slate-700">
              No teams yet
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
