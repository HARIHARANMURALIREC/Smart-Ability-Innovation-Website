import { motion } from 'framer-motion';
import {
  Trophy,
  Users,
  Building2,
  GraduationCap,
  Calendar,
  FileText,
  Crown,
  CheckCircle2,
} from 'lucide-react';
import { teamProgress, teamMemberCount, statusLabel } from '@/utils';
import DashboardHeader from '@/components/admin/DashboardHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import Avatar from '@/components/ui/Avatar';
import Progress from '@/components/ui/Progress';
import { useStudentTeam } from '@/hooks';

function DetailRow({ icon: Icon, label, value }: { icon: typeof Trophy; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white/40 p-3 dark:border-slate-700/60 dark:bg-slate-800/30">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500/15 to-accent-500/15 ring-1 ring-brand-500/20">
        <Icon className="h-5 w-5 text-brand-600 dark:text-brand-300" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

export default function StudentTeam() {
  const team = useStudentTeam();
  const progress = teamProgress(team);

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="My Team"
        subtitle={`Full breakdown of ${team.teamName}`}
        breadcrumbs={[{ label: 'Student', to: '/student/dashboard' }, { label: 'My Team' }]}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card relative overflow-hidden p-6 sm:p-8"
        >
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 shadow-glow">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{team.teamName}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Led by {team.leaderName}</p>
              </div>
            </div>
            <StatusBadge status={team.submissionStatus} />
          </div>

          <div className="relative mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Team Progress</span>
              <span className="text-sm font-bold text-brand-600 dark:text-brand-300">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailRow icon={Trophy} label="Team Name" value={team.teamName} />
          <DetailRow icon={Crown} label="Team Leader" value={team.leaderName} />
          <DetailRow icon={Building2} label="College" value={team.college} />
          <DetailRow icon={GraduationCap} label="Department" value={team.department} />
          <DetailRow icon={Calendar} label="Year" value={team.year} />
          <DetailRow icon={Users} label="Total Members" value={String(teamMemberCount(team))} />
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="mb-4 font-display text-base font-bold text-slate-900 dark:text-white">Team Members</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-brand-200/60 bg-brand-50/40 p-3 dark:border-brand-800/40 dark:bg-brand-900/15">
              <Avatar name={team.leaderName} size="md" />
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{team.leaderName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{team.leaderEmail}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white">
                <Crown className="h-3 w-3" /> Leader
              </span>
            </div>
            {team.members.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white/40 p-3 dark:border-slate-700/60 dark:bg-slate-800/30"
              >
                <Avatar name={m.name} size="md" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{m.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{m.email}</p>
                </div>
                <span className="text-xs font-medium text-slate-400">Member {i + 2}</span>
              </div>
            ))}
            {team.members.length === 0 && (
              <p className="rounded-xl bg-slate-50/60 p-4 text-center text-sm text-slate-400 dark:bg-slate-800/40">
                No additional members added.
              </p>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="mb-4 font-display text-base font-bold text-slate-900 dark:text-white">Submission Status</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white/40 p-4 dark:border-slate-700/60 dark:bg-slate-800/30">
              <FileText className="h-6 w-6 text-brand-600 dark:text-brand-300" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Uploaded PDF</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {team.pdfName ?? 'Not uploaded yet'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white/40 p-4 dark:border-slate-700/60 dark:bg-slate-800/30">
              <CheckCircle2 className="h-6 w-6 text-brand-600 dark:text-brand-300" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {statusLabel(team.submissionStatus)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
