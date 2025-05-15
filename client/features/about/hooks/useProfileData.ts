import { profileDataMap } from '@/features/about/data';
import { ProjectCategory } from '@/features/project/types';

// Define the allowed position types
type IconPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type TechIcon = {
  name: string;
  position: IconPosition;
};

/**
 * Hook to get profile data by profile ID
 * @param profileId The ID of the profile to get data for
 * @returns Object containing profile data or error state
 */
export function useProfileData(profileId: string) {
  // Type guard to ensure profileId is a valid key
  if (!(profileId in profileDataMap)) {
    return {
      data: null,
      isLoading: false,
      error: new Error(`Profile ${profileId} not found`),
    };
  }

  const profileData = profileDataMap[profileId as keyof typeof profileDataMap];

  // Define tech icons based on profile type
  const getTechIcons = (id: string): TechIcon[] => {
    if (id === 'juuso') {
      return [
        { name: 'logos:react', position: 'bottom-right' as IconPosition },
        { name: 'logos:typescript-icon', position: 'bottom-left' as IconPosition },
        { name: 'logos:tailwindcss-icon', position: 'top-right' as IconPosition },
        { name: 'logos:figma', position: 'top-left' as IconPosition },
      ];
    }
    return [
      { name: 'logos:nodejs-icon', position: 'bottom-right' as IconPosition },
      { name: 'logos:python', position: 'bottom-left' as IconPosition },
      { name: 'logos:postgresql', position: 'top-right' as IconPosition },
      { name: 'logos:aws', position: 'top-left' as IconPosition },
    ];
  };

  // Get profile type-specific descriptions
  const isFrontend = profileId === 'juuso';
  const bio = isFrontend
    ? 'Crafting beautiful, responsive, and intuitive user interfaces. Passionate about design systems, animations, and creating exceptional digital experiences.'
    : 'Building robust, scalable backend solutions that power modern applications. Specialized in high-performance APIs, database optimization, and cloud infrastructure.';

  const skillDescription = isFrontend
    ? 'Frontend expertise and proficiency levels'
    : 'Backend expertise and proficiency levels';

  const projectDescription = isFrontend
    ? 'Explore some of my recent frontend work'
    : 'Explore some of my recent backend and infrastructure work';

  // Transform raw data to the format required by components
  const transformedData = {
    ...profileData,
    hero: {
      name: profileId.charAt(0).toUpperCase() + profileId.slice(1),
      typedStrings: profileData.typedStrings,
      avatarUrl: profileData.avatarUrl,
      bio,
      socialLinks: profileData.socialLinks,
      techIcons: getTechIcons(profileId),
    },
    skills: {
      title: 'Technical Skills',
      description: skillDescription,
      items: profileData.skills,
    },
    projects: {
      title: 'Featured Projects',
      description: projectDescription,
      items: profileData.projects,
      categoryDefault: isFrontend ? ProjectCategory.Web : ProjectCategory.AI,
    },
  };

  return {
    data: transformedData,
    isLoading: false,
    error: null,
  };
}
