# Resources Feature

The Resources feature provides a structured way to display informational content, downloads, and reference materials in the application. It organizes resources into categories, with customizable cards and accordions for intuitive navigation and discovery.

## Overview

- **Resource Categories**: Organize resources into logical groups
- **Resource Cards**: Visual cards with icons, descriptions, and tags
- **Expandable Accordions**: Collapsible sections for better organization
- **Loading States**: Dedicated skeleton components for loading feedback
- **Error Handling**: Graceful error recovery mechanisms
- **Responsive Design**: Adapts to different screen sizes

## Directory Structure

```
client/features/resources/
├── components/               # UI components
│   ├── ResourceAccordion.tsx # Expandable category component
│   ├── ResourceCard.tsx      # Individual resource card
│   ├── ResourcesHeader.tsx   # Section header component 
│   ├── ResourcesSkeleton.tsx # Loading skeleton component
│   └── index.ts              # Component exports
├── data/                     # Data handling
│   ├── resources.ts          # Resource data
│   └── index.ts              # Data exports
├── hooks/                    # Custom React hooks
│   ├── useResources.ts       # Resources data hook
│   └── index.ts              # Hook exports
├── types/                    # TypeScript types
│   └── index.ts              # Type definitions
└── index.ts                  # Feature exports
```

## Key Components

### Main Components

- **ResourceCard**: Card component displaying a single resource with icon, title, description, and tags
- **ResourceAccordion**: Expandable component that groups resources by category
- **ResourcesHeader**: Section header for resource listings
- **ResourcesSkeleton**: Loading state component for resources sections

## Component Hierarchy

```
ResourcesPage
├── ResourcesErrorBoundary
│   ├── ResourcesHeader
│   ├── ResourcesSkeleton (during loading)
│   └── ResourcesContent
│       ├── ResourceAccordion (multiple)
│       │   └── ResourceCard (multiple)
│       └── ResourcesEmpty (conditional)
```

## Shared Component Usage

The Resources feature leverages several shared components:

```tsx
// Background and theme
import { TransitionBackground } from '@/shared/components/ui/background';
import { gradientColors } from '@/shared/utils/backgroundConfig';

// Loading components
import { CardGridSkeleton, CardSkeleton } from '@/shared/components/loading';

// Error handling
import { ErrorDisplay } from '@/shared/components/error';
```

## Data Management

The Resources feature uses custom hooks for data management:

```tsx
import { useResources } from '@/features/resources/hooks';

function ResourcesPage() {
  const { 
    resources,
    categories,
    isLoading, 
    error,
    filterByCategory,
    filterByTag,
    searchResources
  } = useResources();
  
  // Component implementation
}
```

## Core Types

```typescript
export interface Resource {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: ResourceType;
  category: string;
  link: string;
  tags: string[];
}

export interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ResourceCategoryData extends ResourceCategory {
  resources: Resource[];
}

export type ResourceType = 'PDF' | 'DOC' | 'XLS' | 'ZIP' | 'LINK' | 'VIDEO';
```

## Usage Examples

### Resource Cards Grid

```tsx
import { ResourceCard } from '@/features/resources/components';

function ResourcesGrid({ resources }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map(resource => (
        <ResourceCard
          key={resource.id}
          resource={resource}
        />
      ))}
    </div>
  );
}
```

### Resource Categories with Accordions

```tsx
import { ResourceAccordion } from '@/features/resources/components';

function ResourcesCategories({ categories }) {
  return (
    <div className="space-y-6">
      {categories.map(category => (
        <ResourceAccordion
          key={category.id}
          category={category}
        />
      ))}
    </div>
  );
}
```

### Complete Resources Page

```tsx
import { 
  ResourceAccordion, 
  ResourcesHeader,
  ResourcesSkeleton
} from '@/features/resources/components';
import { useResources } from '@/features/resources/hooks';
import { ErrorDisplay } from '@/shared/components/error';

function ResourcesPage() {
  const { categories, isLoading, error } = useResources();
  
  if (isLoading) {
    return <ResourcesSkeleton />;
  }
  
  if (error) {
    return <ErrorDisplay error={error} />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ResourcesHeader title="Helpful Resources" />
      <div className="space-y-6 mt-8">
        {categories.map(category => (
          <ResourceAccordion
            key={category.id}
            category={category}
          />
        ))}
      </div>
    </div>
  );
}
```

## Best Practices

1. **Component Design**
   - Use ResourceCard for individual resources
   - Group related resources with ResourceAccordion
   - Implement loading states for all data-fetching operations
   - Keep components focused on a single responsibility

2. **Data Management**
   - Use the useResources hook for data fetching and filtering
   - Implement proper error handling for API requests
   - Use TypeScript for type safety throughout

3. **Accessibility**
   - Ensure all interactive elements are keyboard accessible
   - Use proper ARIA attributes for accordions and expandable sections
   - Provide alt text for all resource icons and images

4. **Performance**
   - Lazy load resources that aren't immediately visible
   - Implement pagination for large resource collections
   - Use memoization to prevent unnecessary re-renders 