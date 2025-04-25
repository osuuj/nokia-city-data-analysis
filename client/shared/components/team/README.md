# Team Components

This directory contains reusable components for displaying team members across the application.

## Components

### TeamMemberCard

A card component for displaying a single team member.

```tsx
import { TeamMemberCard } from '@/shared/components/team';

// Using with direct props
<TeamMemberCard 
  name="John Doe"
  jobTitle="Developer"
  bio="A passionate developer with expertise in React and TypeScript."
  portfolioLink="/about/john"
  avatarSrc="/images/john.jpg"
  skills={['React', 'TypeScript', 'Next.js']}
  socialLinks={{
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe'
  }}
/>

// Using with a member object
<TeamMemberCard member={teamMember} />
```

### TeamMemberGrid

A grid component for displaying multiple team members.

```tsx
import { TeamMemberGrid } from '@/shared/components/team';

<TeamMemberGrid team={teamMembers} />
```

## Hooks

### useTeamMembers

A hook for fetching all team members.

```tsx
import { useTeamMembers } from '@/shared/components/team';

function TeamPage() {
  const { data: teamMembers, isLoading, error } = useTeamMembers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <TeamMemberGrid team={teamMembers} />;
}
```

### useTeamMember

A hook for fetching a single team member by ID.

```tsx
import { useTeamMember } from '@/shared/components/team';

function TeamMemberPage({ id }) {
  const { data: member, isLoading, error } = useTeamMember(id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <TeamMemberCard member={member} />;
}
```

## Types

### TeamMember

```tsx
interface TeamMember {
  id: string;
  name: string;
  jobTitle: string;
  bio: string;
  shortBio?: string;
  portfolioLink: string;
  avatarSrc: string;
  skills?: string[];
  socialLinks?: SocialLinks;
  projects?: string[]; // References to project IDs
  achievements?: Achievement[];
  role?: string;
  department?: string;
  joinDate?: string;
  location?: string;
  languages?: string[];
  education?: {
    degree: string;
    institution: string;
    year: string;
  }[];
  certifications?: {
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];
}
```

### SocialLinks

```tsx
interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  email?: string;
}
```

### Achievement

```tsx
interface Achievement {
  title: string;
  description: string;
  date: string;
  icon?: string;
}
```

## Data

The components use static data by default, but can be easily adapted to use data from an API.

```tsx
// Example of using the components with data from an API
import { useTeamMembers } from '@/shared/components/team';

function TeamPage() {
  const { data: teamMembers, isLoading, error } = useTeamMembers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <TeamMemberGrid team={teamMembers} />;
}
``` 