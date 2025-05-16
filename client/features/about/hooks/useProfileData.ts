import { profileData } from '@/features/about/data';
import { ProjectCategory } from '@/features/project/types';

// Define the allowed position types
type IconPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type TechIcon = {
  name: string;
  position: IconPosition;
};

// Define Project type with optional category
type Project = {
  id: string;
  title: string;
  description: string;
  tech?: string[];
  image?: string;
  link?: string;
  hasDemo?: boolean;
  category?: ProjectCategory;
};

/**
 * Hook to get profile data by profile ID
 * @param profileId The ID of the profile to get data for
 * @returns Object containing profile data or error state
 */
export function useProfileData(profileId: string) {
  // Type guard to ensure profileId is a valid key
  if (!(profileId in profileData)) {
    return {
      data: null,
      isLoading: false,
      error: new Error(`Profile ${profileId} not found`),
    };
  }

  const profileInfo = profileData[profileId as keyof typeof profileData];

  // Define tech icons based on profile type
  const getTechIcons = (id: string): TechIcon[] => {
    if (id === 'juuso') {
      return [
        { name: 'logos:react', position: 'bottom-right' as IconPosition },
        { name: 'logos:typescript-icon', position: 'bottom-left' as IconPosition },
        { name: 'logos:python', position: 'top-right' as IconPosition },
        { name: 'logos:aws', position: 'top-left' as IconPosition },
      ];
    }
    // Kasperi's tech icons
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
    ? 'Crafting data-driven, responsive, and intuitive digital experiences. Passionate about design systems, automation, and building solutions where analytics, code, and business insight come together.'
    : 'Building robust, scalable backend solutions that power modern applications. Specialized in high-performance APIs, database optimization, and cloud infrastructure.';

  const skillDescription = isFrontend
    ? 'Full Stack expertise and proficiency levels'
    : 'Backend expertise and proficiency levels';

  const projectDescription = isFrontend
    ? 'Explore some of my recent work'
    : 'Explore some of my recent backend and infrastructure work';

  // Transform raw data to the format required by components
  const transformedData = {
    ...profileInfo,
    hero: {
      name: profileId.charAt(0).toUpperCase() + profileId.slice(1),
      typedStrings: profileInfo.typedStrings,
      avatarUrl: profileInfo.avatarUrl,
      bio,
      socialLinks: profileInfo.socialLinks,
      techIcons: getTechIcons(profileId),
    },
    skills: {
      title: 'Technical Skills',
      description: skillDescription,
      items: profileInfo.skills,
    },
    projects: {
      title: 'Featured Projects',
      description: projectDescription,
      items: profileInfo.projects.map((project) => ({
        ...project,
        category:
          (project as Project).category || (isFrontend ? ProjectCategory.Web : ProjectCategory.AI),
      })),
      categoryDefault: isFrontend ? ProjectCategory.Web : ProjectCategory.AI,
    },
  };

  return {
    data: transformedData,
    isLoading: false,
    error: null,
  };
}
