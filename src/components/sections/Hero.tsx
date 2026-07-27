import { motion } from 'framer-motion';
import { ArrowRight, Rocket, Users, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-mesh pt-36 pb-20 sm:pt-44">
      {/* glowing blobs */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-brand-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -top-10 right-1/4 h-72 w-72 rounded-full bg-accent-500/20 blur-[120px]" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 sm:space-y-6"
        >
          <span className="section-eyebrow inline-flex items-center gap-1 justify-center">
            <Sparkles className="h-3.5 w-3.5" /> Innovation Challenge on Assistive Technology
          </span>
          
          {/* Main Hero - Logo Centered */}
          <div className="flex flex-col items-center justify-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-shrink-0"
            >
              <img 
                src="/smartability-logo.png" 
                alt="Smart Ability Innovation Logo"
                className="h-40 w-40 sm:h-64 sm:w-64 lg:h-80 lg:w-80 object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>
          
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center text-base sm:text-lg font-semibold text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            Build Applications and Devices to Support Speech, Hearing and Communication
          </motion.p>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400 max-w-3xl mx-auto"
          >
            Organised by the <strong className="text-slate-800 dark:text-slate-200">Centre of Excellence in Assistive Technology, Rajalakshmi Engineering College</strong> in association with the <strong className="text-slate-800 dark:text-slate-200">Department of Speech, Hearing and Communication, NIEPMD</strong>. Build <strong className="text-slate-800 dark:text-slate-200">AI-powered software</strong> or <strong className="text-slate-800 dark:text-slate-200">hardware devices</strong> that support persons with speech, hearing and communication disabilities — and compete for <strong className="text-slate-800 dark:text-slate-200">₹1,00,000</strong> in prizes.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <Button to="/register" size="lg" icon={Rocket} iconRight={ArrowRight}>
              Register Team
            </Button>
            <Button to="/student-login" size="lg" variant="secondary" icon={Users}>
              Student Login
            </Button>
          </motion.div>

          {/* Stats Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2 rounded-full bg-brand-50 px-3 sm:px-4 py-1.5 font-semibold text-brand-700 ring-1 ring-brand-200 dark:bg-brand-900/30 dark:text-brand-300 dark:ring-brand-700/40">
              � Registration: 25-29 July
            </div>
            <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 sm:px-4 py-1.5 font-semibold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-700/40">
              ⚡ Challenge: 01 August 2026
            </div>
            <div className="flex items-center gap-2 rounded-full bg-violet-50 px-3 sm:px-4 py-1.5 font-semibold text-violet-700 ring-1 ring-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:ring-violet-700/40">
              💻 9 Software Problems
            </div>
            <div className="flex items-center gap-2 rounded-full bg-sky-50 px-3 sm:px-4 py-1.5 font-semibold text-sky-700 ring-1 ring-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:ring-sky-700/40">
              🔧 2 Hardware Problems
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
