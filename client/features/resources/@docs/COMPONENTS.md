# Resources Feature Components

This document provides an overview of the components used in the resources feature of the application.

## Table of Contents

- [ResourceCard](#resourcecard)
- [ResourceAccordion](#resourceaccordion)
- [VirtualizedResourceList](#virtualizedresourcelist)
- [ResourcesContent](#resourcescontent)
- [ResourcesEmpty](#resourcesempty)
- [ResourcesErrorBoundary](#resourceserrorboundary)
- [ResourcesSkeleton](#resourcesskeleton)

## ResourceCard

The `ResourceCard` component is responsible for displaying a single resource in a card format.

### Features

- Displays resource title, description, and metadata
- Handles resource selection
- Provides visual feedback for selected state
- Optimized rendering with React.memo

### Usage

```tsx
import { ResourceCard } from './ResourceCard';
import type { Resource } from '../types';

const MyComponent = () => {
  const resource: Resource = {
    id: '1',
    title: 'Sample Resource',
    description: 'This is a sample resource',
    // other resource properties
  };

  return (
    <ResourceCard
      resource={resource}
      isSelected={false}
      onSelect={() => console.log('Resource selected')}
    />
  );
};
```

### Implementation Details

- Uses CSS Grid for layout
- Implements hover and focus states for accessibility
- Handles long text with ellipsis
- Supports keyboard navigation

## ResourceAccordion

The `ResourceAccordion` component provides an expandable/collapsible section for resource details.

### Features

- Smooth expand/collapse animations
- Accessible keyboard navigation
- Customizable header and content
- Maintains state across renders

### Usage

```tsx
import { ResourceAccordion } from './ResourceAccordion';

const MyComponent = () => {
  return (
    <ResourceAccordion
      title="Resource Details"
      defaultOpen={false}
    >
      <div>Resource content goes here</div>
    </ResourceAccordion>
  );
};
```

### Implementation Details

- Uses CSS transitions for animations
- Implements ARIA attributes for accessibility
- Supports controlled and uncontrolled modes
- Handles nested accordions

## VirtualizedResourceList

The `VirtualizedResourceList` component efficiently renders a large list of resources using virtualization techniques.

### Features

- Only renders visible resources
- Smooth scrolling performance
- Configurable item height and container height
- Adjustable overscan area

### Usage

```tsx
import { VirtualizedResourceList } from './VirtualizedResourceList';
import type { Resource } from '../types';

const MyComponent = () => {
  const resources: Resource[] = [/* array of resources */];

  return (
    <VirtualizedResourceList
      resources={resources}
      itemHeight={100}
      containerHeight={500}
      overscan={5}
    />
  );
};
```

### Implementation Details

- Uses the `useVirtualizedResources` hook for virtualization logic
- Calculates visible items based on scroll position
- Maintains absolute positioning for optimal performance
- Supports dynamic height adjustments

## ResourcesContent

The `ResourcesContent` component serves as the main container for displaying resources.

### Features

- Manages resource data fetching and state
- Handles loading and error states
- Provides search and filtering capabilities
- Implements responsive layout

### Usage

```tsx
import { ResourcesContent } from './ResourcesContent';

const MyComponent = () => {
  return (
    <ResourcesContent
      initialFilters={{}}
      onFilterChange={(filters) => console.log('Filters changed', filters)}
    />
  );
};
```

### Implementation Details

- Uses React Query for data fetching
- Implements responsive grid layout
- Handles empty and error states
- Provides search functionality

## ResourcesEmpty

The `ResourcesEmpty` component displays a message when no resources are available.

### Features

- Customizable empty state message
- Optional action button
- Responsive design
- Animated illustrations

### Usage

```tsx
import { ResourcesEmpty } from './ResourcesEmpty';

const MyComponent = () => {
  return (
    <ResourcesEmpty
      message="No resources found"
      actionLabel="Clear filters"
      onAction={() => console.log('Action clicked')}
    />
  );
};
```

### Implementation Details

- Uses SVG illustrations
- Implements responsive layout
- Supports custom actions
- Maintains consistent styling

## ResourcesErrorBoundary

The `ResourcesErrorBoundary` component handles errors in the resource feature.

### Features

- Catches and displays resource-related errors
- Provides error recovery options
- Logs errors for debugging
- Maintains application stability

### Usage

```tsx
import { ResourcesErrorBoundary } from './ResourcesErrorBoundary';
import { ResourcesContent } from './ResourcesContent';

const MyComponent = () => {
  return (
    <ResourcesErrorBoundary>
      <ResourcesContent />
    </ResourcesErrorBoundary>
  );
};
```

### Implementation Details

- Extends React's ErrorBoundary
- Provides detailed error information in development
- Implements fallback UI
- Supports error reporting

## ResourcesSkeleton

The `ResourcesSkeleton` component provides a loading state for resources.

### Features

- Animated loading placeholder
- Matches the layout of actual resources
- Configurable number of skeleton items
- Responsive design

### Usage

```tsx
import { ResourcesSkeleton } from './ResourcesSkeleton';

const MyComponent = () => {
  return (
    <ResourcesSkeleton
      count={5}
      itemHeight={100}
    />
  );
};
```

### Implementation Details

- Uses CSS animations for loading effect
- Maintains consistent spacing with actual content
- Implements progressive loading
- Supports dark mode

## Component Relationships

The resources feature components work together to create a robust resource management system:

1. `ResourcesErrorBoundary` wraps the entire feature to catch and handle errors
2. `ResourcesContent` manages the main content area and data fetching
3. `VirtualizedResourceList` efficiently renders the resource list
4. `ResourceCard` displays individual resources
5. `ResourceAccordion` provides expandable sections for resource details
6. `ResourcesEmpty` and `ResourcesSkeleton` handle empty and loading states 