# About Feature Components

This document describes the components used in the About feature of the application.

## Directory Structure

```
features/about/components/
├── [person]/                  # Dynamic person route components
├── lazy/                      # Lazy-loaded components
├── sections/                  # Page sections
│   ├── AboutHero.tsx          # Hero section
│   ├── AboutDetails.tsx       # Details section
│   ├── TeamSection.tsx        # Team members section
│   └── VisionSection.tsx      # Vision and mission section
└── index.ts                   # Export file
```

## Core Components

### AboutPage

The main component for the About page, which composes various sections.

```tsx
import { AboutHero, AboutDetails, TeamSection, VisionSection } from '@/features/about/components/sections';

export default function AboutPage() {
  return (
    <div className="about-page">
      <AboutHero />
      <AboutDetails />
      <TeamSection />
      <VisionSection />
    </div>
  );
}
```

### PersonPage

Component for displaying individual team member profiles.

```tsx
import { useParams } from 'next/navigation';
import { getPersonData } from '@/features/about/data/people';

export default function PersonPage() {
  const { person } = useParams();
  const personData = getPersonData(person);
  
  return (
    <div className="person-profile">
      <h1>{personData.name}</h1>
      <p className="role">{personData.role}</p>
      <div className="bio">{personData.bio}</div>
      {/* Additional profile details */}
    </div>
  );
}
```

## Section Components

### AboutHero

Hero section with mission statement and background image.

```tsx
import { ArrowButton } from '@/shared/components/ui';

export function AboutHero() {
  return (
    <section className="hero-section">
      <h1>About Our Company</h1>
      <p className="mission-statement">
        We are dedicated to transforming urban data into actionable insights
      </p>
      <ArrowButton href="#team">Meet our team</ArrowButton>
    </section>
  );
}
```

### TeamSection

Displays the team members in a grid layout.

```tsx
import { TeamMemberCard } from '@/shared/components/team';
import { useTeamMembers } from '@/features/about/hooks';

export function TeamSection() {
  const { data: teamMembers, isLoading } = useTeamMembers();
  
  if (isLoading) return <TeamMembersSkeleton />;
  
  return (
    <section id="team" className="team-section">
      <h2>Our Team</h2>
      <div className="team-grid">
        {teamMembers.map(member => (
          <TeamMemberCard
            key={member.id}
            name={member.name}
            role={member.role}
            image={member.image}
            href={`/about/${member.slug}`}
          />
        ))}
      </div>
    </section>
  );
}
```

## Lazy-Loaded Components

Some components are lazy-loaded for performance:

```tsx
import dynamic from 'next/dynamic';

// Lazy load the team member details component
const TeamMemberDetails = dynamic(
  () => import('@/features/about/components/lazy/TeamMemberDetails'),
  {
    loading: () => <TeamMemberDetailsSkeleton />,
    ssr: false
  }
);
```

## Best Practices

1. **Component Structure**
   - Keep components small and focused on a specific task
   - Use composition to build complex interfaces

2. **Naming Conventions**
   - Use PascalCase for components
   - Use descriptive names that indicate the component's purpose

3. **Component Exports**
   - Use named exports for components
   - Create index.ts files to simplify imports

4. **Styling**
   - Use Tailwind CSS for consistent styling
   - Use the `cn` utility for conditional class names

5. **Performance**
   - Lazy load components that aren't needed for initial render
   - Implement proper loading states for async data

6. **Accessibility**
   - Ensure all components are accessible
   - Use semantic HTML elements
   - Add appropriate ARIA attributes 