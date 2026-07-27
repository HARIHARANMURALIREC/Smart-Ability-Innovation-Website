import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.22),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(15,23,42,1),_#000)]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-slate-700/30 blur-[110px]" />

      <header className="relative z-10 flex items-center justify-between px-4 py-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3">
          <Logo size={40} variant="mark" />
          <span className="font-display text-sm font-semibold tracking-wide text-slate-200 sm:text-base">
            Smart Ability Admin
          </span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-black/50 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
        >
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-white">Admin Login</h1>
              <p className="text-xs text-slate-400">Authorized staff access only</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
                <Mail className="mr-1 inline h-3.5 w-3.5" /> Email
              </label>
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((er) => ({ ...er, email: undefined }));
                }}
                placeholder="admin@rec.com"
                autoComplete="username"
              />
              {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
                <Lock className="mr-1 inline h-3.5 w-3.5" /> Password
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password}</p>}
            </div>

            <Button type="submit" fullWidth size="lg" disabled={loading} iconRight={ArrowRight}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in…
                </span>
              ) : (
                'Sign in to Admin Panel'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            <Link to="/" className="text-slate-400 transition hover:text-white">
              ← Back to website
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
