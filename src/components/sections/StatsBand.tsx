import { motion } from 'framer-motion';
import { ClipboardList, Trophy, Calendar, Zap } from 'lucide-react';

const STATS = [
  { icon: ClipboardList, value: '11', label: 'Problem Statements', sub: 'Real-World Challenges' },
  { icon: Trophy, value: '₹1,00,000', label: 'Total Prize Value', sub: 'Winning Teams' },
  { icon: Calendar, value: '25-29 July 2026', label: 'Registration Period', sub: 'Open Now' },
  { icon: Zap, value: '01 Aug 2026', label: 'Challenge Date', sub: 'Mark Your Calendar' },
];

export default function StatsBand() {
  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-accent-600 to-sky-500 p-6 shadow-glow sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-hero-mesh opacity-30" />
          <div className="relative grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/20 backdrop-blur-sm sm:p-5"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 sm:h-12 sm:w-12">
                  <s.icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
                <p className="mt-3 font-display text-xl font-extrabold text-white sm:text-2xl lg:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs font-semibold text-white/90 sm:text-sm">{s.label}</p>
                <p className="mt-0.5 text-[11px] text-white/60 sm:text-xs">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
