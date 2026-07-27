import { useOutletContext } from 'react-router-dom';
import type { Team } from '@/types';
import { useAuth } from '@/context/AuthContext';

export function useStudentTeam(): Team {
  const { team } = useOutletContext<{ team: Team }>();
  const { teams, user } = useAuth();

  // Prefer live teams state so selections/uploads update immediately
  const live = teams.find((t) => t.id === user?.teamId);
  return live ?? team;
}
