import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Eye, Trash2, Users as UsersIcon, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import DashboardHeader from '@/components/admin/DashboardHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import TeamDetailsModal from '@/components/admin/TeamDetailsModal';
import { getProjectAbstractById, PROJECT_ABSTRACTS } from '@/data/projectAbstracts';
import type { Team } from '@/types';
import { teamMemberCount } from '@/utils';

function teamSearchMatch(t: Team, q: string) {
  const project = getProjectAbstractById(t.selectedProjectId);
  const haystack = [
    t.teamName,
    t.leaderName,
    t.leaderEmail,
    t.college,
    t.department,
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

export default function AdminTeams() {
  const { user, teams, teamsLoading, deleteTeam, refreshTeams } = useAuth();
  const { success, error } = useToast();
  const [viewTeam, setViewTeam] = useState<Team | null>(null);
  const [deleteTeamState, setDeleteTeamState] = useState<Team | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    void refreshTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user || user.role !== 'admin') return <Navigate to="/admin" replace />;

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshTeams();
    setRefreshing(false);
    success('Teams refreshed', 'Loaded the latest registrations from the database.');
  };

  const confirmDelete = async () => {
    if (!deleteTeamState) return;
    setDeleting(true);
    const res = await deleteTeam(deleteTeamState.id);
    setDeleting(false);
    if (!res.ok) {
      error('Delete failed', res.message);
      return;
    }
    success('Team deleted', `${deleteTeamState.teamName} has been removed. That email can register again.`);
    setDeleteTeamState(null);
    await refreshTeams();
  };

  const columns = [
    {
      key: 'teamName',
      label: 'Team Name',
      render: (t: Team) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white">
            {t.teamName.slice(0, 2).toUpperCase()}
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">{t.teamName}</span>
        </div>
      ),
    },
    { key: 'leaderName', label: 'Leader', render: (t: Team) => <span className="text-slate-700 dark:text-slate-200">{t.leaderName}</span> },
    { key: 'leaderEmail', label: 'Email', render: (t: Team) => <span className="text-slate-500 dark:text-slate-400">{t.leaderEmail}</span> },
    { key: 'members', label: 'Members', render: (t: Team) => <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200"><UsersIcon className="h-3.5 w-3.5" /> {teamMemberCount(t)}</span> },
    { key: 'college', label: 'College', render: (t: Team) => <span className="text-slate-600 dark:text-slate-300">{t.college}</span> },
    {
      key: 'selectedProjectId',
      label: 'Problem',
      render: (t: Team) => {
        const project = getProjectAbstractById(t.selectedProjectId);
        if (!project) return <span className="text-slate-400">Not selected</span>;
        return (
          <div className="max-w-[220px]">
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
    { key: 'department', label: 'Department', render: (t: Team) => <span className="text-slate-600 dark:text-slate-300">{t.department}</span> },
    { key: 'submissionStatus', label: 'Status', render: (t: Team) => <StatusBadge status={t.submissionStatus} size="sm" /> },
  ];

  const filters = [
    { label: 'Submitted', value: 'submitted', test: (t: Team) => t.submissionStatus === 'submitted' },
    { label: 'In Progress', value: 'in_progress', test: (t: Team) => t.submissionStatus === 'in_progress' },
    { label: 'Not Started', value: 'not_started', test: (t: Team) => t.submissionStatus === 'not_started' },
    { label: 'Problem selected', value: 'has_problem', test: (t: Team) => Boolean(t.selectedProjectId) },
    { label: 'No problem', value: 'no_problem', test: (t: Team) => !t.selectedProjectId },
  ];

  const selectFilters = [
    PROBLEM_SELECT,
    {
      id: 'members',
      label: 'Members',
      options: [
        { label: 'All teams', value: 'all' },
        { label: 'Setup complete', value: 'complete' },
        { label: 'Setup incomplete', value: 'incomplete' },
      ],
      test: (t: Team, value: string) => {
        if (value === 'complete') return Boolean(t.membersComplete);
        if (value === 'incomplete') return !t.membersComplete;
        return true;
      },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <DashboardHeader
        title="Registered Teams"
        subtitle={teamsLoading ? 'Loading teams…' : `${teams.length} teams registered`}
        breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Teams' }]}
        actions={
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || teamsLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing || teamsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        }
      />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {teamsLoading && teams.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
            Loading registered teams…
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={teams}
            searchMatch={teamSearchMatch}
            searchPlaceholder="Search teams, leaders, colleges, problems…"
            filters={filters}
            selectFilters={selectFilters}
            actions={(t) => (
              <>
                <button onClick={() => setViewTeam(t)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-brand-100 hover:text-brand-600 dark:hover:bg-brand-900/30" title="View">
                  <Eye className="h-4 w-4" />
                </button>
                <button onClick={() => setDeleteTeamState(t)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/15" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          />
        )}
      </motion.div>

      <TeamDetailsModal open={!!viewTeam} onClose={() => setViewTeam(null)} team={viewTeam} />

      <Modal open={!!deleteTeamState} onClose={() => setDeleteTeamState(null)} title="Delete Team?" size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to permanently delete <strong className="text-slate-900 dark:text-white">{deleteTeamState?.teamName}</strong>? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setDeleteTeamState(null)} className="btn-secondary" disabled={deleting}>Cancel</button>
          <button onClick={confirmDelete} disabled={deleting} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-60">
            <Trash2 className="h-4 w-4" /> {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
