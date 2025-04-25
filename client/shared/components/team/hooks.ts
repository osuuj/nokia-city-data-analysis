/**
 * Team Component Hooks
 *
 * This file contains React hooks for the team components.
 */

import { useQuery } from '@tanstack/react-query';
import { teamData } from './data';
import type { TeamMember } from './types';

// Query keys for team data
export const teamQueryKeys = {
  all: ['team'] as const,
  members: () => [...teamQueryKeys.all, 'members'] as const,
  member: (id: string) => [...teamQueryKeys.members(), id] as const,
};

// Fetch all team members
async function fetchTeamMembers() {
  // In a real application, this would be an API call
  // For now, we're using static data
  return teamData;
}

// Fetch a single team member
async function fetchTeamMember(id: string) {
  const member = teamData.find((m) => m.id === id);
  if (!member) {
    throw new Error(`Team member with id ${id} not found`);
  }
  return member;
}

// Hook to fetch all team members
export function useTeamMembers() {
  return useQuery({
    queryKey: teamQueryKeys.members(),
    queryFn: fetchTeamMembers,
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
    gcTime: 1000 * 60 * 60, // Keep unused data in cache for 1 hour
  });
}

// Hook to fetch a single team member
export function useTeamMember(id: string) {
  return useQuery({
    queryKey: teamQueryKeys.member(id),
    queryFn: () => fetchTeamMember(id),
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
    gcTime: 1000 * 60 * 60, // Keep unused data in cache for 1 hour
  });
}
