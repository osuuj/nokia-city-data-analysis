# Project Feature Components

This document provides detailed information about the components used in the project feature.

## Table of Contents
- [ProjectCard](#projectcard)
- [ProjectDetail](#projectdetail)
- [ProjectGrid](#projectgrid)
- [ProjectSkeleton](#projectskeleton)
- [ProjectErrorBoundary](#projecterrorboundary)

## ProjectCard

A card component that displays a preview of a project.

### Features
- Displays project thumbnail
- Shows project title and description
- Lists project tags/categories
- Provides action buttons for viewing details and source code
- Responsive layout

### Usage
```tsx
import { ProjectCard } from '@/features/project/components';

const ProjectList = () => {
  return (
    <ProjectCard
      project={projectData}
      onViewDetails={() => {}}
      onViewSource={() => {}}
    />
  );
};
```

### Implementation Details
- Uses `Card` component from `@heroui/react`
- Implements hover effects for better interactivity
- Optimized image loading with proper aspect ratio
- Memoized to prevent unnecessary re-renders

## ProjectDetail

A comprehensive view of a project's details.

### Features
- Full project description
- Tech stack showcase
- Image gallery
- Project timeline
- Source code links
- Responsive layout

### Usage
```tsx
import { ProjectDetail } from '@/features/project/components';

const ProjectPage = () => {
  return (
    <ProjectDetail
      project={projectData}
      onBack={() => {}}
    />
  );
};
```

### Implementation Details
- Uses dynamic routing for project pages
- Implements image lazy loading
- Includes error handling for missing data
- Supports markdown content in descriptions

## ProjectGrid

A grid layout for displaying multiple project cards.

### Features
- Responsive grid layout
- Filtering and sorting options
- Pagination support
- Loading states

### Usage
```tsx
import { ProjectGrid } from '@/features/project/components';

const ProjectsPage = () => {
  return (
    <ProjectGrid
      projects={projectsData}
      filters={activeFilters}
      onFilterChange={() => {}}
    />
  );
};
```

### Implementation Details
- Uses CSS Grid for layout
- Implements virtual scrolling for large lists
- Supports different view modes (grid/list)
- Handles empty states and loading states

## ProjectSkeleton

Loading state components for project-related views.

### Features
- Card view skeleton
- Detail view skeleton
- Responsive layouts
- Smooth loading animations

### Usage
```tsx
import { ProjectSkeleton } from '@/features/project/components';

const LoadingState = () => {
  return <ProjectSkeleton type="detail" />;
};
```

### Implementation Details
- Uses `Skeleton` component from `@heroui/react`
- Matches the layout of actual components
- Provides visual feedback during data loading
- Supports different view types

## ProjectErrorBoundary

Error boundary component for handling project-related errors.

### Features
- Catches and handles runtime errors
- Provides fallback UI
- Error logging
- Retry functionality

### Usage
```tsx
import { ProjectErrorBoundary } from '@/features/project/components';

const ProjectSection = () => {
  return (
    <ProjectErrorBoundary>
      <ProjectContent />
    </ProjectErrorBoundary>
  );
};
```

### Implementation Details
- Extends React's Error Boundary
- Includes development mode error details
- Provides retry mechanism
- Logs errors to monitoring service

## Component Relationships

The project feature components work together to create a cohesive project showcase experience:

1. `ProjectGrid` serves as the main container, displaying multiple `ProjectCard` components
2. `ProjectCard` provides entry points to `ProjectDetail` views
3. `ProjectSkeleton` provides loading states for both card and detail views
4. `ProjectErrorBoundary` wraps components to handle errors gracefully

This architecture ensures:
- Smooth user experience with proper loading states
- Graceful error handling
- Efficient rendering of project lists
- Consistent styling and behavior across the feature 