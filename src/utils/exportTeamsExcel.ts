import type { Team } from '@/types';
import { getProjectAbstractById, PROJECT_ABSTRACTS } from '@/data/projectAbstracts';
import { statusLabel, teamMemberCount } from '@/utils';

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

export async function exportTeamsToExcel(teams: Team[], filename?: string) {
  const XLSX = await import('xlsx');
  const teamRows = buildTeamsExcelRows(teams);
  const summaryRows = buildProblemSummaryRows(teams);

  const teamsSheet = XLSX.utils.json_to_sheet(teamRows);
  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);

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
  XLSX.writeFile(workbook, filename ?? `registered-teams-problems-${date}.xlsx`);
}
