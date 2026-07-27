import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { PROJECT_ABSTRACTS } from '@/data/projectAbstracts';
import DashboardHeader from '@/components/admin/DashboardHeader';
import UploadCard from '@/components/UploadCard';
import { useStudentTeam } from '@/hooks';

export default function StudentSubmission() {
  const team = useStudentTeam();
  const selectedProject = team.selectedProjectId
    ? PROJECT_ABSTRACTS.find((p) => p.id === team.selectedProjectId)
    : null;

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="PDF Submission"
        subtitle="Upload your team abstract after selecting a problem"
        breadcrumbs={[{ label: 'Student', to: '/student/dashboard' }, { label: 'PDF Submission' }]}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6">
        {selectedProject ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-emerald-200/60 bg-emerald-50/70 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Selected problem
            </p>
            <p className="mt-1 font-display text-lg font-bold text-emerald-900 dark:text-emerald-100">
              #{selectedProject.problemNumber} · {selectedProject.title}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3 rounded-xl border border-amber-200/60 bg-amber-50/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-amber-500/20 dark:bg-amber-500/10"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  Select a problem statement first
                </p>
                <p className="mt-0.5 text-xs text-amber-800/80 dark:text-amber-300/80">
                  Upload unlocks after your team chooses a project.
                </p>
              </div>
            </div>
            <Link to="/student/problems" className="btn-secondary shrink-0">
              Choose problem <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <UploadCard />
        </motion.div>
        </div>
      </div>
    </div>
  );
}
