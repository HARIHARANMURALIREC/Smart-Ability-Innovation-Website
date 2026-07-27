import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Users, ArrowRight, RotateCcw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { resetToSeedData } = useAuth();

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all saved team data? This cannot be undone.')) {
      resetToSeedData();
      alert('All data cleared. You can now register a new team.');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-mesh pt-32 pb-16">
      <div className="pointer-events-none absolute -top-10 left-1/4 h-72 w-72 rounded-full bg-brand-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent-500/15 blur-[120px]" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 shadow-glow">
            <Users className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Join Smart Ability Hackathon
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Select your role to get started</p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register-team-leader')}
            className="glass-card group relative overflow-hidden p-8 text-left transition-all hover:border-brand-400 dark:hover:border-brand-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-accent-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 shadow-glow">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold text-slate-900 dark:text-white">Team Leader</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Create a team, set the password, and add team members
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>✓ Create your team</li>
                <li>✓ Add team members</li>
                <li>✓ Upload project PDF</li>
                <li>✓ Manage submissions</li>
              </ul>
              <div className="mt-6 flex items-center gap-2 text-brand-600 dark:text-brand-300">
                <span className="font-semibold">Get Started</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/member-register')}
            className="glass-card group relative overflow-hidden p-8 text-left transition-all hover:border-accent-400 dark:hover:border-accent-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-sky-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-600 to-sky-600 shadow-glow">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold text-slate-900 dark:text-white">Team Member</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Join an existing team using team password
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>✓ Join existing team</li>
                <li>✓ Enter team password</li>
                <li>✓ Access team dashboard</li>
                <li>✓ Collaborate with team</li>
              </ul>
              <div className="mt-6 flex items-center gap-2 text-accent-600 dark:text-accent-300">
                <span className="font-semibold">Get Started</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </motion.button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/student-login" className="font-semibold text-brand-600 hover:underline dark:text-brand-300">
            Student Login
          </Link>
        </p>

        <div className="mt-6 text-center">
          <button
            onClick={handleClearData}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear All Saved Data
          </button>
        </div>
      </div>
    </div>
  );
}
