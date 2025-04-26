import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { teamMemberProfiles } from '../data';
import { profilesListResponseSchema } from '../schemas';
import type { ProfilesListResponse, TeamMemberProfile } from '../schemas';

const fetchProfilesList = async (): Promise<ProfilesListResponse> => {
  try {
    // Simulate API call with mock data
    const profiles = teamMemberProfiles;

    // Validate the data with Zod schema
    const validatedData = profilesListResponseSchema.parse({
      success: true,
      data: profiles,
    });

    return validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      throw new Error('Invalid profiles list data structure');
    }
    throw error;
  }
};

export const useProfilesList = () => {
  return useQuery<ProfilesListResponse, Error, TeamMemberProfile[]>({
    queryKey: ['profiles'],
    queryFn: fetchProfilesList,
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
