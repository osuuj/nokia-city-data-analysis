# Project Feature

This feature contains components and functionality for displaying and managing projects in the application.

## Directory Structure

```
project/
├── components/           # UI components for project pages
│   ├── ui/              # Reusable UI components
│   ├── hero/            # Hero section components
│   ├── ProjectCard.tsx  # Card component for project summaries
│   ├── ProjectDetailClient.tsx  # Client component for project details
│   ├── ProjectErrorBoundary.tsx # Error boundary component
│   └── index.ts         # Component exports
├── hooks/               # Custom React hooks
│   ├── useProjectFeature.ts  # Main feature hook
│   └── index.ts         # Hook exports
├── data/               # Data fetching and management
│   ├── projectApi.ts   # API client for project data
│   ├── useProjects.ts  # Data fetching hooks
│   ├── sampleProjects.ts # Sample data for development
│   └── index.ts        # Data exports
├── types/              # TypeScript type definitions
│   ├── index.ts        # Main type definitions
│   └── schemas.ts      # Zod schemas for validation
├── config/             # Configuration files
│   ├── constants.ts    # Project-related constants
│   └── cache.ts        # Caching configuration
├── docs/               # Documentation
└── index.ts            # Feature exports
```

## Key Components

### ProjectCard

A card component for displaying project summaries with support for:
- Image display with fallback
- Category and status badges
- Tags display
- Responsive layout
- Loading states
- Error handling

```tsx
import { ProjectCard } from '@/features/project';

function ProjectsList() {
  return (
    <ProjectCard 
      title="Project Name"
      description="Project description"
      imageUrl="/images/project.jpg"
      category={ProjectCategory.Web}
      status={ProjectStatus.Active}
      tags={['React', 'TypeScript']}
      slug="project-slug"
    />
  );
}
```

### ProjectDetailClient

The main component for displaying project details with features:
- Full project information display
- Gallery with image support
- Timeline display
- Team information
- Related projects
- Loading states
- Error handling

```tsx
import { ProjectDetailClient } from '@/features/project';

function ProjectPage({ params }) {
  return (
    <ProjectErrorBoundary>
      <ProjectDetailClient slug={params.slug} />
    </ProjectErrorBoundary>
  );
}
```

## Data Management

### useProjectFeature Hook

A comprehensive hook for managing project data and UI state:

```tsx
import { useProjectFeature } from '@/features/project';

function ProjectsPage() {
  const {
    projects,
    isLoading,
    category,
    searchTerm,
    filteredProjects,
    setCategory,
    setSearchTerm,
    selectProject,
    clearFilters
  } = useProjectFeature({
    initialCategory: ProjectCategory.Web,
    initialSearchTerm: ''
  });
}
```

### Project API Client

The API client handles all project-related data fetching:

```tsx
import { projectApi } from '@/features/project';

// Fetch all projects
const projects = await projectApi.fetchProjects();

// Fetch a single project
const project = await projectApi.fetchProjectById('project-id');
```

## Types and Schemas

The feature uses TypeScript for type safety and Zod for runtime validation:

```tsx
import type { Project, ProjectCategory, ProjectStatus } from '@/features/project';

// Project interface
interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  tags: string[];
  // ... other properties
}
```

## Best Practices

1. **Component Organization**
   - Keep components focused and single-responsibility
   - Use composition for complex features
   - Implement proper loading and error states

2. **Type Safety**
   - Use TypeScript for all components and functions
   - Define proper interfaces and types
   - Use Zod for runtime validation

3. **Performance**
   - Implement proper loading states
   - Use React Query for data fetching
   - Implement proper error boundaries

4. **Accessibility**
   - Follow WCAG guidelines
   - Implement proper ARIA attributes
   - Ensure keyboard navigation

5. **Testing**
   - Write unit tests for components
   - Test error scenarios
   - Test loading states

6. **Documentation**
   - Document components with JSDoc
   - Keep README up to date
   - Document type definitions 