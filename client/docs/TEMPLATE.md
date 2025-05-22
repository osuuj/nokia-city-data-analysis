# Feature Name

Brief description of the feature, its purpose and main functionality.

## Overview

- **Key Feature 1**: Description
- **Key Feature 2**: Description
- **Key Feature 3**: Description
- **Loading States**: Description
- **Error Handling**: Description
- **Responsive Design**: Description

## Directory Structure

```
client/features/feature-name/
├── components/               # UI components
│   ├── sub-component/        # Grouped components
│   │   ├── Component1.tsx    # Component description
│   │   └── index.ts          # Component exports
│   ├── Component2.tsx        # Component description
│   └── index.ts              # Component exports
├── config/                   # Configuration
│   └── constants.ts          # Feature constants
├── data/                     # Data handling
│   ├── api.ts                # API client
│   └── mockData.ts           # Sample data
├── hooks/                    # Custom React hooks
│   ├── useFeatureData.ts     # Data hook
│   └── index.ts              # Hook exports
├── types/                    # TypeScript types
│   └── index.ts              # Type definitions
└── index.ts                  # Feature exports
```

## Key Components

### Main Components

- **Component1**: Description and purpose
- **Component2**: Description and purpose

### UI Components

- **SubComponent1**: Description and purpose
- **SubComponent2**: Description and purpose

## Component Hierarchy

```
FeaturePage
├── ErrorBoundary
│   └── MainComponent
│       ├── SubComponent1
│       └── SubComponent2
```

## Shared Component Usage

The Feature leverages several shared components:

```tsx
// Background and theme
import { TransitionBackground } from '@/shared/components/ui/background';
import { gradientColors } from '@/shared/utils/backgroundConfig';

// Loading components
import { ComponentSkeleton } from '@/shared/components/loading';

// Error handling
import { ErrorDisplay } from '@/shared/components/error';
```

## Data Management

```tsx
import { useFeatureData } from '@/features/feature-name/hooks';

function FeaturePage() {
  const { 
    data,
    isLoading, 
    error
  } = useFeatureData();
  
  // Component implementation
}
```

## Core Types

```typescript
export interface FeatureDataType {
  id: string;
  title: string;
  // Other properties
}

export enum FeatureEnum {
  Option1 = 'option1',
  Option2 = 'option2'
}
```

## Usage Examples

### Example 1

```tsx
import { Component1 } from '@/features/feature-name/components';

function Example() {
  return (
    <Component1
      prop1="value"
      prop2={123}
    />
  );
}
```

### Example 2

```tsx
import { Component2 } from '@/features/feature-name/components';

function AnotherExample() {
  // Implementation
}
```

## Best Practices

1. **Component Design**
   - Best practice 1
   - Best practice 2

2. **Data Management**
   - Best practice 1
   - Best practice 2

3. **Accessibility**
   - Best practice 1
   - Best practice 2

4. **Performance**
   - Best practice 1
   - Best practice 2 