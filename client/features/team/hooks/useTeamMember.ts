import { useQuery } from '@tanstack/react-query';
import type { TeamMember } from '../types';

const fetchTeamMember = async (id: string): Promise<TeamMember> => {
  const response = await fetch(`/api/team/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch team member');
  }
  return response.json();
};

export function useTeamMember(id: string) {
  return useQuery({
    queryKey: ['team-member', id],
    queryFn: () => fetchTeamMember(id),
  });
}
