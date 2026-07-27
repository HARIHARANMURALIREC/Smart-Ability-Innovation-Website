import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { isValidEmail } from '@/utils';

export default function AdminLoginPage() {
  const { user, loginAdmin } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

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
      const res = loginAdmin(email, password);
      setLoading(false);
      if (res.ok) {
        success('Welcome back!', res.message);
        navigate('/admin/dashboard');
      } else {
        error('Login failed', res.message);
      }
    }, 700);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-mesh">
      <header className="fixed inset-x-0 top-0 z-50 bg-transparent">
        <nav className="relative flex min-h-[6.5rem] w-full items-center justify-between gap-4 py-3 pl-2 pr-4 sm:pl-3 sm:pr-6 lg:pl-4 lg:pr-8">
          <div className="flex min-w-0 flex-shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
            <img
              src="/college%20logo.png"
              alt="Rajalakshmi Engineering College"
              title="Rajalakshmi Engineering College"
              className="h-14 w-auto max-w-[160px] object-contain object-left sm:h-16 sm:max-w-[210px] lg:h-20 lg:max-w-[260px]"
            />
            <img
              src="/center%20of%20excellence%20logo.png"
              alt="Centre of Excellence in Assistive Technology"
              title="Centre of Excellence in Assistive Technology"
              className="h-12 w-auto max-w-[120px] object-contain object-left sm:h-14 sm:max-w-[160px] lg:h-16 lg:max-w-[200px]"
            />
            <img
              src="/niepmed%20logo%20.png"
              alt="NIEPMD - Department of Speech, Hearing & Communication"
              title="Department of Speech, Hearing & Communication, NIEPMD"
              className="h-12 w-auto max-w-[120px] object-contain object-left sm:h-14 sm:max-w-[160px] lg:h-16 lg:max-w-[200px]"
            />
          </div>
          <ThemeToggle />
        </nav>
      </header>

      <div className="pointer-events-none absolute -top-10 left-1/4 h-72 w-72 rounded-full bg-brand-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent-500/15 blur-[120px]" />

      <div className="relative mx-auto grid max-w-5xl gap-8 px-4 pb-16 pt-32 sm:px-6 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block"
        >
          <div className="flex items-center gap-2">
            <Logo size={52} variant="full" />
          </div>
          <h1 className="mt-8 font-display text-4xl font-bold leading-tight text-slate-900 dark:text-white">
            Admin <span className="gradient-text">control center</span>
          </h1>
          <p className="mt-4 max-w-md text-slate-600 dark:text-slate-400">
            Sign in to manage registered teams, review submissions, and view live analytics for the entire innovation.
          </p>
          <div className="mt-8 space-y-3">
            {['Manage all registered teams', 'Review submissions & analytics', 'Full admin control'].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-300">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6 sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 shadow-glow">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Admin Login</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Authorized staff access only</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text">
                <Mail className="mr-1 inline h-4 w-4" /> Email
              </label>
              <input
                className="input-field"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((er) => ({ ...er, email: undefined }));
                }}
                placeholder="admin@rec.com"
                autoComplete="username"
              />
              {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
            </div>
            <div>
              <label className="label-text">
                <Lock className="mr-1 inline h-4 w-4" /> Password
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  className="input-field pr-10"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((er) => ({ ...er, password: undefined }));
                  }}
                  placeholder="Admin password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password}</p>}
            </div>

            <Button type="submit" fullWidth size="lg" disabled={loading} iconRight={ArrowRight}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Signing in…
                </span>
              ) : (
                'Login as Admin'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>
              <Link to="/" className="font-semibold text-brand-600 hover:underline dark:text-brand-300">
                ← Back to website
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
