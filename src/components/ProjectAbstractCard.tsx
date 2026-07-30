import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { ProjectAbstract } from '../data/projectAbstracts';
import { useAuth } from '../context/AuthContext';
import { MAX_TEAMS_PER_PROBLEM } from '@/utils';

interface ProjectAbstractCardProps {
  project: ProjectAbstract;
  isSelected?: boolean;
  onSelect?: (projectId: string) => void;
  showSelectButton?: boolean;
  /** How many teams have already selected this problem */
  teamsSelected?: number;
  maxTeams?: number;
  /** Team already chose a PS — selection cannot be changed */
  selectionLocked?: boolean;
}

export default function ProjectAbstractCard({
  project,
  isSelected = false,
  onSelect,
  showSelectButton = true,
  teamsSelected = 0,
  maxTeams = MAX_TEAMS_PER_PROBLEM,
  selectionLocked = false,
}: ProjectAbstractCardProps) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const isFull = !isSelected && teamsSelected >= maxTeams;
  const canSelect =
    showSelectButton && user?.isLeader === true && !!onSelect && !isFull && !selectionLocked;
  const seatsLeft = Math.max(0, maxTeams - teamsSelected);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  const getDomainColor = (domain: string) => {
    const colors: Record<string, string> = {
      'AI/Accessibility': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'AR/VR': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Mobile/AI': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'VR/Assessment': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
      'AR/Education': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
      'Speech/AI': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'AI/Engagement': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'AI/Healthcare': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
      'Web/Education': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      'Hardware/IoT': 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300',
    };
    return colors[domain] || 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-200';
  };

  return (
    <div
      className={`rounded-xl border-2 transition-all ${
        isSelected
          ? 'border-brand-500 bg-brand-50/80 shadow-md dark:border-brand-400 dark:bg-brand-950/30'
          : isFull
            ? 'border-slate-200 bg-slate-50 opacity-75 dark:border-slate-700 dark:bg-slate-900/60'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900'
      }`}
    >
      <div className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <button
            type="button"
            className="flex-1 text-left"
            onClick={() => setExpanded((v) => !v)}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-600 text-sm font-bold text-white">
                {project.problemNumber}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{project.title}</h3>
              {isFull && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  <Lock className="h-3 w-3" /> Full
                </span>
              )}
              {selectionLocked && isSelected && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <Lock className="h-3 w-3" /> Locked
                </span>
              )}
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getDifficultyColor(project.difficulty)}`}>
                {project.difficulty}
              </span>
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getDomainColor(project.domain)}`}>
                {project.domain}
              </span>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  isFull
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {teamsSelected}/{maxTeams} teams
                {!isFull && !isSelected ? ` · ${seatsLeft} left` : ''}
              </span>
            </div>

            <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
              {project.problemStatement}
            </p>
          </button>

          <div className="flex shrink-0 items-center gap-2 self-stretch sm:flex-col sm:items-stretch">
            {showSelectButton && user?.isLeader && (
              isSelected ? (
                <div className="inline-flex min-w-[140px] items-center justify-center gap-1.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <Check className="h-4 w-4" />
                  {selectionLocked ? 'Locked' : 'Selected'}
                </div>
              ) : isFull ? (
                <div className="inline-flex min-w-[140px] items-center justify-center gap-1.5 rounded-xl border-2 border-slate-300 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  <Lock className="h-4 w-4" /> Full
                </div>
              ) : selectionLocked ? (
                <div className="inline-flex min-w-[140px] items-center justify-center gap-1.5 rounded-xl border-2 border-slate-300 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  <Lock className="h-4 w-4" /> Closed
                </div>
              ) : canSelect ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.(project.id);
                  }}
                  className="inline-flex min-w-[140px] items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                >
                  Select
                </button>
              ) : null
            )}

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {expanded ? 'Less' : 'Details'}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="space-y-4 border-t border-slate-200 px-4 py-4 dark:border-slate-700">
          <div>
            <h4 className="mb-2 font-semibold text-slate-900 dark:text-white">Problem Statement</h4>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {project.problemStatement}
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-slate-900 dark:text-white">Development Guidelines</h4>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {project.developmentGuidelines}
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-slate-900 dark:text-white">Features</h4>
            <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
              {project.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-0.5 font-bold text-brand-500">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-slate-900 dark:text-white">Expected Solution</h4>
            <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
              {project.expectedSolution.map((solution, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-0.5 font-bold text-emerald-500">✓</span>
                  <span>{solution}</span>
                </li>
              ))}
            </ul>
          </div>

          {canSelect && !isSelected && (
            <button
              type="button"
              onClick={() => onSelect?.(project.id)}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Select This Project
            </button>
          )}

          {isFull && !isSelected && (
            <p className="rounded-lg bg-slate-100 px-3 py-2 text-center text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              This problem is full ({maxTeams}/{maxTeams} teams). Choose another problem statement.
            </p>
          )}

          {selectionLocked && isSelected && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
              Your team&apos;s selection is locked and cannot be changed.
            </p>
          )}

          {selectionLocked && !isSelected && !isFull && (
            <p className="rounded-lg bg-slate-100 px-3 py-2 text-center text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              Problem statement selection is closed.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
