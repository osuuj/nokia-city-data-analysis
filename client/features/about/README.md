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
- `types/` - TypeScript type definitions
- `utils/` - Utility functions
- `data/` - Data fetching functions
- `store/` - State management

## Components

### ProfilePage

The main component for the about page.

```tsx
import { ProfilePage } from '@/features/about';

function AboutPage() {
  return <ProfilePage />;
}
```

### ProfileHeader

The header component for the profile page.

```tsx
import { ProfileHeader } from '@/features/about';

function MyComponent() {
  return <ProfileHeader name="John Doe" title="Software Engineer" />;
}
```

## Usage

Import components and utilities from the about feature:

```tsx
import { ProfilePage, ProfileHeader, SkillsSection } from '@/features/about';
```

## Best Practices

1. Keep components focused on a single responsibility.
2. Use TypeScript for type safety.
3. Follow the established directory structure.
4. Document components with JSDoc comments.
5. Test components thoroughly. 