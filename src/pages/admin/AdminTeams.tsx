import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Eye, Trash2, Users as UsersIcon, RefreshCw, Download, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import DashboardHeader from '@/components/admin/DashboardHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import TeamDetailsModal from '@/components/admin/TeamDetailsModal';
import type { Team } from '@/types';
import { loadTeams, teamMemberCount } from '@/utils';

export default function AdminTeams() {
  const { user, teams, teamsLoading, deleteTeam, refreshTeams, recoverTeams } = useAuth();
  const { success, error } = useToast();
  const [viewTeam, setViewTeam] = useState<Team | null>(null);
  const [deleteTeamState, setDeleteTeamState] = useState<Team | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [recoverOpen, setRecoverOpen] = useState(false);
  const [recoverJson, setRecoverJson] = useState('');
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    void refreshTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user || user.role !== 'admin') return <Navigate to="/admin-login" replace />;

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshTeams();
    setRefreshing(false);
    success('Teams refreshed', 'Merged database + local registrations.');
  };

  const handleRecoverLocal = async () => {
    setRecovering(true);
    const local = loadTeams();
    const res = await recoverTeams(local);
    setRecovering(false);
    if (res.ok) {
      success('Local teams recovered', res.message);
      setRecoverOpen(false);
    } else {
      error('Recovery failed', res.message);
    }
  };

  const handleRecoverPaste = async () => {
    setRecovering(true);
    try {
      const parsed = JSON.parse(recoverJson);
      const list = Array.isArray(parsed) ? parsed : parsed?.teams;
      if (!Array.isArray(list)) {
        error('Invalid JSON', 'Paste an array of teams, or { "teams": [...] }.');
        setRecovering(false);
        return;
      }
      const res = await recoverTeams(list);
      if (res.ok) {
        success('Teams imported', res.message);
        setRecoverOpen(false);
        setRecoverJson('');
      } else {
        error('Import failed', res.message);
      }
    } catch {
      error('Invalid JSON', 'Could not parse the pasted text.');
    } finally {
      setRecovering(false);
    }
  };

  const confirmDelete = () => {
    if (!deleteTeamState) return;
    deleteTeam(deleteTeamState.id);
    success('Team deleted', `${deleteTeamState.teamName} has been removed.`);
    setDeleteTeamState(null);
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
    { key: 'department', label: 'Department', render: (t: Team) => <span className="text-slate-600 dark:text-slate-300">{t.department}</span> },
    { key: 'submissionStatus', label: 'Status', render: (t: Team) => <StatusBadge status={t.submissionStatus} size="sm" /> },
  ];

  const filters = [
    { label: 'Submitted', value: 'submitted', test: (t: Team) => t.submissionStatus === 'submitted' },
    { label: 'In Progress', value: 'in_progress', test: (t: Team) => t.submissionStatus === 'in_progress' },
    { label: 'Not Started', value: 'not_started', test: (t: Team) => t.submissionStatus === 'not_started' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <DashboardHeader
        title="Registered Teams"
        subtitle={teamsLoading ? 'Loading teams…' : `${teams.length} teams registered`}
        breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Teams' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRecoverOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 shadow-sm transition hover:bg-amber-100 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-200"
            >
              <Upload className="h-4 w-4" />
              Recover old teams
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing || teamsLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing || teamsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        }
      />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {teams.length === 0 && !teamsLoading && (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-100">
            No teams visible yet. Older registrations were stored in the browser that registered them.
            Use <strong>Recover old teams</strong> on that same browser, or paste the `sh_teams` JSON.
          </div>
        )}

        {teamsLoading && teams.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
            Loading registered teams…
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={teams}
            searchKeys={['teamName', 'leaderName', 'leaderEmail', 'college']}
            searchPlaceholder="Search teams, leaders, colleges…"
            filters={filters}
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
          <button onClick={() => setDeleteTeamState(null)} className="btn-secondary">Cancel</button>
          <button onClick={confirmDelete} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </Modal>

      <Modal open={recoverOpen} onClose={() => setRecoverOpen(false)} title="Recover previously registered teams" size="lg">
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Teams registered before the database sync fix were saved in browser storage (`sh_teams`), not the shared database.
            Recover them here, then they will appear in the admin list.
          </p>

          <button
            type="button"
            disabled={recovering}
            onClick={handleRecoverLocal}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {recovering ? 'Recovering…' : 'Recover from this browser’s localStorage'}
          </button>

          <div>
            <p className="mb-2 font-semibold text-slate-900 dark:text-white">Or paste teams JSON</p>
            <p className="mb-2 text-xs text-slate-500">
              On the registration browser: DevTools → Application → Local Storage → copy value of <code>sh_teams</code>
            </p>
            <textarea
              value={recoverJson}
              onChange={(e) => setRecoverJson(e.target.value)}
              rows={8}
              placeholder='[{"id":"team_...","teamName":"...","leaderEmail":"..."}]'
              className="input-field font-mono text-xs"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" onClick={() => setRecoverOpen(false)} className="btn-secondary">Cancel</button>
              <button
                type="button"
                disabled={recovering || !recoverJson.trim()}
                onClick={handleRecoverPaste}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-slate-900"
              >
                <Upload className="h-4 w-4" /> Import JSON
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
