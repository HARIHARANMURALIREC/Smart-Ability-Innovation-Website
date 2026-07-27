import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Trash2, CheckCircle2, GraduationCap, Mail, User as UserIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import BgWatermark from '@/components/ui/BgWatermark';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { DEPARTMENTS, YEARS, MAX_TEAM_MEMBERS, emptyMember, isValidEmail } from '@/utils';
import type { TeamMember } from '@/types';

export default function TeamMembersSetupPage() {
  const { user, teams, updateTeamMembers } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  // Guard — only team leaders who haven't completed member setup
  if (!user || user.role !== 'student' || !user.isLeader) return <Navigate to="/student-login" replace />;
  const team = teams.find((t) => t.id === user.teamId);
  if (!team) return <Navigate to="/student-login" replace />;
  if (team.membersComplete) return <Navigate to="/student/dashboard" replace />;

  const [members, setMembers] = useState<TeamMember[]>(
    team.members.length > 0 ? team.members : [emptyMember()],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const updateMember = (idx: number, key: keyof TeamMember, value: string) => {
    setMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, [key]: value } : m)));
    setErrors((e) => { const n = { ...e }; delete n[`${idx}-${key}`]; return n; });
  };

  const addMember = () => {
    if (members.length >= MAX_TEAM_MEMBERS - 1) {
      error('Limit reached', `Maximum ${MAX_TEAM_MEMBERS} members including leader.`);
      return;
    }
    setMembers((prev) => [...prev, emptyMember()]);
  };

  const removeMember = (idx: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const emails = new Set<string>([team.leaderEmail.toLowerCase()]);
    const filled = members.filter(
      (m) => m.name.trim() || m.email.trim() || m.department || m.year,
    );

    if (filled.length === 0) {
      error('Add a member', 'Fill in at least one teammate, or click Skip for now.');
      return false;
    }

    members.forEach((m, idx) => {
      const hasAny = m.name.trim() || m.email.trim() || m.department || m.year;
      if (!hasAny) return;

      if (!m.name.trim()) e[`${idx}-name`] = 'Name is required';
      if (!m.email.trim()) e[`${idx}-email`] = 'Email is required';
      else if (!isValidEmail(m.email)) e[`${idx}-email`] = 'Invalid email';
      else {
        const lower = m.email.trim().toLowerCase();
        if (emails.has(lower)) e[`${idx}-email`] = 'Duplicate email';
        else emails.add(lower);
      }
      if (!m.department) e[`${idx}-department`] = 'Select department';
      if (!m.year) e[`${idx}-year`] = 'Select year';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Only persist fully completed teammate rows
    const validMembers = members.filter(
      (m) => m.name.trim() && m.email.trim() && m.department && m.year && isValidEmail(m.email),
    );
    setSaving(true);
    setTimeout(() => {
      updateTeamMembers(team.id, validMembers);
      setSaving(false);
      success('Team members saved!', 'Your team is all set. Welcome to the dashboard.');
      navigate('/student/dashboard');
    }, 600);
  };

  const handleSkip = () => {
    // Skip must NOT register draft/incomplete teammates
    updateTeamMembers(team.id, []);
    success('Skipped for now', 'You can add teammates later from your team details if needed.');
    navigate('/student/dashboard');
  };

  return (
    <div className="relative min-h-screen bg-slate-100 pb-16 dark:bg-slate-950">
      <BgWatermark />

      {/* Header */}
      <div className="relative z-10 border-b border-slate-200/60 bg-white/80 px-4 py-4 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size={36} />
            <span className="font-display text-sm font-bold text-slate-900 dark:text-white">
              Smart<span className="gradient-text">Ability</span>
            </span>
          </div>
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
            Team Leader Setup
          </span>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        {/* Intro */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 shadow-glow">
            <Users className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white">
            Welcome, {user.name.split(' ')[0]}!
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-slate-600 dark:text-slate-400">
            As the team leader of <strong className="text-slate-800 dark:text-slate-200">{team.teamName}</strong>, please fill in the details for each team member below. You can add up to <strong className="text-slate-800 dark:text-slate-200">{MAX_TEAM_MEMBERS - 1}</strong> members.
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSave} className="mt-8 space-y-4">
          <AnimatePresence>
            {members.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="glass-card p-5"
              >
                {/* Member header */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-brand-600 dark:text-brand-400">
                    Member {idx + 2}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMember(idx)}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label className="label-text">
                      <UserIcon className="mr-1 inline h-4 w-4" /> Full Name
                    </label>
                    <input
                      className="input-field"
                      value={m.name}
                      onChange={(e) => updateMember(idx, 'name', e.target.value)}
                      placeholder="Member full name"
                    />
                    {errors[`${idx}-name`] && <p className="mt-1 text-xs text-rose-500">{errors[`${idx}-name`]}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="label-text">
                      <Mail className="mr-1 inline h-4 w-4" /> Email
                    </label>
                    <input
                      className="input-field"
                      value={m.email}
                      onChange={(e) => updateMember(idx, 'email', e.target.value)}
                      placeholder="member@college.edu"
                    />
                    {errors[`${idx}-email`] && <p className="mt-1 text-xs text-rose-500">{errors[`${idx}-email`]}</p>}
                  </div>

                  {/* Department */}
                  <div>
                    <label className="label-text">
                      <GraduationCap className="mr-1 inline h-4 w-4" /> Department
                    </label>
                    <select
                      className="input-field"
                      value={m.department}
                      onChange={(e) => updateMember(idx, 'department', e.target.value)}
                    >
                      <option value="">Select department</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors[`${idx}-department`] && <p className="mt-1 text-xs text-rose-500">{errors[`${idx}-department`]}</p>}
                  </div>

                  {/* Year */}
                  <div>
                    <label className="label-text">
                      <GraduationCap className="mr-1 inline h-4 w-4" /> Year
                    </label>
                    <select
                      className="input-field"
                      value={m.year}
                      onChange={(e) => updateMember(idx, 'year', e.target.value)}
                    >
                      <option value="">Select year</option>
                      {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    {errors[`${idx}-year`] && <p className="mt-1 text-xs text-rose-500">{errors[`${idx}-year`]}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add member button */}
          {members.length < MAX_TEAM_MEMBERS - 1 && (
            <button
              type="button"
              onClick={addMember}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-500"
            >
              <UserPlus className="h-4 w-4" /> Add Another Member
            </button>
          )}

          {/* Counter */}
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            {members.length + 1}/{MAX_TEAM_MEMBERS} members (including you as leader)
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm font-medium text-slate-500 underline-offset-4 hover:underline dark:text-slate-400"
            >
              Skip for now
            </button>
            <Button type="submit" disabled={saving} icon={CheckCircle2} size="lg">
              {saving ? 'Saving…' : 'Save & Go to Dashboard'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
