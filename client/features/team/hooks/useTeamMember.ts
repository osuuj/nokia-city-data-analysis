import { useQuery } from '@tanstack/react-query';
import { teamMembers } from '../data/teamMembers';
import type { TeamMember } from '../types';

export function useTeamMember(id: string) {
  return useQuery<TeamMember>({
    queryKey: ['teamMember', id],
    queryFn: () => {
      const member = teamMembers.find((m) => m.id === id);
      if (!member) {
        throw new Error(`Team member with id ${id} not found`);
      }
      return member;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useTeamMembers() {
  return useQuery<TeamMember[]>({
    queryKey: ['teamMembers'],
    queryFn: () => teamMembers,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
