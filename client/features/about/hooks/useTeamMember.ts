import { CACHE_OPTIMIZATION, CACHE_RULES, CACHE_TIMES } from '@/features/project/config/cache';
import { useQuery } from '@tanstack/react-query';
import { teamMembers } from '../data/teamMembers';

export interface Achievement {
  title: string;
  description: string;
  date: string;
}

export interface TeamMember {
  id: string;
  name: string;
  jobTitle: string;
  bio: string;
  shortBio?: string;
  portfolioLink: string;
  avatarSrc: string;
  skills?: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  projects?: string[];
  achievements?: Achievement[];
}

// Define query keys for better cache management
export const teamKeys = {
  all: ['team'] as const,
  members: () => [...teamKeys.all, 'members'] as const,
  member: (id: string) => [...teamKeys.members(), id] as const,
};

/**
 * Hook to fetch all team members
 */
export function useTeamMembers() {
  return useQuery({
    queryKey: teamKeys.members(),
    queryFn: () => teamMembers,
    ...CACHE_TIMES.STATIC, // Use static cache as team data rarely changes
    ...CACHE_RULES,
    retry: CACHE_OPTIMIZATION.retry.count,
    retryDelay: CACHE_OPTIMIZATION.retry.delay,
    refetchOnWindowFocus: CACHE_OPTIMIZATION.backgroundRefetch.enabled,
    refetchInterval: CACHE_OPTIMIZATION.backgroundRefetch.interval,
  });
}

/**
 * Hook to fetch a specific team member by ID
 */
export function useTeamMember(id: string) {
  return useQuery({
    queryKey: teamKeys.member(id),
    queryFn: () => {
      const member = teamMembers.find((m: TeamMember) => m.id === id);
      if (!member) {
        throw new Error(`Team member with id ${id} not found`);
      }
      return member;
    },
    ...CACHE_TIMES.STATIC, // Use static cache as team member data rarely changes
    ...CACHE_RULES,
    retry: CACHE_OPTIMIZATION.retry.count,
    retryDelay: CACHE_OPTIMIZATION.retry.delay,
    refetchOnWindowFocus: CACHE_OPTIMIZATION.backgroundRefetch.enabled,
    refetchInterval: CACHE_OPTIMIZATION.backgroundRefetch.interval,
  });
}
