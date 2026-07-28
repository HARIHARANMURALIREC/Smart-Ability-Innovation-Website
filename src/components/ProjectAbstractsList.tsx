import { useState, useMemo } from 'react';
import { Search, Lock } from 'lucide-react';
import { PROJECT_ABSTRACTS, countTeamsPerProblem } from '../data/projectAbstracts';
import ProjectAbstractCard from './ProjectAbstractCard';
import { useAuth } from '../context/AuthContext';
import { MAX_TEAMS_PER_PROBLEM } from '@/utils';

interface ProjectAbstractsListProps {
  selectedProjectId?: string;
  onSelectProject?: (projectId: string) => void;
  showSelectionOnly?: boolean;
  viewMode?: 'grid' | 'list';
  showSelectButton?: boolean;
}

export default function ProjectAbstractsList({
  selectedProjectId,
  onSelectProject,
  viewMode = 'list',
  showSelectButton = true,
}: ProjectAbstractsListProps) {
  const { user, teams } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const selectionCounts = useMemo(() => countTeamsPerProblem(teams), [teams]);

  const domains = useMemo(
    () => ['all', ...new Set(PROJECT_ABSTRACTS.map((p) => p.domain))],
    []
  );
  const difficulties = useMemo(
    () => ['all', ...new Set(PROJECT_ABSTRACTS.map((p) => p.difficulty))],
    []
  );

  const filteredProjects = useMemo(() => {
    return PROJECT_ABSTRACTS.filter((project) => {
      const matchesSearch =
        searchTerm === '' ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.problemStatement.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDomain = selectedDomain === 'all' || project.domain === selectedDomain;
      const matchesDifficulty =
        selectedDifficulty === 'all' || project.difficulty === selectedDifficulty;

      return matchesSearch && matchesDomain && matchesDifficulty;
    });
  }, [searchTerm, selectedDomain, selectedDifficulty]);

  return (
    <div className="space-y-6">
      {user && !user.isLeader && (
        <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/50 dark:bg-blue-950/30">
          <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-300" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">View Only</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Only team leaders can select projects. Your team leader will choose a project for your team.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-200">
        Each problem statement can be selected by a maximum of{' '}
        <strong>{MAX_TEAMS_PER_PROBLEM} teams</strong>. When full, it becomes locked.
      </div>

      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Domain</label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800"
            >
              {domains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain === 'all' ? 'All Domains' : domain}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Difficulties' : difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-400">
          Showing {filteredProjects.length} of {PROJECT_ABSTRACTS.length} projects
        </div>
      </div>

      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'
            : 'space-y-4'
        }
      >
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectAbstractCard
              key={project.id}
              project={project}
              isSelected={selectedProjectId === project.id}
              onSelect={onSelectProject}
              showSelectButton={showSelectButton}
              teamsSelected={selectionCounts[project.id] ?? 0}
              maxTeams={MAX_TEAMS_PER_PROBLEM}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-lg text-slate-500">No projects match your filters.</p>
            <p className="mt-2 text-sm text-slate-400">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
