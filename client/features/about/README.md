# About Feature

This feature contains components and functionality for the about page of the application.

## Directory Structure

- `components/` - UI components for the about page
  - `AboutErrorBoundary.tsx` - Error boundary for the about page
  - `EducationSection.tsx` - Education section component
  - `ExperienceSection.tsx` - Experience section component
  - `ProfileHeader.tsx` - Profile header component
  - `ProfilePage.tsx` - Main profile page component
  - `ProfileSkeleton.tsx` - Loading skeleton for the profile page
  - `ProjectsSection.tsx` - Projects section component
  - `SkillsSection.tsx` - Skills section component
- `hooks/` - Custom React hooks
  - `useProfileData.ts` - Hook for fetching profile data
  - `useProfilesList.ts` - Hook for fetching profiles list
  - `useTeamMember.ts` - Hook for fetching team member data
- `types/` - TypeScript type definitions
- `utils/` - Utility functions (placeholder for future use)
- `data/` - Data and mock data
  - `mockData.ts` - Mock data for development
  - `aboutContent.ts` - Content configuration

## Components

### ProfilePage

The main component for the about page.

```tsx
import { ProfilePage } from '@/features/about';

function AboutPage() {
  return <ProfilePage id="juuso" />; // id is required
}
```

### ProfileHeader

The header component for the profile page.

```tsx
import { ProfileHeader } from '@/features/about';

function MyComponent() {
  return (
    <ProfileHeader
      name="John Doe"
      role="Senior Full Stack Developer"
      bio="Passionate about building scalable web applications"
      avatar="/images/avatars/john-doe.jpg"
      email="john.doe@example.com"
      social={{
        github: 'https://github.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe'
      }}
    />
  );
}
```

## Usage

Import components and utilities from the about feature:

```tsx
import { 
  ProfilePage, 
  ProfileHeader, 
  SkillsSection,
  useProfileData,
  useProfilesList,
  useTeamMember 
} from '@/features/about';
```

## Best Practices

1. Keep components focused on a single responsibility
2. Use TypeScript for type safety
3. Follow the established directory structure
4. Document components with JSDoc comments
5. Test components thoroughly
6. Use React Query for data fetching and caching
7. Validate data with Zod schemas
8. Keep mock data in the data directory 