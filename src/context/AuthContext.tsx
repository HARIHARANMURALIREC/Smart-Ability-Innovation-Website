import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthUser, Team, TeamMember } from '@/types';
import {
  ADMIN_CREDENTIALS,
  STORAGE_KEYS,
  loadTeams,
  saveTeams,
  loadUser,
  saveUser,
  clearUser,
  findTeamByEmail,
  uid,
} from '@/utils';
import { seedTeams } from '@/data/seed';
import { supabase } from '@/config/supabase';
import {
  createTeam,
  getAllTeams,
  deleteTeam as deleteTeamRemote,
  updateTeam as updateTeamRemote,
} from '@/services/supabase/teams.service';
import { logActivity } from '@/services/supabase/logging.service';

const logger = {
  info: (msg: string, data?: any) => {
    console.log(`✅ [AuthContext] ${msg}`, data || '');
  },
  error: (msg: string, err?: any) => {
    console.error(`❌ [AuthContext] ${msg}`, err || '');
    logActivity({
      action: 'auth_context_error',
      description: `${msg}: ${err instanceof Error ? err.message : String(err)}`,
      metadata: { error: err },
    }).catch(() => {});
  },
  debug: (msg: string, data?: any) => {
    console.log(`🔍 [AuthContext] ${msg}`, data || '');
  },
};

interface AuthContextValue {
  user: AuthUser | null;
  teams: Team[];
  teamsLoading: boolean;
  loginStudent: (email: string, password: string) => { ok: boolean; message: string };
  loginAdmin: (email: string, password: string) => { ok: boolean; message: string };
  registerTeam: (
    data: Omit<
      Team,
      | 'id'
      | 'pdfName'
      | 'submissionStatus'
      | 'submissionDate'
      | 'createdAt'
      | 'membersComplete'
      | 'selectedProjectId'
    >,
  ) => Promise<{ ok: boolean; message: string; team?: Team }>;
  registerMemberToTeam: (teamId: string, member: TeamMember) => void;
  updateTeamMembers: (teamId: string, members: Team['members']) => void;
  selectProject: (teamId: string, projectId: string) => void;
  uploadPdf: (fileName: string) => void;
  logout: () => void;
  deleteTeam: (teamId: string) => void;
  refreshTeams: () => Promise<void>;
  /** Merge previously registered local/imported teams into admin list and push to DB */
  recoverTeams: (incoming: Team[]) => Promise<{ ok: boolean; message: string; recovered: number }>;
  resetToSeedData: () => void;
}

