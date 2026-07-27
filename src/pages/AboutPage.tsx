import { motion } from 'framer-motion';
import {
  Users, FileUp, ShieldCheck, Target, Award,
  GraduationCap, Building2, Mic, Brain, Cpu,
  Trophy, Calendar, MapPin, UserCheck, Heart,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Timeline from '@/components/sections/Timeline';

const POINTS = [
  { icon: Users,       title: 'Team Registration',  text: 'Students form teams of up to 5 members. The leader registers the squad with full college and department details.' },
  { icon: FileUp,      title: 'Project Submission',  text: 'Only the team leader uploads the final project PDF — keeping submissions accountable and consistent.' },
  { icon: ShieldCheck, title: 'Admin Oversight',     text: 'Organizers manage every team, track submissions in real time, and review analytics from a single dashboard.' },
  { icon: Target,      title: 'Evaluation & Winners', text: 'Domain experts evaluate submissions and reward the top teams from the ₹1,00,000 prize pool.' },
];

const DOMAINS = [
  { icon: Brain, title: 'AI Software Track',     text: 'Build AI-powered apps — speech recognition, NLP, AAC tools, and intelligent assistive systems using machine learning.' },
  { icon: Cpu,   title: 'Hardware Track',         text: 'Design smart assistive devices — IoT communication aids, sensor systems, and embedded hardware prototypes.' },
  { icon: Mic,   title: 'Speech & Hearing Focus', text: 'All solutions must address real challenges in speech, hearing, or communication for persons with disabilities.' },
  { icon: Users, title: 'Inclusive by Design',    text: 'Every project is evaluated on accessibility, usability, and real-world impact for persons with multiple disabilities.' },
];

const VALUES = [
  { icon: Heart,        title: 'Empowering Abilities',       text: 'Helping persons with disabilities lead more independent and fulfilling lives through technology.' },
  { icon: Brain,        title: 'Driving Innovation',          text: 'Encouraging breakthrough ideas across software, hardware, and AI to solve real assistive tech challenges.' },
  { icon: Award,        title: 'Building an Inclusive Future', text: 'Creating solutions that foster inclusion, accessibility, and meaningful societal impact.' },
  { icon: GraduationCap, title: 'Student-First',             text: 'Designed around the student journey — from forming a team to final submission and evaluation.' },
];

const TEAM = [
  { role: 'Convenor',    name: 'Dr. S. Poonkuzhali',   icon: UserCheck },
  { role: 'Coordinator', name: 'Dr. Priya Vijay',       icon: UserCheck },
  { role: 'Coordinator', name: 'Mrs. D. Sorna Shanthi', icon: UserCheck },
];

export default function AboutPage() {
  return (
    <div className="pt-32">

      {/* Hero — Event Overview */}
      <section className="relative py-16">
        <div className="pointer-events-none absolute -top-10 left-1/3 h-72 w-72 rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl text-center">
            <span className="section-eyebrow">About SmartAbility</span>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              <span className="text-violet-700 dark:text-violet-500">Smart Ability</span>
              {' '}
              <span className="text-amber-500 dark:text-amber-400">Innovation</span>
            </h1>
            <p className="mt-5 text-base text-slate-600 dark:text-slate-400">
              <span className="block font-semibold text-slate-900 dark:text-white">Innovation Challenge on Assistive Technology</span>
            </p>
            <p className="mt-5 text-lg text-slate-600 dark:text-slate-400">
              SmartAbility is organised by the{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-200">Centre of Excellence in Assistive Technology, Rajalakshmi Engineering College</span>,
              in association with the{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-200">Department of Speech, Hearing and Communication, NIEPMD</span>.
            </p>
          </motion.div>

          {/* Event meta pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <div className="flex items-center gap-2 rounded-full bg-brand-50 px-5 py-2.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 dark:bg-brand-900/30 dark:text-brand-300 dark:ring-brand-700/40">
              <Calendar className="h-4 w-4" /> 01 August 2026
            </div>
            <div className="flex items-center gap-2 rounded-full bg-accent-50 px-5 py-2.5 text-sm font-semibold text-accent-700 ring-1 ring-accent-200 dark:bg-accent-900/30 dark:text-accent-300 dark:ring-accent-700/40">
              <MapPin className="h-4 w-4" /> Rajalakshmi Engineering College
            </div>
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-700/40">
              <Trophy className="h-4 w-4" /> Prize Pool: ₹1,00,000
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-card relative overflow-hidden p-8 sm:p-12">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5" />
            <div className="relative mx-auto max-w-4xl">
              <span className="section-eyebrow">The Mission</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                Building an <span className="gradient-text">inclusive future</span> through technology
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                <p>
                  SmartAbility is entirely focused on two project tracks:{' '}
                  <strong className="text-slate-800 dark:text-slate-200">AI-powered software applications</strong> and{' '}
                  <strong className="text-slate-800 dark:text-slate-200">hardware-based assistive devices</strong> — both aimed at supporting persons with speech, hearing and communication disabilities.
                </p>
                <p>
                  The innovation features{' '}
                  <strong className="text-slate-800 dark:text-slate-200">11 real-world problem statements</strong> drawn from the assistive technology domain. Participants choose one and build a practical solution — whether that's a machine learning app, a smart communication device, an NLP tool, an IoT system, or an embedded hardware prototype.
                </p>
                <p>
                  With a total prize value of{' '}
                  <strong className="text-slate-800 dark:text-slate-200">₹1,00,000</strong>, SmartAbility provides a unique
                  platform to collaborate with domain experts, validate ideas, and contribute towards building an inclusive future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus areas */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">Project Tracks</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              AI Software &amp; Hardware — <span className="gradient-text">two tracks, one mission</span>
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Choose your track and solve one of 11 real-world assistive technology problem statements.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DOMAINS.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-card p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 shadow-glow">
                  <d.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-slate-900 dark:text-white">{d.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{d.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Organisers */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">Organised By</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">In association with leading institutions</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}
              className="glass-card flex items-start gap-5 p-7"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 ring-1 ring-brand-500/20">
                <Building2 className="h-7 w-7 text-brand-600 dark:text-brand-300" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">Organizer</p>
                <h3 className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-white">Centre of Excellence in Assistive Technology</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Rajalakshmi Engineering College</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}
              className="glass-card flex items-start gap-5 p-7"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 ring-1 ring-brand-500/20">
                <GraduationCap className="h-7 w-7 text-brand-600 dark:text-brand-300" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">In Association With</p>
                <h3 className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-white">Department of Speech, Hearing &amp; Communication</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">National Institute for Empowerment of Persons with Multiple Disabilities (NIEPMD)</p>
              </div>
            </motion.div>
          </div>

          {/* Convenor & Coordinators */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {TEAM.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-card flex items-center gap-4 p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 shadow-glow">
                  <m.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">{m.role}</p>
                  <p className="mt-0.5 font-display text-sm font-bold text-slate-900 dark:text-white">{m.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">How It Works</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">The portal lifecycle</h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {POINTS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }} whileHover={{ y: -4 }}
                className="glass-card flex items-start gap-4 p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 ring-1 ring-brand-500/20">
                  <p.icon className="h-6 w-6 text-brand-600 dark:text-brand-300" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{p.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">Our Values</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">What drives SmartAbility</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-card p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 shadow-glow">
                  <v.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-slate-900 dark:text-white">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Timeline />

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-card relative overflow-hidden p-10 text-center sm:p-14">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/10 to-accent-500/10" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Start your innovation journey</h2>
              <p className="mx-auto mt-3 max-w-lg text-slate-600 dark:text-slate-400">
                Register your team and help build an inclusive future through assistive technology.
              </p>
              <div className="mt-6 flex justify-center">
                <Button to="/register" size="lg" icon={Users}>Register Now</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
