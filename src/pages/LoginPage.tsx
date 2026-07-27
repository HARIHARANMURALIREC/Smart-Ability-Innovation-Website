import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { isValidEmail } from '@/utils';

interface LoginProps {
  mode: 'student' | 'admin';
}

export default function LoginPage({ mode }: LoginProps) {
  const { loginStudent, loginAdmin } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const isStudent = mode === 'student';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: typeof errors = {};
    if (!email.trim()) er.email = 'Email is required';
    else if (!isValidEmail(email)) er.email = 'Enter a valid email';
    if (!password) er.password = 'Password is required';
    setErrors(er);
    if (Object.keys(er).length) return;

    setLoading(true);
    setTimeout(() => {
      const res = isStudent ? loginStudent(email, password) : loginAdmin(email, password);
      setLoading(false);
      if (res.ok) {
        success('Welcome back!', res.message);
        navigate(isStudent ? '/student/dashboard' : '/admin/dashboard');
      } else {
        error('Login failed', res.message);
      }
    }, 700);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-mesh pt-32 pb-16">
      <div className="pointer-events-none absolute -top-10 left-1/4 h-72 w-72 rounded-full bg-brand-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent-500/15 blur-[120px]" />

      <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        {/* Left brand panel */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="hidden lg:block">
          <div className="flex items-center gap-2">
            <Logo size={52} variant="full" />
          </div>
          <h1 className="mt-8 font-display text-4xl font-bold leading-tight text-slate-900 dark:text-white">
            {isStudent ? 'Welcome back, ' : 'Admin '}
            <span className="gradient-text">{isStudent ? 'innovator' : 'control center'}</span>
          </h1>
          <p className="mt-4 max-w-md text-slate-600 dark:text-slate-400">
            {isStudent
              ? 'Log in to access your team dashboard, track your submission status, and manage your project.'
              : 'Sign in to manage registered teams, review submissions, and view live analytics for the entire innovation.'}
          </p>
          <div className="mt-8 space-y-3">
            {(isStudent
              ? ['Track your team progress', 'Upload final project PDF (leader only)', 'View submission status']
              : ['Manage all registered teams', 'Review submissions & analytics', 'Full admin control']
            ).map((f) => (
              <div key={f} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-300">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right form card */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="glass-card p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 shadow-glow">
              {isStudent ? <GraduationCap className="h-6 w-6 text-white" /> : <ShieldCheck className="h-6 w-6 text-white" />}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">{isStudent ? 'Student Login' : 'Admin Login'}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{isStudent ? 'Access your team dashboard' : 'Manage the innovation'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text"><Mail className="mr-1 inline h-4 w-4" /> Email</label>
              <input className="input-field" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((er) => ({ ...er, email: undefined })); }} placeholder={isStudent ? 'you@college.edu' : 'admin@rec.com'} />
              {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
            </div>
            <div>
              <label className="label-text"><Lock className="mr-1 inline h-4 w-4" /> Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} className="input-field pr-10" value={password} onChange={(e) => { setPassword(e.target.value); setErrors((er) => ({ ...er, password: undefined })); }} placeholder="Your password" />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password}</p>}
            </div>

            <Button type="submit" fullWidth size="lg" disabled={loading} iconRight={ArrowRight}>
              {loading ? (
                <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Signing in…</span>
              ) : (
                <span>{isStudent ? 'Login as Student' : 'Login as Admin'}</span>
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm text-slate-500 dark:text-slate-400">
            {isStudent ? (
              <>
                <p>Don't have a team? <Link to="/register" className="font-semibold text-brand-600 hover:underline dark:text-brand-300">Register here</Link></p>
                <p>Join existing team? <Link to="/member-register" className="font-semibold text-brand-600 hover:underline dark:text-brand-300">Register as member</Link></p>
              </>
            ) : (
              <p>Are you a student? <Link to="/student-login" className="font-semibold text-brand-600 hover:underline dark:text-brand-300">Student login</Link></p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
