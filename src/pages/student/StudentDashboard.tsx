import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Users,
  Building2,
  GraduationCap,
  Calendar,
  FileText,
  ArrowRight,
  Info,
  Lightbulb,
  Upload,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { teamProgress, teamMemberCount } from '@/utils';
import { SAMPLE_NOTIFICATIONS } from '@/data';
import { PROJECT_ABSTRACTS } from '@/data/projectAbstracts';
import DashboardHeader from '@/components/admin/DashboardHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import Avatar from '@/components/ui/Avatar';
import Progress from '@/components/ui/Progress';
import { useStudentTeam } from '@/hooks';

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100/60 py-2.5 last:border-0 dark:border-slate-800/60">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
        <Icon className="h-4 w-4 text-brand-600 dark:text-brand-300" />
      </div>
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="ml-auto text-sm font-semibold text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const team = useStudentTeam();

  if (!user) return null;

  const progress = teamProgress(team);
  const memberCount = teamMemberCount(team);
  const selectedProject = team.selectedProjectId
    ? PROJECT_ABSTRACTS.find((p) => p.id === team.selectedProjectId)
    : null;

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title={`Welcome, ${user.name.split(' ')[0]}!`}
        subtitle="Here's your team overview and submission status"
        breadcrumbs={[{ label: 'Student', to: '/student/dashboard' }, { label: 'Dashboard' }]}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar name={user.name} size="xl" />
              <h2 className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-white">{user.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
              <span
                className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  user.isLeader
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <Trophy className="h-3.5 w-3.5" /> {user.isLeader ? 'Team Leader' : 'Team Member'}
              </span>
            </div>
            <div className="mt-6 space-y-1">
              <InfoRow icon={Trophy} label="Team" value={team.teamName} />
              <InfoRow icon={Users} label="Members" value={String(memberCount)} />
              <InfoRow icon={Building2} label="College" value={team.college} />
              <InfoRow icon={GraduationCap} label="Department" value={team.department} />
              <InfoRow icon={Calendar} label="Year" value={team.year} />
            </div>
            <Link to="/student/team" className="btn-secondary mt-5 w-full">
              View Team Details <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="space-y-6 lg:col-span-2"
          >
            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{team.teamName}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Submission status</p>
                </div>
                <StatusBadge status={team.submissionStatus} />
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Team Progress</span>
                  <span className="text-sm font-bold text-brand-600 dark:text-brand-300">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-100/60 p-3 text-center dark:bg-slate-800/40">
                  <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">{memberCount}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Members</p>
                </div>
                <div className="rounded-xl bg-slate-100/60 p-3 text-center dark:bg-slate-800/40">
                  <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                    {selectedProject ? '1' : '0'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Project</p>
                </div>
                <div className="rounded-xl bg-slate-100/60 p-3 text-center dark:bg-slate-800/40">
                  <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                    {team.pdfName ? '1' : '0'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">PDFs</p>
                </div>
              </div>

              {selectedProject && (
                <div className="mt-4 rounded-xl border border-emerald-200/60 bg-emerald-50/60 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">Selected problem</p>
                  <p className="mt-0.5 text-sm font-bold text-emerald-900 dark:text-emerald-100">
                    #{selectedProject.problemNumber} · {selectedProject.title}
                  </p>
                </div>
              )}

              {team.pdfName && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/50 p-3 dark:border-slate-700/60 dark:bg-slate-800/30">
                  <FileText className="h-5 w-5 text-brand-600 dark:text-brand-300" />
                  <span className="flex-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {team.pdfName}
                  </span>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                to="/student/problems"
                className="glass-card flex items-center gap-3 p-4 transition-colors hover:border-brand-300 hover:bg-brand-50/40 dark:hover:bg-brand-900/10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/30">
                  <Lightbulb className="h-5 w-5 text-brand-600 dark:text-brand-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Problem Statements</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Browse & select a project</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link
                to="/student/submission"
                className="glass-card flex items-center gap-3 p-4 transition-colors hover:border-brand-300 hover:bg-brand-50/40 dark:hover:bg-brand-900/10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-100 dark:bg-accent-900/30">
                  <Upload className="h-5 w-5 text-accent-600 dark:text-accent-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">PDF Submission</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Upload your abstract PDF</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-brand-600 dark:text-brand-300" />
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Notifications</h3>
          </div>
          <div className="space-y-3">
            {SAMPLE_NOTIFICATIONS.map((n) => (
              <div
                key={n.id}
                className={`flex gap-3 rounded-xl p-3 ${
                  n.read ? 'bg-slate-50/60 dark:bg-slate-800/30' : 'bg-brand-50/40 dark:bg-brand-900/10'
                }`}
              >
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    n.tone === 'warning'
                      ? 'bg-amber-500'
                      : n.tone === 'success'
                        ? 'bg-emerald-500'
                        : 'bg-sky-500'
                  }`}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{n.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{n.body}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
