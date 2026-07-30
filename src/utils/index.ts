import type { TeamMember, Team, SubmissionStatus } from '@/types';

export const STORAGE_KEYS = {
  teams: 'sh_teams',
  user: 'sh_user',
  theme: 'sh_theme',
  notifications: 'sh_notifications_enabled',
} as const;

export const MAX_TEAM_MEMBERS = 4;

/** Max teams that may select the same problem statement */
export const MAX_TEAMS_PER_PROBLEM = 15;

/** When false, new team leader registrations are blocked (member joining stays open) */
export const REGISTRATION_OPEN = false;

/** Max PDF submission file size in megabytes */
export const MAX_SUBMISSION_FILE_SIZE_MB = Number(import.meta.env.VITE_MAX_FILE_SIZE_MB) || 10;
export const MAX_SUBMISSION_FILE_SIZE_BYTES = MAX_SUBMISSION_FILE_SIZE_MB * 1024 * 1024;

export const ADMIN_CREDENTIALS = {
  email: 'admin@rec.com',
  password: 'admin@123',
  name: 'Admin',
} as const;

export const ADMIN_USER = {
  role: 'admin' as const,
  email: 'admin@rec.com',
  name: 'Administrator',
};

export const DEPARTMENTS = [
  'Aeronautical Engineering',
  'Automobile Engineering',
  'Biomedical Engineering',
  'Biotechnology',
  'Chemical Engineering',
  'Civil Engineering',
  'Computer Science & Engineering',
  'Computer Science & Engineering (Cyber Security)',
  'Computer Science & Business Systems',
  'Computer Science & Design',
  'Electrical & Electronics Engineering',
  'Electronics & Communication Engineering',
  'Food Technology',
  'Information Technology',
  'Artificial Intelligence & Machine Learning',
  'Artificial Intelligence & Data Science',
  'Mechanical Engineering',
  'Mechatronics Engineering',
  'Other',
];

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year'];

// Validation helpers ----------------------------------------------------

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidMobile(mobile: string): boolean {
  return /^[0-9]{10}$/.test(mobile.trim());
}

export function passwordStrength(pw: string): { score: number; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: labels[score] };
}

// Storage helpers -------------------------------------------------------

export function loadTeams(): Team[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.teams);
    return raw ? (JSON.parse(raw) as Team[]) : [];
  } catch {
    return [];
  }
}

export function saveTeams(teams: Team[]): void {
  localStorage.setItem(STORAGE_KEYS.teams, JSON.stringify(teams));
}

export function loadUser<T>(): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: unknown): void {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem(STORAGE_KEYS.user);
}

export function loadTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem(STORAGE_KEYS.theme);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function saveTheme(mode: 'light' | 'dark'): void {
  localStorage.setItem(STORAGE_KEYS.theme, mode);
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

// Domain helpers --------------------------------------------------------

export function findTeamByEmail(teams: Team[], email: string): { team: Team; isLeader: boolean } | null {
  if (!email || typeof email !== 'string') return null;
  if (!Array.isArray(teams)) return null;
  
  const e = email.trim().toLowerCase();
  const team = teams.find((t) => t && t.leaderEmail && typeof t.leaderEmail === 'string' && t.leaderEmail.toLowerCase() === e);
  if (team) return { team, isLeader: true };
  
  const asMember = teams.find((t) => t && Array.isArray(t.members) && t.members.some((m) => m && m.email && typeof m.email === 'string' && m.email.toLowerCase() === e));
  if (asMember) return { team: asMember, isLeader: false };
  
  return null;
}

export function isDuplicateEmail(teams: Team[], email: string, excludeTeamId?: string): boolean {
  if (!email || typeof email !== 'string') return false;
  if (!Array.isArray(teams)) return false;
  
  const e = email.trim().toLowerCase();
  return teams.some(
    (t) => {
      if (!t || t.id === excludeTeamId) return false;
      
      // Check leader email safely
      if (t.leaderEmail && typeof t.leaderEmail === 'string' && t.leaderEmail.toLowerCase() === e) {
        return true;
      }
      
      // Check member emails safely
      if (Array.isArray(t.members)) {
        return t.members.some((m) => m && m.email && typeof m.email === 'string' && m.email.toLowerCase() === e);
      }
      
      return false;
    },
  );
}

export function teamMemberCount(team: Team): number {
  return 1 + team.members.length;
}

export function statusLabel(status: SubmissionStatus): string {
  switch (status) {
    case 'submitted':
      return 'Submitted';
    case 'in_progress':
      return 'In Progress';
    default:
      return 'Not Started';
  }
}

export function teamProgress(team: Team): number {
  if (team.submissionStatus === 'submitted') return 100;
  if (team.submissionStatus === 'in_progress') return 60;
  if (team.members.length > 0) return 35;
  return 20;
}

export function emptyMember(): TeamMember {
  return { name: '', email: '', department: '', year: '' };
}
