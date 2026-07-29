import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hero-mesh px-4">
      <div className="pointer-events-none absolute -top-10 left-1/3 h-72 w-72 rounded-full bg-brand-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-accent-500/15 blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-600 to-accent-600 shadow-glow">
          <Compass className="h-10 w-10 text-white" />
        </div>
        <h1 className="mt-6 font-display text-7xl font-extrabold gradient-text">404</h1>
        <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">Page not found</h2>
        <p className="mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-400">
          The page you're looking for has wandered off the hackathon map. Let's get you back on track.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button to="/" icon={Home}>Back Home</Button>
          <Button to="/student-login" variant="secondary" icon={ArrowLeft}>Student Login</Button>
        </div>
      </motion.div>
    </div>
  );
}
