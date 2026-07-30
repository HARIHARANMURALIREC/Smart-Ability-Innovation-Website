import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthUser, Team, TeamMember } from '@/types';
import {
  ADMIN_CREDENTIALS,
  STORAGE_KEYS,
  MAX_TEAMS_PER_PROBLEM,
  MAX_SUBMISSION_FILE_SIZE_BYTES,
  MAX_SUBMISSION_FILE_SIZE_MB,
  REGISTRATION_OPEN,
  loadTeams,
  saveTeams,
  loadUser,
  saveUser,
  clearUser,
  findTeamByEmail,
  uid,
} from '@/utils';
import { seedTeams } from '@/data/seed';
import {
  createTeam,
  getAllTeams,
  deleteTeam as deleteTeamRemote,
  updateTeam as updateTeamRemote,
  selectProject as selectProjectRemote,
} from '@/services/supabase/teams.service';
import { addTeamMember } from '@/services/supabase/members.service';
import { createSubmission } from '@/services/supabase/submissions.service';
import { logActivity } from '@/services/supabase/logging.service';
import { uploadTeamPdf } from '@/services/supabase/storage.service';

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
      | 'pdfUrl'
      | 'submissionStatus'
      | 'submissionDate'
      | 'createdAt'
      | 'membersComplete'
      | 'selectedProjectId'
    >,
  ) => Promise<{ ok: boolean; message: string; team?: Team }>;
  registerMemberToTeam: (teamId: string, member: TeamMember) => void;
  updateTeamMembers: (teamId: string, members: Team['members']) => void;
  selectProject: (teamId: string, projectId: string) => Promise<{ ok: boolean; message: string }>;
  uploadPdf: (file: File) => Promise<{ ok: boolean; message: string }>;
  logout: () => void;
  deleteTeam: (teamId: string) => Promise<{ ok: boolean; message: string }>;
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
      // Database is source of truth so deleted teams (and their emails) stay free
      const next = remote || [];
      logger.info(`Loaded ${next.length} teams from Supabase`);
      setTeams(next);
      saveTeams(next);
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
          pdfUrl: t.pdfUrl ?? null,
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

      if (!REGISTRATION_OPEN) {
        return { ok: false, message: 'Registrations are closed. New teams cannot be registered.' };
      }

      if (!data.teamName || !data.leaderName || !data.leaderEmail || !data.password) {
        return { ok: false, message: 'Missing required fields' };
      }

      // Prefer database list for duplicate checks (deleted teams must not block re-register)
      const { teams: remote, error: remoteError } = await getAllTeams();
      const source = !remoteError && remote ? remote : teams;

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

      const memberEmailTaken = (data.members || []).some((m) =>
        source.some(
          (t) =>
            t.leaderEmail.trim().toLowerCase() === m.email.trim().toLowerCase() ||
            t.members.some((tm) => tm.email.trim().toLowerCase() === m.email.trim().toLowerCase()),
        ),
      );
      if (memberEmailTaken) {
        return { ok: false, message: 'A team member email is already registered.' };
      }

      const localTeam: Team = {
        ...data,
        id: uid('team'),
        pdfName: null,
        pdfUrl: null,
        membersComplete: (data.members?.length ?? 0) > 0,
        submissionStatus: 'not_started',
        submissionDate: null,
        createdAt: new Date().toISOString(),
      };

      const { team: saved, error } = await createTeam(localTeam);
      if (error) {
        logger.error('Supabase insert failed:', error);
        return {
          ok: false,
          message: `Could not save team to database: ${error}. Please try again or contact admin.`,
        };
      }

      const finalTeam = saved ?? localTeam;
      // Keep password from the registration payload (DB row may omit it on select)
      if (!finalTeam.password) finalTeam.password = localTeam.password;

      setTeams((prev) => [finalTeam, ...prev.filter((t) => t.id !== finalTeam.id)]);
      logger.info('Team registered and synced to Supabase:', finalTeam.id);

      // Auto-login team leader so they don't have to sign in again
      const authUser: AuthUser = {
        role: 'student',
        email: finalTeam.leaderEmail,
        name: finalTeam.leaderName,
        teamId: finalTeam.id,
        isLeader: true,
      };
      setUser(authUser);
      saveUser(authUser);

      void logActivity({
        action: 'team_registered',
        description: `Team ${finalTeam.teamName} registered`,
        userEmail: finalTeam.leaderEmail,
        metadata: { teamId: finalTeam.id, teamName: finalTeam.teamName },
      });

      // Sync any members listed at registration into team_members
      for (const member of finalTeam.members || []) {
        void addTeamMember({ teamId: finalTeam.id, member });
      }

      // Don't await — avoid wiping the just-created session with a slow refetch race
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

  const selectProject: AuthContextValue['selectProject'] = async (teamId, projectId) => {
    const current = teams.find((t) => t.id === teamId);
    if (!current) return { ok: false, message: 'Team not found.' };

    if (current.selectedProjectId === projectId) {
      return { ok: true, message: 'Already selected.' };
    }

    if (current.selectedProjectId) {
      return {
        ok: false,
        message: 'Your team has already selected a problem statement. The selection cannot be changed.',
      };
    }

    const taken = teams.filter((t) => t.selectedProjectId === projectId).length;
    if (taken >= MAX_TEAMS_PER_PROBLEM) {
      return {
        ok: false,
        message: `This problem statement is full (maximum ${MAX_TEAMS_PER_PROBLEM} teams). Please choose another.`,
      };
    }

    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              selectedProjectId: projectId,
              submissionStatus: t.submissionStatus === 'submitted' ? 'submitted' : 'in_progress',
            }
          : t,
      ),
    );

    const { error } = await selectProjectRemote(teamId, projectId);
    if (error) {
      // Revert optimistic update if remote rejects (e.g. race to 5)
      await refreshTeams();
      return { ok: false, message: error };
    }

    return { ok: true, message: 'Problem statement selected.' };
  };

  const registerMemberToTeam: AuthContextValue['registerMemberToTeam'] = (teamId, member) => {
    try {
      logger.info('Attempting to add member to team:', { teamId, memberEmail: member.email });

      setTeams((prev) =>
        prev.map((t) => {
          if (t.id !== teamId) return t;
          const nextMembers = [...t.members, member];
          void updateTeamRemote(teamId, { members: nextMembers, membersComplete: true });
          return { ...t, members: nextMembers, membersComplete: true };
        }),
      );

      void addTeamMember({ teamId, member }).then(({ error }) => {
        if (error) logger.error('Failed to save member to team_members table:', error);
        else logger.info('Member saved to team_members:', member.email);
      });
    } catch (error) {
      logger.error('registerMemberToTeam error:', error);
    }
  };

  const uploadPdf: AuthContextValue['uploadPdf'] = async (file) => {
    if (!user || user.role !== 'student' || !user.teamId) {
      return { ok: false, message: 'Not authorized to upload.' };
    }

    try {
      const team = teams.find((t) => t.id === user.teamId);
      if (!team?.selectedProjectId) {
        return { ok: false, message: 'Select a problem statement before uploading.' };
      }

      if (file.size > MAX_SUBMISSION_FILE_SIZE_BYTES) {
        return {
          ok: false,
          message: `File size must be less than ${MAX_SUBMISSION_FILE_SIZE_MB} MB.`,
        };
      }

      const { publicUrl, error: uploadError } = await uploadTeamPdf(user.teamId, file);
      if (uploadError || !publicUrl) {
        logger.error('PDF storage upload failed:', uploadError);
        return {
          ok: false,
          message: uploadError || 'Could not upload PDF. Create the submissions storage bucket in Supabase.',
        };
      }

      const submissionDate = new Date().toISOString();
      const fileName = file.name;

      setTeams((prev) =>
        prev.map((t) =>
          t.id === user.teamId
            ? {
                ...t,
                pdfName: fileName,
                pdfUrl: publicUrl,
                submissionStatus: 'submitted',
                submissionDate,
              }
            : t,
        ),
      );

      void updateTeamRemote(user.teamId, {
        pdfName: fileName,
        pdfUrl: publicUrl,
        submissionStatus: 'submitted',
        submissionDate,
      });

      void createSubmission({
        teamId: user.teamId,
        projectId: team.selectedProjectId,
        pdfName: fileName,
        fileUrl: publicUrl,
        status: 'submitted',
      }).then(({ error }) => {
        if (error) logger.error('Failed to create submissions row:', error);
      });

      void logActivity({
        action: 'pdf_uploaded',
        description: `PDF uploaded: ${fileName}`,
        userEmail: user.email,
        metadata: { teamId: user.teamId, fileName, pdfUrl: publicUrl, projectId: team.selectedProjectId },
      });

      return { ok: true, message: 'PDF uploaded successfully.' };
    } catch (error) {
      logger.error('uploadPdf error:', error);
      return { ok: false, message: error instanceof Error ? error.message : 'Upload failed.' };
    }
  };

  const deleteTeam: AuthContextValue['deleteTeam'] = async (teamId) => {
    const { error } = await deleteTeamRemote(teamId);
    if (error) {
      logger.error('Failed to delete team from Supabase:', error);
      return { ok: false, message: error };
    }

    setTeams((prev) => {
      const next = prev.filter((t) => t.id !== teamId);
      saveTeams(next);
      return next;
    });

    // If a student session belonged to the deleted team, clear it
    setUser((prev) => {
      if (prev?.teamId === teamId) {
        clearUser();
        return null;
      }
      return prev;
    });

    return { ok: true, message: 'Team deleted' };
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
