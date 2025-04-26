# Resources Feature

This feature contains components and functionality for displaying and managing resources in the application.

## Directory Structure

- `components/` - UI components for the resources feature
  - `ResourceAccordion.tsx` - Collapsible accordion for displaying resource categories
  - `ResourceCard.tsx` - Card component for displaying individual resources
  - `ResourcesContent.tsx` - Main container for displaying resource categories
  - `ResourcesEmpty.tsx` - Component displayed when no resources are available
  - `ResourcesErrorBoundary.tsx` - Error boundary for handling errors in the resources feature
  - `ResourcesSkeleton.tsx` - Loading skeleton for the resources page
  - `VirtualizedResourceList.tsx` - Efficiently renders large lists of resources using virtualization
- `hooks/` - Custom React hooks
  - `useVirtualizedResources.ts` - Hook for managing virtualized resource lists
- `types/` - TypeScript type definitions
- `utils/` - Utility functions
- `data/` - Data fetching functions
- `store/` - State management

## Components

### ResourceCard

A card component for displaying individual resource information.

```tsx
import { ResourceCard } from '@/features/resources';
import { Resource } from '@/features/resources/types';

function ResourceList() {
  const resource: Resource = {
    id: 'example',
    title: 'Example Resource',
    description: 'This is an example resource',
    icon: 'lucide:file',
    type: 'PDF',
    category: 'guides',
    link: '/resources/example',
    tags: ['tag1', 'tag2']
  };

  return (
    <div>
      <ResourceCard resource={resource} />
    </div>
  );
}
```

### ResourceAccordion

A collapsible accordion component for displaying resource categories and their resources.

```tsx
import { ResourceAccordion } from '@/features/resources';
import { ResourceCategoryData } from '@/features/resources/types';

function ResourcesPage() {
  const category: ResourceCategoryData = {
    id: 'guides',
    title: 'Guides & Tutorials',
    description: 'In-depth guides and tutorials',
    icon: 'lucide:book',
    resources: [
      {
        id: 'example',
        title: 'Example Resource',
        description: 'This is an example resource',
        icon: 'lucide:file',
        type: 'PDF',
        link: '/resources/example',
        tags: ['tag1', 'tag2']
      }
    ]
  };

  return <ResourceAccordion category={category} />;
}
```

### ResourcesContent

The main container component that displays a grid of resource categories.

```tsx
import { ResourcesContent } from '@/features/resources';
import { ResourceCategoryData } from '@/features/resources/types';

function ResourcesPage() {
  const categories: ResourceCategoryData[] = [
    {
      id: 'guides',
      title: 'Guides & Tutorials',
      description: 'In-depth guides and tutorials',
      icon: 'lucide:book',
      resources: [/* ... */]
    },
    {
      id: 'templates',
      title: 'Templates',
      description: 'Ready-to-use templates',
      icon: 'lucide:layout',
      resources: [/* ... */]
    }
  ];

  return <ResourcesContent categories={categories} />;
}
```

### VirtualizedResourceList

A component that efficiently renders large lists of resources using virtualization.

```tsx
import { VirtualizedResourceList } from '@/features/resources';
import { Resource } from '@/features/resources/types';

function ResourcesPage() {
  const resources: Resource[] = [/* ... */];

  return (
    <VirtualizedResourceList 
      resources={resources}
      itemHeight={100}
      containerHeight={500}
      overscan={5}
    />
  );
}
```

### ResourcesEmpty

A component displayed when no resources are available.

```tsx
import { ResourcesEmpty } from '@/features/resources';

function ResourcesPage() {
  const hasResources = false;

  if (!hasResources) {
    return <ResourcesEmpty />;
  }

  return <ResourcesContent categories={categories} />;
}
```

### ResourcesErrorBoundary

An error boundary component for handling errors in the resources feature.

```tsx
import { ResourcesErrorBoundary } from '@/features/resources';

function ResourcesPage() {
  return (
    <ResourcesErrorBoundary>
      <ResourcesContent categories={categories} />
    </ResourcesErrorBoundary>
  );
}
```

### ResourcesSkeleton

A loading skeleton component for the resources page.

```tsx
import { ResourcesSkeleton } from '@/features/resources';

function ResourcesPage() {
  const isLoading = true;

  if (isLoading) {
    return <ResourcesSkeleton />;
  }

  return <ResourcesContent categories={categories} />;
}
```

## Usage

Import components from the resources feature:

```tsx
import { 
  ResourceCard, 
  ResourceAccordion, 
  ResourcesContent,
  VirtualizedResourceList,
  ResourcesEmpty,
  ResourcesErrorBoundary,
  ResourcesSkeleton
} from '@/features/resources';
import { Resource, ResourceCategoryData } from '@/features/resources/types';
```

## Best Practices

1. Keep components focused on a single responsibility
2. Use TypeScript for type safety
3. Follow the established directory structure
4. Document components with JSDoc comments
5. Test components thoroughly
6. Use virtualization for large lists to improve performance
7. Implement proper error handling and loading states 