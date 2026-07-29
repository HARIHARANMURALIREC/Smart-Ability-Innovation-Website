import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-slate-200/60 bg-white/50 dark:border-slate-800/60 dark:bg-slate-950/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <Logo size={40} />
              <span className="font-display text-base font-bold text-slate-900 dark:text-white">
                Smart<span className="gradient-text">Ability</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-slate-500 dark:text-slate-400">
              An Innovation Challenge on Assistive Technology — building AI software and hardware solutions for persons with speech, hearing and communication disabilities.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Explore</h4>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'About', to: '/about' },
                { label: 'Member Registration', to: '/member-register' },
                { label: 'Student Login', to: '/student-login' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organisers */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Organisers</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li className="font-medium text-slate-700 dark:text-slate-300">Centre of Excellence in Assistive Technology</li>
              <li>Rajalakshmi Engineering College</li>
              <li className="pt-1 font-medium text-slate-700 dark:text-slate-300">In association with</li>
              <li>Dept. of Speech, Hearing &amp; Communication, NIEPMD</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Contact</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li><span className="font-medium text-slate-700 dark:text-slate-300">Convenor:</span> Dr. S. Poonkuzhali</li>
              <li><span className="font-medium text-slate-700 dark:text-slate-300">Coordinator:</span> Dr. Priya Vijay</li>
              <li><span className="font-medium text-slate-700 dark:text-slate-300">Coordinator:</span> Mrs. D. Sorna Shanthi</li>
              <li className="pt-1">📅 01 August 2026</li>
              <li>🏆 Prize: ₹1,00,000</li>
            </ul>
          </div>

        </div>

        <div className="mt-10 flex justify-center border-t border-slate-200/60 pt-6 text-sm text-slate-500 dark:border-slate-800/60 dark:text-slate-400">
          <p className="flex items-center gap-1.5">
            Developed with
            <Heart className="heart-multicolor h-4 w-4" fill="currentColor" stroke="currentColor" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">TEAM OG</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
