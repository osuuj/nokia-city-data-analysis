import { useQuery } from '@tanstack/react-query';
import { type TeamMemberProfile, teamMemberProfiles } from '../data/aboutContent';

export function useProfileData(id: string) {
  return useQuery<TeamMemberProfile>({
    queryKey: ['profile', id],
    queryFn: () => {
      const profile = teamMemberProfiles[id];
      if (!profile) {
        throw new Error(`Profile with id ${id} not found`);
      }
      return profile;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
