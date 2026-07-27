// Core domain types for Smart Ability Hackathon

export interface TeamMember {
  name: string;
  email: string;
  department: string;
  year: string;
}

export interface Team {
  id: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  password: string;
  college: string;
  department: string;
  year: string;
  mobile: string;
  members: TeamMember[];
  membersComplete: boolean;   // true once leader has filled all member details
  selectedProjectId?: string; // project selected by team leader
  pdfName: string | null;
  pdfUrl: string | null;
  submissionStatus: SubmissionStatus;
  submissionDate: string | null;
  createdAt: string;
}

export type SubmissionStatus = 'not_started' | 'in_progress' | 'submitted';

export type UserRole = 'student' | 'admin';

export interface AuthUser {
  role: UserRole;
  email: string;
  name: string;
  teamId?: string;
  isLeader: boolean;
}

export type ThemeMode = 'light' | 'dark';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}

export interface ActivityItem {
  id: string;
  icon: string;
  title: string;
  time: string;
  tone: 'brand' | 'accent' | 'sky' | 'emerald' | 'amber';
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  tone: 'info' | 'success' | 'warning';
}
