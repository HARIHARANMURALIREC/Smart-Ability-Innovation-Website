import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Crown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import DashboardHeader from '@/components/admin/DashboardHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import SubmissionPdfActions from '@/components/admin/SubmissionPdfActions';
import { getProjectAbstractById, PROJECT_ABSTRACTS } from '@/data/projectAbstracts';
import type { Team } from '@/types';

function submissionSearchMatch(t: Team, q: string) {
  const project = getProjectAbstractById(t.selectedProjectId);
  const haystack = [
    t.teamName,
    t.leaderName,
    t.pdfName,
    t.selectedProjectId,
    project ? `PS-${String(project.problemNumber).padStart(2, '0')}` : '',
    project?.title ?? '',
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

const PROBLEM_SELECT = {
  id: 'problem',
  label: 'Problem',
  options: [
    { label: 'All problems', value: 'all' },
    { label: 'Not selected', value: 'none' },
    ...PROJECT_ABSTRACTS.map((p) => ({
      label: `PS-${String(p.problemNumber).padStart(2, '0')} — ${p.title}`,
      value: p.id,
    })),
  ],
  test: (t: Team, value: string) => {
    if (value === 'none') return !t.selectedProjectId;
    return t.selectedProjectId === value;
  },
};

export default function AdminSubmissions() {
  const { user, teams } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/admin" replace />;

  const submitted = teams.filter((t) => t.submissionStatus === 'submitted');

  const columns = [
    {
      key: 'teamName',
      label: 'Team',
      render: (t: Team) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white">
            {t.teamName.slice(0, 2).toUpperCase()}
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">{t.teamName}</span>
        </div>
      ),
    },
    {
      key: 'leaderName',
      label: 'Leader',
      render: (t: Team) => (
        <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
          <Crown className="h-3.5 w-3.5 text-amber-500" /> {t.leaderName}
        </span>
      ),
    },
    {
      key: 'selectedProjectId',
      label: 'Problem',
      render: (t: Team) => {
        const project = getProjectAbstractById(t.selectedProjectId);
        if (!project) return <span className="text-slate-400">Not selected</span>;
        return (
          <div className="max-w-[240px]">
            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
              PS-{String(project.problemNumber).padStart(2, '0')}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400" title={project.title}>
              {project.title}
            </p>
          </div>
        );
      },
    },
    {
      key: 'pdfName',
      label: 'PDF',
      render: (t: Team) =>
        t.pdfName ? (
          <span className="inline-flex max-w-[180px] items-center gap-1.5 truncate text-slate-700 dark:text-slate-200">
            <FileText className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-300" />
            <span className="truncate">{t.pdfName}</span>
          </span>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      key: 'pdfUrl',
      label: 'Actions',
      render: (t: Team) => (
        <SubmissionPdfActions pdfUrl={t.pdfUrl} pdfName={t.pdfName} teamName={t.teamName} />
      ),
    },
    {
      key: 'submissionStatus',
      label: 'Status',
      render: (t: Team) => <StatusBadge status={t.submissionStatus} size="sm" />,
    },
    {
      key: 'submissionDate',
      label: 'Submitted On',
      render: (t: Team) => (
        <span className="text-slate-500 dark:text-slate-400">
          {t.submissionDate
            ? new Date(t.submissionDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : '—'}
        </span>
      ),
    },
  ];

  const filters = [
    { label: 'Submitted', value: 'submitted', test: (t: Team) => t.submissionStatus === 'submitted' },
    { label: 'In Progress', value: 'in_progress', test: (t: Team) => t.submissionStatus === 'in_progress' },
    { label: 'Not Started', value: 'not_started', test: (t: Team) => t.submissionStatus === 'not_started' },
    { label: 'Has PDF', value: 'has_pdf', test: (t: Team) => Boolean(t.pdfName || t.pdfUrl) },
    { label: 'No PDF', value: 'no_pdf', test: (t: Team) => !t.pdfName && !t.pdfUrl },
  ];

  const selectFilters = [PROBLEM_SELECT];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <DashboardHeader
        title="Submissions"
        subtitle={`${submitted.length} of ${teams.length} projects submitted`}
        breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Submissions' }]}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
      >
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="glass-card flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/15">
              <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-slate-900 dark:text-white">{submitted.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Submitted</p>
            </div>
          </div>
          <div className="glass-card flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-500/15">
              <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-slate-900 dark:text-white">
                {teams.filter((t) => t.submissionStatus === 'in_progress').length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">In Progress</p>
            </div>
          </div>
          <div className="glass-card flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              <FileText className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-slate-900 dark:text-white">
                {teams.filter((t) => t.submissionStatus === 'not_started').length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Not Started</p>
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={teams}
          searchMatch={submissionSearchMatch}
          searchPlaceholder="Search teams, leaders, problems, PDFs…"
          filters={filters}
          selectFilters={selectFilters}
          emptyMessage="No submissions match your filters."
        />
      </motion.div>
    </div>
  );
}
