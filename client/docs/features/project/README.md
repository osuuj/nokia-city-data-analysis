# Project Feature

The Project feature provides components and functionality for displaying and managing project details, including project cards, detail pages, and related content. This feature supports viewing both project listings and detailed project information with rich media.

## Overview

- **Project Cards**: Display project summaries with images, categories, and tags
- **Project Details**: Comprehensive project pages with gallery, timeline, and team info
- **Interactive UI**: Gallery viewers, tech stack showcases, and timeline sections
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Loading States**: Proper skeleton loaders for all components
- **Error Handling**: Dedicated error boundaries for graceful error recovery

## Directory Structure

```
client/features/project/
├── components/               # UI components
│   ├── hero/                 # Hero section components
│   │   ├── AnimatedProjectHero.tsx # Animated hero component
│   │   └── index.ts          # Component exports
│   ├── ui/                   # UI components
│   │   ├── GalleryViewer.tsx # Image gallery component
│   │   ├── ProjectCallToAction.tsx # CTA component
│   │   ├── ProjectDetailHero.tsx # Detail page hero
│   │   ├── ProjectOverview.tsx # Project overview section
│   │   ├── ProjectSkeleton.tsx # Loading skeleton
│   │   ├── ProjectTeamSection.tsx # Team members display
│   │   ├── TechStackShowcase.tsx # Technology stack display
│   │   ├── TimelineItem.tsx # Timeline item component
│   │   ├── TimelineSection.tsx # Project timeline section
│   │   └── index.ts          # Component exports
│   ├── ProjectCard.tsx       # Card component for listings
│   ├── ProjectDetailClient.tsx # Client component for details
│   ├── ProjectErrorBoundary.tsx # Error boundary component
│   └── index.ts              # Component exports
├── config/                   # Configuration
│   ├── constants.ts          # Feature constants
│   ├── cache.ts              # Cache configuration
│   └── index.ts              # Config exports
├── data/                     # Data handling
│   ├── sampleProjects.ts     # Sample data
│   └── index.ts              # Data exports
├── hooks/                    # Custom React hooks
│   ├── useProjects.ts        # Projects data hook
│   └── index.ts              # Hook exports
├── types/                    # TypeScript types
│   ├── enums.ts              # Enum definitions
│   ├── schemas.ts            # Validation schemas
│   └── index.ts              # Type exports
└── index.ts                  # Feature exports
```

## Key Components

### Main Components

- **ProjectCard**: Card component for project listings and grids
- **ProjectDetailClient**: Client-side component for detailed project pages
- **AnimatedProjectHero**: Hero section with animations for project pages

### UI Components

- **GalleryViewer**: Interactive image gallery for project media
- **TimelineSection**: Visual timeline for project milestones and history
- **TechStackShowcase**: Visual display of technologies used in a project
- **ProjectSkeleton**: Loading skeletons for all project components

## Component Hierarchy

```
ProjectsPage
├── ProjectErrorBoundary
│   └── ProjectGrid
│       └── ProjectCard (multiple)
│
ProjectDetailPage
├── ProjectErrorBoundary
│   └── ProjectDetailClient
│       ├── AnimatedProjectHero
│       ├── ProjectOverview
│       ├── GalleryViewer
│       ├── TechStackShowcase
│       ├── TimelineSection
│       │   └── TimelineItem (multiple)
│       ├── ProjectTeamSection
│       └── ProjectCallToAction
```

## Shared Component Usage

The Project feature leverages several shared components:

```tsx
// Background and theme
import { TransitionBackground } from '@/shared/components/ui/background';
import { gradientColors } from '@/shared/utils/backgroundConfig';

// Loading components
import { HeaderSectionSkeleton, BasicCardSkeleton } from '@/shared/components/loading';

// Error handling
import { ErrorDisplay } from '@/shared/components/error';
```

## Data Management

The Project feature uses custom hooks for data management:

```tsx
import { useProjects } from '@/features/project/hooks';

function ProjectsPage() {
  const { 
    projects,
    isLoading, 
    error, 
    filterByCategory,
    sortByDate
  } = useProjects();
  
  // Component implementation
}
```

## Core Types

```typescript
export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  imageSrc: string;
  galleryImages?: string[];
  technologies: Technology[];
  timeline?: TimelineItem[];
  team?: TeamMember[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export enum ProjectCategory {
  Web = 'web',
  Mobile = 'mobile',
  Data = 'data',
  Design = 'design',
  AI = 'ai'
}

export enum ProjectStatus {
  InProgress = 'in-progress',
  Completed = 'completed',
  Planning = 'planning',
  OnHold = 'on-hold'
}
```

## Usage Examples

### Project Card Grid

```tsx
import { ProjectCard } from '@/features/project/components';

function ProjectGrid({ projects }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          title={project.title}
          description={project.description}
          imageUrl={project.imageSrc}
          category={project.category}
          status={project.status}
          tags={project.tags}
          slug={project.slug}
        />
      ))}
    </div>
  );
}
```

### Project Detail Page

```tsx
import { ProjectDetailClient } from '@/features/project/components';
import { ProjectErrorBoundary } from '@/features/project/components';

function ProjectPage({ params }) {
  return (
    <ProjectErrorBoundary>
      <ProjectDetailClient slug={params.slug} />
    </ProjectErrorBoundary>
  );
}
```

## Best Practices

1. **Component Design**
   - Use composition for complex components
   - Implement loading states for all data-dependent components
   - Handle errors with dedicated error boundaries

2. **Data Management**
   - Implement proper data fetching with loading/error states
   - Use custom hooks to encapsulate data logic
   - Provide type safety for all data operations

3. **Accessibility**
   - Ensure keyboard navigation works for all interactive elements
   - Use proper ARIA attributes for interactive components
   - Maintain proper color contrast for all UI elements

4. **Performance**
   - Lazy load images and heavy components
   - Implement proper virtualization for large lists
   - Use memoization for expensive computations 