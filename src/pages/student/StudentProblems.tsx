import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { PROJECT_ABSTRACTS } from '@/data/projectAbstracts';
import DashboardHeader from '@/components/admin/DashboardHeader';
import ProjectAbstractsList from '@/components/ProjectAbstractsList';
import { useStudentTeam } from '@/hooks';
import { MAX_TEAMS_PER_PROBLEM } from '@/utils';

export default function StudentProblems() {
  const { user, selectProject, refreshTeams } = useAuth();
  const { success, warning, error } = useToast();
  const team = useStudentTeam();

  if (!user) return null;

  const handleSelectProject = async (projectId: string) => {
    if (!user.isLeader) {
      warning('Leaders only', 'Only team leaders can select projects.');
      return;
    }

    await refreshTeams();
    const res = await selectProject(team.id, projectId);
    if (!res.ok) {
      error('Cannot select', res.message);
      return;
    }
    success('Project selected', 'Your team problem statement has been saved.');
  };

  const selectedProject = team.selectedProjectId
    ? PROJECT_ABSTRACTS.find((p) => p.id === team.selectedProjectId)
    : null;

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Problem Statements"
        subtitle="Choose a project for your team to solve"
        breadcrumbs={[
          { label: 'Student', to: '/student/dashboard' },
          { label: 'Problem Statements' },
        ]}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-brand-600 dark:text-brand-300" />
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Available Projects</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            {user.isLeader
              ? `Select a problem statement for your team. Each problem allows up to ${MAX_TEAMS_PER_PROBLEM} teams.`
              : 'Browse available problem statements. Your team leader will select one for your team.'}
          </p>

          {selectedProject && user.isLeader && (
            <div className="rounded-lg border-2 border-green-400 bg-green-50 p-4 dark:border-green-500/40 dark:bg-green-500/10">
              <p className="mb-2 text-sm font-semibold text-green-900 dark:text-green-200">
                ✓ Your team has selected:
              </p>
              <p className="text-lg font-bold text-green-900 dark:text-green-100">{selectedProject.title}</p>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                Problem #{selectedProject.problemNumber}
              </p>
            </div>
          )}

          {selectedProject && !user.isLeader && (
            <div className="rounded-lg border-2 border-blue-400 bg-blue-50 p-4 dark:border-blue-500/40 dark:bg-blue-500/10">
              <p className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-200">Your Team&apos;s Project:</p>
              <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{selectedProject.title}</p>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                Problem #{selectedProject.problemNumber}
              </p>
            </div>
          )}

          <ProjectAbstractsList
            selectedProjectId={team.selectedProjectId}
            onSelectProject={handleSelectProject}
            viewMode="list"
            showSelectButton={user.isLeader}
          />
        </motion.div>
      </div>
    </div>
  );
}
