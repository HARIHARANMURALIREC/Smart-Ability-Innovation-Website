import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, UserPlus, Trash2, ArrowRight, ArrowLeft, CheckCircle2, GraduationCap, Mail, Lock, Phone, User as UserIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { DEPARTMENTS, YEARS, MAX_TEAM_MEMBERS, emptyMember, isValidEmail, isValidMobile, passwordStrength, isDuplicateEmail, REGISTRATION_OPEN } from '@/utils';
import type { Team, TeamMember } from '@/types';
import RegistrationClosed from '@/components/RegistrationClosed';

interface FormState {
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  password: string;
  confirmPassword: string;
  college: string;
  department: string;
  year: string;
  mobile: string;
  members: TeamMember[];
}

const STEPS = ['Team & Leader', 'Academic Details', 'Team Members'] as const;

export default function TeamLeaderRegisterPage() {
  const { registerTeam, teams, refreshTeams } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    void refreshTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    teamName: '', leaderName: '', leaderEmail: '', password: '', confirmPassword: '', college: '', department: '', year: '', mobile: '', members: [emptyMember()],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!REGISTRATION_OPEN) {
    return <RegistrationClosed title="Team Registration Closed" />;
  }

  const update = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  const updateMember = (idx: number, key: keyof TeamMember, value: string) => {
    setForm((f) => ({ ...f, members: f.members.map((m, i) => (i === idx ? { ...m, [key]: value } : m)) }));
    setErrors((e) => { const n = { ...e }; delete n[`member-${idx}-${key}`]; return n; });
  };

  const addMember = () => {
    if (form.members.length >= MAX_TEAM_MEMBERS - 1) {
      error('Member limit reached', `A team can have at most ${MAX_TEAM_MEMBERS} members including the leader.`);
      return;
    }
    setForm((f) => ({ ...f, members: [...f.members, emptyMember()] }));
  };

  const removeMember = (idx: number) => {
    setForm((f) => ({ ...f, members: f.members.filter((_, i) => i !== idx) }));
  };

  const validateStep0 = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.teamName.trim()) e.teamName = 'Team name is required';
    if (!form.leaderName.trim()) e.leaderName = 'Leader name is required';
    if (!form.leaderEmail.trim()) e.leaderEmail = 'Email is required';
    else if (!isValidEmail(form.leaderEmail)) e.leaderEmail = 'Enter a valid email address';
    else if (isDuplicateEmail(teams, form.leaderEmail)) e.leaderEmail = 'This email is already registered';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep1 = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.college.trim()) e.college = 'College name is required';
    if (!form.department) e.department = 'Select your department';
    if (!form.year) e.year = 'Select your year';
    if (!form.mobile.trim()) e.mobile = 'Mobile number is required';
    else if (!isValidMobile(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: Record<string, string> = {};
    const emails = new Set<string>([form.leaderEmail.trim().toLowerCase()]);
    form.members.forEach((m, idx) => {
      // Skip completely empty members
      if (!m.name.trim() && !m.email.trim() && !m.department && !m.year) return;
      
      // If any field is filled, ALL fields are required
      const hasAnyField = m.name.trim() || m.email.trim() || m.department || m.year;
      
      if (hasAnyField) {
        if (!m.name.trim()) e[`member-${idx}-name`] = 'Name required';
        if (!m.email.trim()) e[`member-${idx}-email`] = 'Email required';
        else if (!isValidEmail(m.email)) e[`member-${idx}-email`] = 'Invalid email';
        else {
          const lower = m.email.trim().toLowerCase();
          if (emails.has(lower)) e[`member-${idx}-email`] = 'Duplicate email in team';
          else if (isDuplicateEmail(teams, m.email)) e[`member-${idx}-email`] = 'This email is already registered';
          else emails.add(lower);
        }
        if (!m.department) e[`member-${idx}-department`] = 'Department required';
        if (!m.year) e[`member-${idx}-year`] = 'Year required';
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 0) {
      if (!validateStep0()) {
        error('Complete step 1', 'Please fix the errors above before continuing');
        return;
      }
    }
    if (step === 1) {
      if (!validateStep1()) {
        error('Complete step 2', 'Please fix the errors above before continuing');
        return;
      }
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) {
      error('Please fix the errors', 'Some team member fields need attention.');
      return;
    }
    const cleanMembers = form.members.filter((m) => m.name.trim() && m.email.trim() && m.department && m.year);
    setSubmitting(true);
    try {
      const payload: Omit<Team, 'id' | 'pdfName' | 'pdfUrl' | 'submissionStatus' | 'submissionDate' | 'createdAt' | 'membersComplete' | 'selectedProjectId'> = {
        teamName: form.teamName.trim(),
        leaderName: form.leaderName.trim(),
        leaderEmail: form.leaderEmail.trim().toLowerCase(),
        password: form.password,
        college: form.college.trim(),
        department: form.department,
        year: form.year,
        mobile: form.mobile.trim(),
        members: cleanMembers,
      };
      const res = await registerTeam(payload);
      if (res.ok) {
        success('Team registered!', `Welcome, ${form.teamName}. You're signed in.`);
        const next = res.team?.membersComplete ? '/student/dashboard' : '/student/setup-members';
        navigate(next, { replace: true });
      } else {
        const errorMsg = typeof res.message === 'string' ? res.message : 'Registration failed. Please try again.';
        error('Registration failed', errorMsg);
      }
    } catch (err) {
      error('Registration failed', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const pw = passwordStrength(form.password);
  const pwColors = ['bg-rose-500', 'bg-rose-500', 'bg-amber-500', 'bg-sky-500', 'bg-emerald-500'];
  const fieldError = (key: string) => errors[key];

  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-mesh pt-32 pb-16">
      <div className="pointer-events-none absolute -top-10 left-1/4 h-72 w-72 rounded-full bg-brand-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent-500/15 blur-[120px]" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 shadow-glow">
            <Trophy className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Register Your Team</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Complete the 3 steps to join Smart Ability Hackathon</p>
        </motion.div>

        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${i <= step ? 'bg-gradient-to-br from-brand-600 to-accent-600 text-white shadow-glow' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                  {i < step ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                </div>
                <span className={`hidden text-sm font-medium sm:block ${i <= step ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{label}</span>
                {i < STEPS.length - 1 && <div className={`h-0.5 w-8 rounded-full sm:w-12 ${i < step ? 'bg-gradient-to-r from-brand-600 to-accent-600' : 'bg-slate-200 dark:bg-slate-800'}`} />}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card mt-8 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <label className="label-text"><Trophy className="mr-1 inline h-4 w-4" /> Team Name</label>
                  <input className="input-field" value={form.teamName} onChange={(e) => update('teamName', e.target.value)} placeholder="e.g. Code Cavaliers" />
                  {fieldError('teamName') && <p className="mt-1 text-xs text-rose-500">{fieldError('teamName')}</p>}
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label-text"><UserIcon className="mr-1 inline h-4 w-4" /> Team Leader Name</label>
                    <input className="input-field" value={form.leaderName} onChange={(e) => update('leaderName', e.target.value)} placeholder="Full name" />
                    {fieldError('leaderName') && <p className="mt-1 text-xs text-rose-500">{fieldError('leaderName')}</p>}
                  </div>
                  <div>
                    <label className="label-text"><Mail className="mr-1 inline h-4 w-4" /> Leader Email</label>
                    <input className="input-field" value={form.leaderEmail} onChange={(e) => update('leaderEmail', e.target.value)} placeholder="leader@college.edu" />
                    {fieldError('leaderEmail') && <p className="mt-1 text-xs text-rose-500">{fieldError('leaderEmail')}</p>}
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label-text"><Lock className="mr-1 inline h-4 w-4" /> Password</label>
                    <input type="password" className="input-field" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min 8 characters" />
                    {form.password && (
                      <div className="mt-2 flex items-center gap-1.5">
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < pw.score ? pwColors[pw.score] : 'bg-slate-200 dark:bg-slate-700'}`} />
                        ))}
                        <span className="text-[11px] font-medium text-slate-500">{pw.label}</span>
                      </div>
                    )}
                    {fieldError('password') && <p className="mt-1 text-xs text-rose-500">{fieldError('password')}</p>}
                  </div>
                  <div>
                    <label className="label-text"><Lock className="mr-1 inline h-4 w-4" /> Confirm Password</label>
                    <input type="password" className="input-field" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder="Re-enter password" />
                    {fieldError('confirmPassword') && <p className="mt-1 text-xs text-rose-500">{fieldError('confirmPassword')}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <label className="label-text"><GraduationCap className="mr-1 inline h-4 w-4" /> College/Institution</label>
                  <input className="input-field" value={form.college} onChange={(e) => update('college', e.target.value)} placeholder="Your college or institution name" />
                  {fieldError('college') && <p className="mt-1 text-xs text-rose-500">{fieldError('college')}</p>}
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label-text"><GraduationCap className="mr-1 inline h-4 w-4" /> Department</label>
                    <select className="input-field" value={form.department} onChange={(e) => update('department', e.target.value)}>
                      <option value="">Select department</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {fieldError('department') && <p className="mt-1 text-xs text-rose-500">{fieldError('department')}</p>}
                  </div>
                  <div>
                    <label className="label-text"><GraduationCap className="mr-1 inline h-4 w-4" /> Year</label>
                    <select className="input-field" value={form.year} onChange={(e) => update('year', e.target.value)}>
                      <option value="">Select year</option>
                      {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    {fieldError('year') && <p className="mt-1 text-xs text-rose-500">{fieldError('year')}</p>}
                  </div>
                </div>
                <div>
                  <label className="label-text"><Phone className="mr-1 inline h-4 w-4" /> Mobile Number</label>
                  <input className="input-field" value={form.mobile} onChange={(e) => update('mobile', e.target.value.replace(/[^0-9]/g, '').slice(0, 10))} placeholder="10-digit number" inputMode="numeric" />
                  {fieldError('mobile') && <p className="mt-1 text-xs text-rose-500">{fieldError('mobile')}</p>}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Team Members</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Up to {MAX_TEAM_MEMBERS - 1} additional members (max {MAX_TEAM_MEMBERS} total)</p>
                  </div>
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                    {form.members.length + 1}/{MAX_TEAM_MEMBERS}
                  </span>
                </div>

                <AnimatePresence>
                  {form.members.map((m, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="rounded-xl border border-slate-200/60 bg-white/40 p-4 dark:border-slate-700/60 dark:bg-slate-800/30">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wide text-brand-600 dark:text-brand-300">Member {idx + 2}</span>
                        <button type="button" onClick={() => removeMember(idx)} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10">
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Name</label>
                          <input className="input-field" value={m.name} onChange={(e) => updateMember(idx, 'name', e.target.value)} placeholder="Member name" />
                          {fieldError(`member-${idx}-name`) && <p className="mt-1 text-xs text-rose-500">{fieldError(`member-${idx}-name`)}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Email</label>
                          <input className="input-field" value={m.email} onChange={(e) => updateMember(idx, 'email', e.target.value)} placeholder="member@college.edu" />
                          {fieldError(`member-${idx}-email`) && <p className="mt-1 text-xs text-rose-500">{fieldError(`member-${idx}-email`)}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Department</label>
                          <select className="input-field" value={m.department} onChange={(e) => updateMember(idx, 'department', e.target.value)}>
                            <option value="">Select department</option>
                            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                          </select>
                          {fieldError(`member-${idx}-department`) && <p className="mt-1 text-xs text-rose-500">{fieldError(`member-${idx}-department`)}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Year</label>
                          <select className="input-field" value={m.year} onChange={(e) => updateMember(idx, 'year', e.target.value)}>
                            <option value="">Select year</option>
                            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                          </select>
                          {fieldError(`member-${idx}-year`) && <p className="mt-1 text-xs text-rose-500">{fieldError(`member-${idx}-year`)}</p>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {form.members.length < MAX_TEAM_MEMBERS - 1 && (
                  <button type="button" onClick={addMember} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-500">
                    <UserPlus className="h-4 w-4" /> Add Member
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={back} icon={ArrowLeft} disabled={step === 0}>Back</Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={next} iconRight={ArrowRight}>Continue</Button>
            ) : (
              <Button type="submit" disabled={submitting} icon={CheckCircle2}>
                {submitting ? 'Submitting…' : 'Complete Registration'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