/** Keep every team from local + remote; remote wins on same id/email */
function mergeTeams(local: Team[], remote: Team[]): Team[] {
  const byId = new Map<string, Team>();
  const byEmail = new Map<string, string>();

  const add = (team: Team, prefer: boolean) => {
    const email = team.leaderEmail?.trim().toLowerCase() || '';
    const existingId = email ? byEmail.get(email) : undefined;
    if (existingId && existingId !== team.id) {
      if (!prefer) return;
      byId.delete(existingId);
    }
    if (byId.has(team.id) && !prefer) return;
    byId.set(team.id, team);
    if (email) byEmail.set(email, team.id);
  };

  for (const t of local) add(t, false);
  for (const t of remote) add(t, true);

  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function initialTeams(): Team[] {
  const existing = loadTeams();
  const hasOldStructure = existing.some((team) =>
    team.members.some((member) => !member.department || !member.year),
  );

  if (existing.length > 0 && !hasOldStructure) {
    return existing;
  }

  const seeded = seedTeams();
  saveTeams(seeded);
  return seeded;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadUser<AuthUser>());
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [teamsLoading, setTeamsLoading] = useState(true);

  useEffect(() => {
    saveTeams(teams);
  }, [teams]);

  const refreshTeams = async () => {
    try {
      setTeamsLoading(true);
      const local = loadTeams();
      const { teams: remote, error } = await getAllTeams();
      if (error) {
        logger.error('Failed to load teams from Supabase, keeping local cache', error);
        setTeams(local);
        return;
      }
      // Never wipe older local registrations when remote is empty/partial
      const merged = mergeTeams(local, remote || []);
      logger.info(`Loaded teams (local=${local.length}, remote=${remote?.length ?? 0}, merged=${merged.length})`);
      setTeams(merged);
      saveTeams(merged);
    } catch (err) {
      logger.error('refreshTeams failed', err);
      setTeams(loadTeams());
    } finally {
      setTeamsLoading(false);
    }
  };

  const recoverTeams: AuthContextValue['recoverTeams'] = async (incoming) => {
    try {
      if (!Array.isArray(incoming) || incoming.length === 0) {
        return { ok: false, message: 'No teams found to recover.', recovered: 0 };
      }

      const cleaned = incoming
        .filter((t) => t && t.teamName && t.leaderEmail)
        .map((t) => ({
          ...t,
          id: t.id || uid('team'),
          leaderEmail: String(t.leaderEmail).trim().toLowerCase(),
          members: Array.isArray(t.members) ? t.members : [],
          membersComplete: Boolean(t.membersComplete),
          pdfName: t.pdfName ?? null,
          submissionStatus: t.submissionStatus || 'not_started',
          submissionDate: t.submissionDate ?? null,
          createdAt: t.createdAt || new Date().toISOString(),
          password: t.password || 'Recovered@123',
          college: t.college || '',
          department: t.department || '',
          year: String(t.year || ''),
          mobile: t.mobile || '',
          leaderName: t.leaderName || 'Unknown',
          teamName: t.teamName,
        })) as Team[];

      const before = teams.length;
      const merged = mergeTeams(teams, cleaned);
      setTeams(merged);
      saveTeams(merged);

      let synced = 0;
      for (const team of cleaned) {
        const { error } = await createTeam(team);
        if (!error) synced += 1;
        else logger.error(`Failed to sync recovered team ${team.teamName}`, error);
      }

      await refreshTeams();
      const recovered = Math.max(merged.length - before, cleaned.length);
      return {
        ok: true,
        message: `Recovered ${cleaned.length} team(s). Synced ${synced} to database.`,
        recovered,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, message, recovered: 0 };
    }
  };

  // Always sync from Supabase so admin sees registrations from any browser
  useEffect(() => {
    void refreshTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginStudent: AuthContextValue['loginStudent'] = (email, password) => {
    const found = findTeamByEmail(teams, email);
    if (!found) return { ok: false, message: 'No account found with that email.' };
    if (found.team.password !== password)
      return { ok: false, message: 'Incorrect password. Please try again.' };
    const authUser: AuthUser = {
      role: 'student',
      email: email.trim().toLowerCase(),
      name: found.isLeader
        ? found.team.leaderName
        : found.team.members.find((m) => m.email.toLowerCase() === email.trim().toLowerCase())?.name ??
          'Team Member',
      teamId: found.team.id,
      isLeader: found.isLeader,
    };
    setUser(authUser);
    saveUser(authUser);
    return { ok: true, message: 'Login successful!' };
  };

  const loginAdmin: AuthContextValue['loginAdmin'] = (email, password) => {
    if (
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const authUser: AuthUser = {
        role: 'admin',
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        isLeader: false,
      };
      setUser(authUser);
      saveUser(authUser);
      // Pull latest registrations when admin signs in
      void refreshTeams();
      return { ok: true, message: 'Welcome back, Admin!' };
    }
    return { ok: false, message: 'Invalid admin credentials.' };
  };

  const registerTeam: AuthContextValue['registerTeam'] = async (data) => {
    try {
      logger.info('registerTeam called with data:', data);

      if (!data.teamName || !data.leaderName || !data.leaderEmail || !data.password) {
        return { ok: false, message: 'Missing required fields' };
      }

      // Prefer remote list for duplicate checks when available
      const { teams: remote } = await getAllTeams();
      const source = remote && remote.length > 0 ? remote : teams;

      const exists = source.some(
        (t) => t.teamName.trim().toLowerCase() === data.teamName.trim().toLowerCase(),
      );
      if (exists) {
        return { ok: false, message: 'A team with this name already exists.' };
      }

      const emailTaken = source.some(
        (t) => t.leaderEmail.trim().toLowerCase() === data.leaderEmail.trim().toLowerCase(),
      );
      if (emailTaken) {
        return { ok: false, message: 'This leader email is already registered.' };
      }

      const localTeam: Team = {
        ...data,
        id: uid('team'),
        pdfName: null,
        membersComplete: (data.members?.length ?? 0) > 0,
        submissionStatus: 'not_started',
        submissionDate: null,
        createdAt: new Date().toISOString(),
      };

      const { team: saved, error } = await createTeam(localTeam);
      if (error) {
        logger.error('Supabase insert failed:', error);
        // Keep local so student can still use the app on this browser,
        // but warn that admin sync failed
        setTeams((prev) => [localTeam, ...prev.filter((t) => t.id !== localTeam.id)]);
        return {
          ok: false,
          message: `Could not save team to database: ${error}. Please try again or contact admin.`,
        };
      }

      const finalTeam = saved ?? localTeam;
      setTeams((prev) => [finalTeam, ...prev.filter((t) => t.id !== finalTeam.id)]);
      logger.info('Team registered and synced to Supabase:', finalTeam.id);

      // Refresh full list so admin/other tabs stay consistent
      void refreshTeams();

      return { ok: true, message: 'Team registered successfully!', team: finalTeam };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error('registerTeam error:', message);
      return { ok: false, message: `Error: ${message}` };
    }
  };

  const updateTeamMembers: AuthContextValue['updateTeamMembers'] = (teamId, members) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, members, membersComplete: true } : t)),
    );
    void updateTeamRemote(teamId, { members, membersComplete: true });
  };

  const selectProject: AuthContextValue['selectProject'] = (teamId, projectId) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, selectedProjectId: projectId } : t)),
    );
    void updateTeamRemote(teamId, { selectedProjectId: projectId });
  };

  const registerMemberToTeam: AuthContextValue['registerMemberToTeam'] = (teamId, member) => {
    try {
      logger.info('Attempting to add member to team:', { teamId, memberEmail: member.email });

      setTeams((prev) =>
        prev.map((t) => {
          if (t.id !== teamId) return t;
          const next = { ...t, members: [...t.members, member], membersComplete: true };
          void updateTeamRemote(teamId, { members: next.members, membersComplete: true });
          return next;
        }),
      );

      supabase
        .from('team_members')
        .insert([
          {
            id: uid('member'),
            team_id: teamId,
            name: member.name,
            email: member.email,
            department: member.department,
            year: String(member.year),
          },
        ])
        .then(({ error }) => {
          if (error) logger.error('Failed to save member to team_members table:', error);
        });
    } catch (error) {
      logger.error('registerMemberToTeam error:', error);
    }
  };

  const uploadPdf: AuthContextValue['uploadPdf'] = (fileName) => {
    if (!user || user.role !== 'student' || !user.teamId) return;

    try {
      const submissionDate = new Date().toISOString();
      setTeams((prev) =>
        prev.map((t) =>
          t.id === user.teamId
            ? {
                ...t,
                pdfName: fileName,
                submissionStatus: 'submitted',
                submissionDate,
              }
            : t,
        ),
      );

      void updateTeamRemote(user.teamId, {
        pdfName: fileName,
        submissionStatus: 'submitted',
        submissionDate,
      });
    } catch (error) {
      logger.error('uploadPdf error:', error);
    }
  };

  const deleteTeam: AuthContextValue['deleteTeam'] = (teamId) => {
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
    void deleteTeamRemote(teamId);
  };

  const logout = () => {
    setUser(null);
    clearUser();
  };

  const resetToSeedData = () => {
    localStorage.removeItem(STORAGE_KEYS.teams);
    localStorage.removeItem(STORAGE_KEYS.user);
    const seeded = seedTeams();
    setTeams(seeded);
    saveTeams(seeded);
    setUser(null);
    void refreshTeams();
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      teams,
      teamsLoading,
      loginStudent,
      loginAdmin,
      registerTeam,
      registerMemberToTeam,
      updateTeamMembers,
      selectProject,
      uploadPdf,
      logout,
      deleteTeam,
      refreshTeams,
      recoverTeams,
      resetToSeedData,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, teams, teamsLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
