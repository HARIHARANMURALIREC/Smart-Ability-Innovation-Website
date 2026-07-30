import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { PROJECT_ABSTRACTS } from '@/data/projectAbstracts';
import type { Team } from '@/types';
import {
  DEFAULT_TEAM_EXPORT_FILTERS,
  exportTeamsToExcel,
  filterTeamsForExport,
  getUniqueDepartments,
  type TeamExportFilters,
} from '@/utils/exportTeamsExcel';

interface ExportTeamsModalProps {
  open: boolean;
  onClose: () => void;
  teams: Team[];
  onExported?: (count: number) => void;
}

const selectClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200';

export default function ExportTeamsModal({ open, onClose, teams, onExported }: ExportTeamsModalProps) {
  const [filters, setFilters] = useState<TeamExportFilters>(DEFAULT_TEAM_EXPORT_FILTERS);
  const [exporting, setExporting] = useState(false);

  const departments = useMemo(() => getUniqueDepartments(teams), [teams]);
  const matchingCount = useMemo(() => filterTeamsForExport(teams, filters).length, [teams, filters]);

  const updateFilter = <K extends keyof TeamExportFilters>(key: K, value: TeamExportFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleExport = async () => {
    if (matchingCount === 0) return;

    setExporting(true);
    try {
      await exportTeamsToExcel(teams, { filters });
      onExported?.(matchingCount);
      onClose();
      setFilters(DEFAULT_TEAM_EXPORT_FILTERS);
    } finally {
      setExporting(false);
    }
  };

  const handleClose = () => {
    if (exporting) return;
    onClose();
    setFilters(DEFAULT_TEAM_EXPORT_FILTERS);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Export Teams to Excel"
      subtitle="Choose filters before downloading. The sheet will include auto-filters on all columns."
      size="lg"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Submission Status
          </span>
          <select
            value={filters.submissionStatus}
            onChange={(e) => updateFilter('submissionStatus', e.target.value as TeamExportFilters['submissionStatus'])}
            className={selectClass}
          >
            <option value="all">All statuses</option>
            <option value="submitted">Submitted</option>
            <option value="in_progress">In Progress</option>
            <option value="not_started">Not Started</option>
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Problem Statement
          </span>
          <select
            value={filters.problemStatement}
            onChange={(e) => updateFilter('problemStatement', e.target.value)}
            className={selectClass}
          >
            <option value="all">All problems</option>
            <option value="selected">PS selected teams</option>
            <option value="none">Not selected</option>
            {PROJECT_ABSTRACTS.map((p) => (
              <option key={p.id} value={p.id}>
                PS-{String(p.problemNumber).padStart(2, '0')} — {p.title}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Members Setup
          </span>
          <select
            value={filters.membersSetup}
            onChange={(e) => updateFilter('membersSetup', e.target.value as TeamExportFilters['membersSetup'])}
            className={selectClass}
          >
            <option value="all">All teams</option>
            <option value="complete">Setup complete</option>
            <option value="incomplete">Setup incomplete</option>
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            PDF Submitted
          </span>
          <select
            value={filters.pdfSubmitted}
            onChange={(e) => updateFilter('pdfSubmitted', e.target.value as TeamExportFilters['pdfSubmitted'])}
            className={selectClass}
          >
            <option value="all">All teams</option>
            <option value="yes">PDF submitted</option>
            <option value="no">No PDF</option>
          </select>
        </label>

        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Department
          </span>
          <select
            value={filters.department}
            onChange={(e) => updateFilter('department', e.target.value)}
            className={selectClass}
          >
            <option value="all">All departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 rounded-xl border border-slate-200/60 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 dark:border-slate-700/60 dark:bg-slate-800/40 dark:text-slate-300">
        <span className="font-semibold text-slate-900 dark:text-white">{matchingCount}</span> of{' '}
        <span className="font-semibold text-slate-900 dark:text-white">{teams.length}</span> teams will be exported.
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={handleClose} disabled={exporting} className="btn-secondary">
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void handleExport()}
          disabled={exporting || matchingCount === 0}
          className="btn-primary"
        >
          <Download className="h-4 w-4" />
          {exporting ? 'Exporting…' : 'Export Excel'}
        </button>
      </div>
    </Modal>
  );
}
