import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Search, Mail, Lock, User as UserIcon, Phone, GraduationCap, ArrowRight, CheckCircle2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  DEPARTMENTS, YEARS, isValidEmail, isValidMobile,
} from '@/utils';
import type { TeamMember } from '@/types';

interface FormState {
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  teamId: string;
  teamPassword: string;
}

export default function MemberRegisterPage() {
  const { teams, registerMemberToTeam } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<'find' | 'register'>('find');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    teamId: '',
    teamPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Filter teams based on search query
  const filteredTeams = teams.filter((team) => {
    const query = searchQuery.toLowerCase();
    return (
      team.teamName.toLowerCase().includes(query) ||
      team.leaderName.toLowerCase().includes(query)
    );
  });

  const update = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  const handleSelectTeam = (teamId: string) => {
    setSelectedTeam(teamId);
    setForm((f) => ({ ...f, teamId }));
    setStep('register');
  };

  const validateForm = (): boolean => {
    const e: Record<string, string> = {};
    
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!isValidEmail(form.email)) e.email = 'Invalid email address';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!isValidMobile(form.phone)) e.phone = 'Enter a valid 10-digit phone number';
    if (!form.department) e.department = 'Select your department';
    if (!form.year) e.year = 'Select your year';
    if (!form.teamPassword) e.teamPassword = 'Team password is required';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const team = teams.find((t) => t.id === form.teamId);
    if (!team) {
      error('Team not found', 'The selected team no longer exists.');
      return;
    }

    if (team.password !== form.teamPassword) {
      error('Incorrect password', 'The team password is incorrect. Please ask your team leader.');
      return;
    }

    // Check if email already exists
    if (team.leaderEmail.toLowerCase() === form.email.trim().toLowerCase()) {
      error('Email conflict', 'This email is already registered as the team leader.');
      return;
    }

    if (team.members.some((m) => m.email.toLowerCase() === form.email.trim().toLowerCase())) {
      error('Email already registered', 'This email is already a member of this team.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const newMember: TeamMember = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        department: form.department,
        year: form.year,
      };

      registerMemberToTeam(form.teamId, newMember);
      setSubmitting(false);
      success('Registration successful!', `Welcome to ${team.teamName}! You can now log in.`);
      navigate('/student-login');
    }, 800);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-mesh pt-32 pb-16">
      <div className="pointer-events-none absolute -top-10 left-1/4 h-72 w-72 rounded-full bg-brand-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent-500/15 blur-[120px]" />

      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 shadow-glow">
            <Users className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {step === 'find' ? 'Join a Team' : 'Complete Registration'}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {step === 'find'
              ? 'Find your team and join Smart Ability Hackathon'
              : `Fill in your details to join ${teams.find((t) => t.id === form.teamId)?.teamName || 'the team'}`}
          </p>
        </motion.div>

        {step === 'find' ? (
          // Step 1: Find Team
          <div className="mt-8 space-y-4">
            <div className="glass-card p-6">
              <label className="label-text mb-4 block">
                <Search className="mr-1 inline h-4 w-4" /> Search Teams
              </label>
              <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                Select your team to register as a member. Ask your team leader for the team name and password.
              </p>

              <input
                type="text"
                placeholder="Search by team name or leader name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field mb-6"
              />

              <div className="grid gap-3">
                {filteredTeams.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-slate-300 py-8 text-center dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400">{searchQuery ? 'No teams found matching your search.' : 'No teams available. Ask your team leader to create a team first.'}</p>
                  </div>
                ) : (
                  filteredTeams.map((team) => (
                    <motion.button
                      key={team.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectTeam(team.id)}
                      className="rounded-xl border-2 border-slate-200/60 bg-white/40 p-4 text-left transition-all hover:border-brand-400 hover:bg-brand-50/30 dark:border-slate-700/60 dark:bg-slate-800/30 dark:hover:border-brand-500 dark:hover:bg-brand-500/10"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-display font-bold text-slate-900 dark:text-white">{team.teamName}</h3>
                          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                            Leader: {team.leaderName} • {team.members.length} members already joined
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-brand-600 dark:text-brand-300" />
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </div>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/student-login" className="font-semibold text-brand-600 hover:underline dark:text-brand-300">
                Student Login
              </Link>
            </p>
          </div>
        ) : (
          // Step 2: Registration Form
          <form onSubmit={handleSubmit} className="glass-card mt-8 space-y-6 p-6 sm:p-8">
            {/* Personal Info */}
            <div>
              <h3 className="mb-4 font-display text-base font-bold text-slate-900 dark:text-white">Personal Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-text">
                    <UserIcon className="mr-1 inline h-4 w-4" /> Full Name
                  </label>
                  <input
                    className="input-field"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="label-text">
                    <Mail className="mr-1 inline h-4 w-4" /> Email
                  </label>
                  <input
                    className="input-field"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="your@college.edu"
                  />
                  {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="label-text">
                    <Phone className="mr-1 inline h-4 w-4" /> Phone Number
                  </label>
                  <input
                    className="input-field"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                    placeholder="10-digit number"
                    inputMode="numeric"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>}
                </div>

                <div>
                  <label className="label-text">
                    <Lock className="mr-1 inline h-4 w-4" /> Team Password
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    value={form.teamPassword}
                    onChange={(e) => update('teamPassword', e.target.value)}
                    placeholder="Ask your team leader"
                  />
                  {errors.teamPassword && <p className="mt-1 text-xs text-rose-500">{errors.teamPassword}</p>}
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div>
              <h3 className="mb-4 font-display text-base font-bold text-slate-900 dark:text-white">Academic Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-text">
                    <GraduationCap className="mr-1 inline h-4 w-4" /> Department
                  </label>
                  <select
                    className="input-field"
                    value={form.department}
                    onChange={(e) => update('department', e.target.value)}
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {errors.department && <p className="mt-1 text-xs text-rose-500">{errors.department}</p>}
                </div>

                <div>
                  <label className="label-text">
                    <GraduationCap className="mr-1 inline h-4 w-4" /> Year
                  </label>
                  <select
                    className="input-field"
                    value={form.year}
                    onChange={(e) => update('year', e.target.value)}
                  >
                    <option value="">Select year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  {errors.year && <p className="mt-1 text-xs text-rose-500">{errors.year}</p>}
                </div>
              </div>
            </div>

            {/* Team Info */}
            <div className="rounded-xl border border-slate-200/60 bg-sky-50/40 p-4 dark:border-slate-700/60 dark:bg-sky-500/10">
              <p className="text-sm text-slate-700 dark:text-slate-200">
                <strong>Team:</strong> {teams.find((t) => t.id === form.teamId)?.teamName}
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                You'll be able to login with your email and the team password after registration.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep('find');
                  setForm((f) => ({ ...f, teamId: '', teamPassword: '' }));
                }}
                className="text-sm font-medium text-slate-500 underline-offset-4 hover:underline dark:text-slate-400"
              >
                ← Change Team
              </button>
              <Button type="submit" disabled={submitting} icon={CheckCircle2} size="lg">
                {submitting ? 'Registering…' : 'Complete Registration'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
