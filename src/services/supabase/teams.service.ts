/**
 * Supabase Teams Service
 * Live DB uses lowercase columns (Postgres folded unquoted camelCase).
 *
 * @module services/supabase/teams.service
 */

import { supabase } from '@/config/supabase';
import { MAX_TEAMS_PER_PROBLEM } from '@/utils';
import type { Team, TeamMember, SubmissionStatus } from '@/types';

/**
 * Map DB row (lowercase or camelCase) → app Team type
 */
export function normalizeTeam(row: Record<string, any>): Team {
  const membersRaw = row.members ?? '[]';
  let members: TeamMember[] = [];
  if (typeof membersRaw === 'string') {
    try {
      const parsed = JSON.parse(membersRaw);
      members = Array.isArray(parsed) ? parsed : [];
    } catch {
      members = [];
    }
  } else if (Array.isArray(membersRaw)) {
    members = membersRaw;
  }

  const status = (row.submissionStatus ?? row.submissionstatus ?? 'not_started') as SubmissionStatus;

  return {
    id: String(row.id),
    teamName: row.teamName ?? row.teamname ?? '',
    leaderName: row.leaderName ?? row.leadername ?? '',
    leaderEmail: row.leaderEmail ?? row.leaderemail ?? '',
    password: row.password ?? '',
    college: row.college ?? '',
    department: row.department ?? '',
    year: String(row.year ?? ''),
    mobile: row.mobile ?? '',
    members,
    membersComplete: Boolean(row.membersComplete ?? row.memberscomplete ?? false),
    selectedProjectId: row.selectedProjectId ?? row.selectedprojectid ?? undefined,
    pdfName: row.pdfName ?? row.pdfname ?? null,
    pdfUrl: row.pdfUrl ?? row.pdfurl ?? null,
    submissionStatus: status,
    submissionDate: row.submissionDate ?? row.submissiondate ?? null,
    createdAt: row.createdAt ?? row.createdat ?? new Date().toISOString(),
  };
}

/** Insert/update payload matching live lowercase columns */
function toDbPayload(team: Team): Record<string, unknown> {
  return {
    id: team.id,
    teamname: team.teamName,
    leadername: team.leaderName,
    leaderemail: team.leaderEmail,
    password: team.password,
    college: team.college,
    department: team.department,
    year: String(team.year),
    mobile: team.mobile || '',
    members: team.members || [],
    memberscomplete: Boolean(team.membersComplete),
    pdfname: team.pdfName,
    pdfurl: team.pdfUrl,
    submissionstatus: team.submissionStatus,
    submissiondate: team.submissionDate,
    selectedprojectid: team.selectedProjectId ?? null,
    createdat: team.createdAt,
  };
}

function toDbUpdates(updates: Partial<Team>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (updates.teamName !== undefined) out.teamname = updates.teamName;
  if (updates.leaderName !== undefined) out.leadername = updates.leaderName;
  if (updates.leaderEmail !== undefined) out.leaderemail = updates.leaderEmail;
  if (updates.password !== undefined) out.password = updates.password;
  if (updates.college !== undefined) out.college = updates.college;
  if (updates.department !== undefined) out.department = updates.department;
  if (updates.year !== undefined) out.year = String(updates.year);
  if (updates.mobile !== undefined) out.mobile = updates.mobile;
  if (updates.members !== undefined) out.members = updates.members;
  if (updates.membersComplete !== undefined) out.memberscomplete = updates.membersComplete;
  if (updates.pdfName !== undefined) out.pdfname = updates.pdfName;
  if (updates.pdfUrl !== undefined) out.pdfurl = updates.pdfUrl;
  if (updates.submissionStatus !== undefined) out.submissionstatus = updates.submissionStatus;
  if (updates.submissionDate !== undefined) out.submissiondate = updates.submissionDate;
  if (updates.selectedProjectId !== undefined) out.selectedprojectid = updates.selectedProjectId;
  return out;
}

/**
 * Create a new team
 */
