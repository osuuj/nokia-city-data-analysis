# Resources Feature

This feature contains components and functionality for the resources pages of the application.

## Directory Structure

- `components/` - UI components for the resources pages
  - `ResourceAccordion.tsx` - Accordion component for displaying resources
  - `ResourceCard.tsx` - Card component for displaying resource summaries
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions
- `utils/` - Utility functions
- `data/` - Data fetching functions
- `store/` - State management

## Components

### ResourceCard

A card component for displaying resource summaries.

```tsx
import { ResourceCard } from '@/features/resources';
import { Resource } from '@/features/resources/types';

function ResourcesList() {
  const resource: Resource = {
    title: 'Resource Title',
    description: 'Resource description',
    icon: 'mdi:book',
    type: 'article',
    link: 'https://example.com',
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

An accordion component for displaying resources by category.

```tsx
import { ResourceAccordion } from '@/features/resources';
import { ResourceCategoryData } from '@/features/resources/types';

function ResourcesPage() {
  const categories: ResourceCategoryData[] = [
    {
      title: 'Category Title',
      resources: [
        {
          title: 'Resource Title',
          description: 'Resource description',
          icon: 'mdi:book',
          type: 'article',
          link: 'https://example.com',
          tags: ['tag1', 'tag2']
        }
      ]
    }
  ];

  return <ResourceAccordion categories={categories} />;
}
```

## Usage

Import components and utilities from the resources feature:

```tsx
import { ResourceCard, ResourceAccordion } from '@/features/resources';
import { Resource, ResourceCategoryData } from '@/features/resources/types';
```

## Best Practices

1. Keep components focused on a single responsibility.
2. Use TypeScript for type safety.
3. Follow the established directory structure.
4. Document components with JSDoc comments.
5. Test components thoroughly. 