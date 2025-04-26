import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { teamMemberProfiles } from '../data/aboutContent';
import { profileResponseSchema } from '../schemas';
import type { ProfileResponse, TeamMemberProfile } from '../schemas';

const fetchProfileData = async (id: string): Promise<ProfileResponse> => {
  try {
    // Simulate API call with mock data
    const profile = teamMemberProfiles[id];

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Validate the data with Zod schema
    const validatedData = profileResponseSchema.parse({
      success: true,
      data: profile,
    });

    return validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      throw new Error('Invalid profile data structure');
    }
    throw error;
  }
};

export const useProfileData = (id: string) => {
  return useQuery<ProfileResponse, Error, TeamMemberProfile>({
    queryKey: ['profile', id],
    queryFn: () => fetchProfileData(id),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
