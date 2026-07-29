import { motion } from 'framer-motion';
import Hero from '@/components/sections/Hero';
import StatsBand from '@/components/sections/StatsBand';
import Timeline from '@/components/sections/Timeline';
import Button from '@/components/ui/Button';
import { ShieldCheck, Trophy, ArrowRight, Brain, Cpu, Users } from 'lucide-react';

function AboutSection() {
  const cards = [
    { icon: Brain,    title: 'AI Software Track',   text: 'Build AI-powered applications — speech recognition, NLP tools, AAC apps, and intelligent assistive systems using machine learning.' },
    { icon: Cpu,      title: 'Hardware Track',       text: 'Design smart assistive devices — IoT-enabled communication aids, sensor-based systems, and embedded hardware solutions.' },
    { icon: ShieldCheck, title: 'Real-World Impact', text: 'Every solution targets one of 11 problem statements drawn from real challenges faced by persons with speech, hearing and communication disabilities.' },
  ];
  return (
    <section id="about" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-eyebrow">About the Event</span>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              What is <span className="gradient-text">SmartAbility?</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-400">
              <strong className="text-slate-800 dark:text-slate-200">SmartAbility</strong> is an innovation-driven Assistive Technology Hackathon organised by the <strong className="text-slate-800 dark:text-slate-200">Centre of Excellence in Assistive Technology, Rajalakshmi Engineering College</strong>, in association with the <strong className="text-slate-800 dark:text-slate-200">Department of Speech, Hearing and Communication, NIEPMD</strong>.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
              Scheduled on <strong className="text-slate-800 dark:text-slate-200">01 August 2026</strong>, the event is entirely focused on two tracks: <strong className="text-slate-800 dark:text-slate-200">AI-powered software applications</strong> and <strong className="text-slate-800 dark:text-slate-200">hardware-based assistive devices</strong>. Teams pick one of <strong className="text-slate-800 dark:text-slate-200">11 real-world problem statements</strong> and compete for a prize pool of <strong className="text-slate-800 dark:text-slate-200">₹1,00,000</strong>.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button to="/student-login" icon={Users}>Student Login</Button>
              <Button to="/about" variant="secondary" iconRight={ArrowRight}>Learn more</Button>
            </div>
          </motion.div>

          <div className="space-y-4">
            {cards.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                whileHover={{ x: -4 }}
                className="glass-card flex items-start gap-4 p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 ring-1 ring-brand-500/20">
                  <c.icon className="h-6 w-6 text-brand-600 dark:text-brand-300" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">{c.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{c.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card relative overflow-hidden p-10 text-center sm:p-16"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/10 via-accent-500/5 to-sky-500/10" />
          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 shadow-glow">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Ready to build something <span className="gradient-text">impactful?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-600 dark:text-slate-400">
              Registrations for SmartAbility 2026 are now closed. Already registered teams can sign in to continue.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button to="/student-login" size="lg" icon={Users}>Student Login</Button>
              <Button to="/about" size="lg" variant="secondary">Learn More</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <>
      <Hero />
      <StatsBand />
      <AboutSection />
      <Timeline />
      <CTASection />
    </>
  );
}
