import type { Team, SubmissionStatus } from '@/types';
import { getProjectAbstractById, PROJECT_ABSTRACTS } from '@/data/projectAbstracts';
import { statusLabel, teamMemberCount } from '@/utils';

export interface TeamExportFilters {
  submissionStatus: 'all' | SubmissionStatus;
  /** all | selected (any PS) | none | specific project id */
  problemStatement: 'all' | 'selected' | 'none' | string;
  membersSetup: 'all' | 'complete' | 'incomplete';
  department: 'all' | string;
  pdfSubmitted: 'all' | 'yes' | 'no';
}

export const DEFAULT_TEAM_EXPORT_FILTERS: TeamExportFilters = {
  submissionStatus: 'all',
  problemStatement: 'all',
  membersSetup: 'all',
  department: 'all',
  pdfSubmitted: 'all',
};

export function filterTeamsForExport(teams: Team[], filters: TeamExportFilters): Team[] {
  return teams.filter((team) => {
    if (filters.submissionStatus !== 'all' && team.submissionStatus !== filters.submissionStatus) {
      return false;
    }

    if (filters.problemStatement === 'none' && team.selectedProjectId) return false;
    if (filters.problemStatement === 'selected' && !team.selectedProjectId) return false;
    if (
      filters.problemStatement !== 'all' &&
      filters.problemStatement !== 'none' &&
      filters.problemStatement !== 'selected' &&
      team.selectedProjectId !== filters.problemStatement
    ) {
      return false;
    }

    if (filters.membersSetup === 'complete' && !team.membersComplete) return false;
    if (filters.membersSetup === 'incomplete' && team.membersComplete) return false;

    if (filters.department !== 'all' && team.department !== filters.department) return false;

    if (filters.pdfSubmitted === 'yes' && !team.pdfName) return false;
    if (filters.pdfSubmitted === 'no' && team.pdfName) return false;

    return true;
  });
}

export function getUniqueDepartments(teams: Team[]): string[] {
  return [...new Set(teams.map((t) => t.department).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function buildTeamsExcelRows(teams: Team[]) {
  return teams.map((team, index) => {
    const project = getProjectAbstractById(team.selectedProjectId);

    return {
      'S.No': index + 1,
      'Team Name': team.teamName,
      'Leader Name': team.leaderName,
      'Leader Email': team.leaderEmail,
      Mobile: team.mobile,
      College: team.college,
      Department: team.department,
      Year: team.year,
      'Member Count': teamMemberCount(team),
      'Members Setup Complete': team.membersComplete ? 'Yes' : 'No',
      'PS Number': project ? `PS-${String(project.problemNumber).padStart(2, '0')}` : 'Not selected',
      'Problem Title': project?.title ?? '',
      'Problem Domain': project?.domain ?? '',
      'Problem Difficulty': project?.difficulty ?? '',
      'Submission Status': statusLabel(team.submissionStatus),
      'PDF Submitted': team.pdfName ? 'Yes' : 'No',
      'PDF File Name': team.pdfName ?? '',
      'Submission Date': formatDate(team.submissionDate),
      'Registered At': formatDate(team.createdAt),
    };
  });
}

function buildProblemSummaryRows(teams: Team[]) {
  return PROJECT_ABSTRACTS.map((project) => {
    const teamsOnProblem = teams.filter((t) => t.selectedProjectId === project.id);
    return {
      'PS Number': `PS-${String(project.problemNumber).padStart(2, '0')}`,
      'Problem Title': project.title,
      Domain: project.domain,
      Difficulty: project.difficulty,
      'Teams Registered': teamsOnProblem.length,
      'Team Names': teamsOnProblem.map((t) => t.teamName).join(', '),
    };
  });
}

export async function exportTeamsToExcel(
  teams: Team[],
  options?: {
    filename?: string;
    filters?: TeamExportFilters;
  },
) {
  const filters = options?.filters ?? DEFAULT_TEAM_EXPORT_FILTERS;
  const filteredTeams = filterTeamsForExport(teams, filters);

  const XLSX = await import('xlsx');
  const teamRows = buildTeamsExcelRows(filteredTeams);
  const summaryRows = buildProblemSummaryRows(filteredTeams);

  const teamsSheet = XLSX.utils.json_to_sheet(teamRows);
  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);

  if (teamRows.length > 0) {
    const lastCol = XLSX.utils.encode_col(Object.keys(teamRows[0]).length - 1);
    teamsSheet['!autofilter'] = { ref: `A1:${lastCol}${teamRows.length + 1}` };
  }

  if (summaryRows.length > 0) {
    const lastCol = XLSX.utils.encode_col(Object.keys(summaryRows[0]).length - 1);
    summarySheet['!autofilter'] = { ref: `A1:${lastCol}${summaryRows.length + 1}` };
  }

  teamsSheet['!cols'] = [
    { wch: 6 },
    { wch: 24 },
    { wch: 20 },
    { wch: 28 },
    { wch: 14 },
    { wch: 28 },
    { wch: 18 },
    { wch: 10 },
    { wch: 12 },
    { wch: 18 },
    { wch: 12 },
    { wch: 36 },
    { wch: 18 },
    { wch: 14 },
    { wch: 16 },
    { wch: 14 },
    { wch: 28 },
    { wch: 20 },
    { wch: 20 },
  ];

  summarySheet['!cols'] = [
    { wch: 12 },
    { wch: 40 },
    { wch: 18 },
    { wch: 14 },
    { wch: 16 },
    { wch: 50 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, teamsSheet, 'Registered Teams');
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Problem Summary');

  const date = new Date().toISOString().slice(0, 10);
  const suffix =
    filters.submissionStatus !== 'all' ||
    filters.problemStatement !== 'all' ||
    filters.membersSetup !== 'all' ||
    filters.department !== 'all' ||
    filters.pdfSubmitted !== 'all'
      ? '-filtered'
      : '';

  XLSX.writeFile(
    workbook,
    options?.filename ?? `registered-teams-problems-${date}${suffix}.xlsx`,
  );
}
