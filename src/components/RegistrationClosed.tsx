import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, LogIn } from 'lucide-react';

interface RegistrationClosedProps {
  title?: string;
}

export default function RegistrationClosed({
  title = 'Registrations Closed',
}: RegistrationClosedProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-mesh pt-32 pb-16">
      <div className="pointer-events-none absolute -top-10 left-1/4 h-72 w-72 rounded-full bg-brand-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent-500/15 blur-[120px]" />

      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 text-center sm:p-10"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 dark:bg-slate-800">
            <Lock className="h-7 w-7 text-slate-600 dark:text-slate-300" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            New team registrations for SmartAbility Innovation Challenge are now closed.
            Members can still join an existing team, and registered teams can sign in to manage submissions.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/student-login"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
            >
              <LogIn className="h-4 w-4" /> Student Login
            </Link>
            <Link
              to="/member-register"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-400 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
            >
              Join Existing Team
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-400 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
