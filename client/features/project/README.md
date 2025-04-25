# Project Feature

This feature contains components and functionality for the project pages of the application.

## Directory Structure

- `components/` - UI components for the project pages
  - `ProjectCard.tsx` - Card component for displaying project summaries
  - `ProjectDetailClient.tsx` - Client component for project details
  - `ProjectSkeleton.tsx` - Loading skeleton for project components
  - `TechStackShowcase.tsx` - Component for displaying project tech stack
  - `TimelineSection.tsx` - Component for displaying project timeline
  - `GalleryViewer.tsx` - Component for displaying project gallery
  - `hero/` - Hero section components
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions
- `utils/` - Utility functions
- `data/` - Data fetching functions
- `store/` - State management
- `config/` - Configuration files

## Components

### ProjectCard

A card component for displaying project summaries.

```tsx
import { ProjectCard } from '@/features/project';

function ProjectsList() {
  return (
    <div>
      <ProjectCard 
        title="Project Name"
        description="Project description"
        imageUrl="/images/project.jpg"
        slug="project-slug"
      />
    </div>
  );
}
```

### ProjectDetailClient

The main component for displaying project details.

```tsx
import { ProjectDetailClient } from '@/features/project';

function ProjectPage({ params }) {
  return <ProjectDetailClient slug={params.slug} />;
}
```

## Usage

Import components and utilities from the project feature:

```tsx
import { ProjectCard, ProjectDetailClient } from '@/features/project';
```

## Best Practices

1. Keep components focused on a single responsibility.
2. Use TypeScript for type safety.
3. Follow the established directory structure.
4. Document components with JSDoc comments.
5. Test components thoroughly. 