export async function createTeam(input: Team): Promise<{ team: Team | null; error: string | null }> {
  try {
    const payload = toDbPayload(input);
    let { data, error } = await supabase.from('teams').insert([payload]).select().single();

    // Older schemas may lack password
    if (error && /password/i.test(error.message)) {
      const { password: _pw, ...withoutPassword } = payload;
      ({ data, error } = await supabase.from('teams').insert([withoutPassword]).select().single());
    }

    // Older schemas may lack pdfurl
    if (error && /pdfurl|column|schema cache|42703/i.test(error.message) && 'pdfurl' in payload) {
      const { pdfurl: _u, ...withoutUrl } = payload;
      ({ data, error } = await supabase.from('teams').insert([withoutUrl]).select().single());
    }

    if (error) {
      return { team: null, error: error.message };
    }

    return { team: data ? normalizeTeam(data) : input, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create team';
    return { team: null, error: message };
  }
}

/**
 * Get team by ID
 */
export async function getTeamById(teamId: string): Promise<{ team: Team | null; error: string | null }> {
  try {
    const { data, error } = await supabase.from('teams').select('*').eq('id', teamId).single();

    if (error) {
      return { team: null, error: error.message };
    }

    return { team: data ? normalizeTeam(data) : null, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch team';
    return { team: null, error: message };
  }
}

/**
 * Get teams by leader email
 */
export async function getTeamsByLeader(
  leaderEmail: string
): Promise<{ teams: Team[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('leaderemail', leaderEmail.trim().toLowerCase());

    if (error) {
      return { teams: null, error: error.message };
    }

    return { teams: (data || []).map(normalizeTeam), error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch teams';
    return { teams: null, error: message };
  }
}

/**
 * Get all teams (admin source of truth)
 * Uses lowercase `createdat` — camelCase `createdAt` 400s on this DB.
 */
export async function getAllTeams(): Promise<{ teams: Team[] | null; error: string | null }> {
  try {
    let { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('createdat', { ascending: false });

    // Fallback if order column name differs
    if (error) {
      console.warn('[teams.service] ordered select failed, retrying without order:', error.message);
      ({ data, error } = await supabase.from('teams').select('*'));
    }

    if (error) {
      console.error('[teams.service] getAllTeams failed:', error.message);
      return { teams: null, error: error.message };
    }

    const teams = (data || []).map(normalizeTeam);
    teams.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { teams, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch teams';
    return { teams: null, error: message };
  }
}

/**
 * Update team
 */
export async function updateTeam(
  teamId: string,
  updates: Partial<Team>
): Promise<{ team: Team | null; error: string | null }> {
  try {
    let payload = toDbUpdates(updates);
    let { data, error } = await supabase.from('teams').update(payload).eq('id', teamId).select().single();

    // Older DBs may not have pdfurl yet
    if (error && /pdfurl|column|schema cache|42703/i.test(error.message) && 'pdfurl' in payload) {
      const { pdfurl: _u, ...withoutUrl } = payload;
      ({ data, error } = await supabase.from('teams').update(withoutUrl).eq('id', teamId).select().single());
    }

    if (error) {
      return { team: null, error: error.message };
    }

    return { team: data ? normalizeTeam(data) : null, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update team';
    return { team: null, error: message };
  }
}

/**
 * Delete team and related rows
 */
export async function deleteTeam(teamId: string): Promise<{ error: string | null }> {
  try {
    // Clean related tables first (in case CASCADE is missing on older schemas)
    await supabase.from('team_members').delete().eq('team_id', teamId);
    await supabase.from('submissions').delete().eq('team_id', teamId);

    const { error } = await supabase.from('teams').delete().eq('id', teamId);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete team';
    return { error: message };
  }
}

/**
 * Update team project selection (does NOT mark PDF as submitted)
 * Enforces max teams per problem statement and locks selection once chosen.
 */
export async function selectProject(
  teamId: string,
  projectId: string,
  _projectTitle?: string,
  _abstract?: string
): Promise<{ team: Team | null; error: string | null }> {
  try {
    const existing = await getTeamById(teamId);
    if (existing.error || !existing.team) {
      return { team: null, error: existing.error ?? 'Team not found' };
    }

    // Already on this problem — no-op success
    if (existing.team.selectedProjectId === projectId) {
      return { team: existing.team, error: null };
    }

    if (existing.team.selectedProjectId) {
      return {
        team: null,
        error: 'Your team has already selected a problem statement. The selection cannot be changed.',
      };
    }

    const { count, error: countError } = await supabase
      .from('teams')
      .select('id', { count: 'exact', head: true })
      .eq('selectedprojectid', projectId);

    if (countError) {
      return { team: null, error: countError.message };
    }

    if ((count ?? 0) >= MAX_TEAMS_PER_PROBLEM) {
      return {
        team: null,
        error: `This problem statement is full (maximum ${MAX_TEAMS_PER_PROBLEM} teams). Please choose another.`,
      };
    }

    const nextStatus =
      existing.team.submissionStatus === 'submitted' ? 'submitted' : 'in_progress';

    const { data, error } = await supabase
      .from('teams')
      .update({
        selectedprojectid: projectId,
        submissionstatus: nextStatus,
      })
      .eq('id', teamId)
      .select()
      .single();

    if (error) {
      return { team: null, error: error.message };
    }

    return { team: data ? normalizeTeam(data) : null, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to select project';
    return { team: null, error: message };
  }
}

/**
 * Get team stats
 */
export async function getTeamStats(): Promise<{
  totalTeams: number;
  activeTeams: number;
  submittedTeams: number;
  error: string | null;
}> {
  try {
    const { teams, error } = await getAllTeams();

    if (error || !teams) {
      return { totalTeams: 0, activeTeams: 0, submittedTeams: 0, error: error };
    }

    const submitted = teams.filter((t) => t.submissionStatus === 'submitted').length;

    return {
      totalTeams: teams.length,
      activeTeams: teams.length - submitted,
      submittedTeams: submitted,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch team stats';
    return { totalTeams: 0, activeTeams: 0, submittedTeams: 0, error: message };
  }
}
