import { motion } from 'framer-motion';
import { Crown, Mail, Building2, GraduationCap, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Avatar from '@/components/ui/Avatar';
import StatusBadge from '@/components/ui/StatusBadge';
import SubmissionPdfActions from '@/components/admin/SubmissionPdfActions';
import type { Team } from '@/types';
import { teamMemberCount, statusLabel } from '@/utils';

interface Props {
  open: boolean;
  onClose: () => void;
  team: Team | null;
}

export default function TeamDetailsModal({ open, onClose, team }: Props) {
  if (!team) return null;
  return (
    <Modal open={open} onClose={onClose} title={team.teamName} subtitle={`Led by ${team.leaderName}`} size="lg">
      <div className="space-y-5">
        <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-brand-500/10 to-accent-500/10 p-4">
          <div className="flex items-center gap-3">
            <Avatar name={team.leaderName} size="lg" />
            <div>
              <p className="font-display text-base font-bold text-slate-900 dark:text-white">{team.leaderName}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{team.leaderEmail}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">
            <Crown className="h-3 w-3" /> Leader
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: Building2, label: 'College', value: team.college },
            { icon: GraduationCap, label: 'Department', value: team.department },
            { icon: Calendar, label: 'Year', value: team.year },
            { icon: Mail, label: 'Mobile', value: team.mobile },
          ].map((d) => (
            <div
              key={d.label}
              className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white/40 p-3 dark:border-slate-700/60 dark:bg-slate-800/30"
            >
              <d.icon className="h-5 w-5 text-brand-600 dark:text-brand-300" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{d.label}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{d.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4 className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-200">
            Team Members ({teamMemberCount(team)} total)
          </h4>
          <div className="space-y-2">
            {team.members.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white/40 p-2.5 dark:border-slate-700/60 dark:bg-slate-800/30"
              >
                <Avatar name={m.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{m.name}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{m.email}</p>
                </div>
                <span className="text-xs text-slate-400">#{i + 2}</span>
              </motion.div>
            ))}
            {team.members.length === 0 && (
              <p className="rounded-lg bg-slate-50 p-3 text-center text-sm text-slate-400 dark:bg-slate-800/40">
                No additional members
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/60 bg-white/40 p-4 dark:border-slate-700/60 dark:bg-slate-800/30">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Submission</h4>
            <StatusBadge status={team.submissionStatus} size="sm" />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-300" />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {team.pdfName ?? 'No file uploaded'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-brand-600 dark:text-brand-300" />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {statusLabel(team.submissionStatus)}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Calendar className="h-5 w-5 text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Submitted on:{' '}
                {team.submissionDate
                  ? new Date(team.submissionDate).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : '—'}
              </span>
            </div>
            {team.pdfUrl && (
              <div className="sm:col-span-2">
                <SubmissionPdfActions pdfUrl={team.pdfUrl} pdfName={team.pdfName} teamName={team.teamName} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
