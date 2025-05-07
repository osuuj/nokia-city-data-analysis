# Skeleton Component Migration Guide

This guide helps you migrate from feature-specific skeleton components to the new shared skeleton components.

## Why Migrate?

1. **Consistency**: Unified loading experience across the application
2. **Maintainability**: Updates to loading states can be made in one place
3. **Reduced Bundle Size**: Eliminating duplicate code improves performance
4. **Flexibility**: The shared components are more configurable

## Migration Mapping

### Dashboard Components

| Old Component | Replacement | Notes |
|---------------|-------------|-------|
| `DashboardSkeleton` | Combination of `HeaderSectionSkeleton` + `TableSkeleton` | For dashboard layout |
| `TableSkeleton` | `TableSkeleton` from shared | More configurable with `columns`, `showHeader`, etc. |
| `MapSkeleton` | `MapSkeleton` from shared | More configurable with options for controls and markers |
| `AnalyticsSkeleton` | `ChartSkeleton` from shared | Specify `chartType` based on visualization type |
| `SectionSkeleton` | `HeaderSectionSkeleton` | For section headers/titles |

### Feature-Specific Components

| Old Component | Replacement | Notes |
|---------------|-------------|-------|
| `TeamMemberCardSkeleton` | `BasicCardSkeleton` | Use `withImage` and `tagCount` props |
| `ResourcesSkeleton` | `AnimatedBackgroundSkeleton` + other components | Combine to create page layout |
| `ContactPageSkeleton` | `AnimatedBackgroundSkeleton` + other components | Combine to create page layout |

## Migration Examples

### Migrating a Dashboard Table

**Before:**
```tsx
import { TableSkeleton } from '@/features/dashboard/components/common/loading/Skeletons';

export function DashboardTableSection() {
  return (
    <div className="my-4">
      <TableSkeleton rows={10} />
    </div>
  );
}
```

**After:**
```tsx
import { TableSkeleton } from '@/shared/components/loading';

export function DashboardTableSection() {
  return (
    <div className="my-4">
      <TableSkeleton 
        rows={10} 
        columns={4} 
        showHeader={true} 
        showPagination={true}
      />
    </div>
  );
}
```

### Migrating an Analytics Dashboard

**Before:**
```tsx
import { 
  AnalyticsSkeleton, 
  SectionSkeleton 
} from '@/features/dashboard/components/common/loading/Skeletons';

export function AnalyticsDashboardLoading() {
  return (
    <div className="space-y-4">
      <SectionSkeleton section="header" />
      <div className="grid grid-cols-2 gap-4">
        <AnalyticsSkeleton type="distribution" />
        <AnalyticsSkeleton type="pieChart" />
        <AnalyticsSkeleton type="comparison" />
      </div>
    </div>
  );
}
```

**After:**
```tsx
import { 
  ChartSkeleton, 
  HeaderSectionSkeleton 
} from '@/shared/components/loading';

export function AnalyticsDashboardLoading() {
  return (
    <div className="space-y-4">
      <HeaderSectionSkeleton titleWidth="w-64" descriptionLines={1} />
      <div className="grid grid-cols-2 gap-4">
        <ChartSkeleton chartType="distribution" dataPoints={10} />
        <ChartSkeleton chartType="pie" />
        <ChartSkeleton chartType="comparison" dataPoints={5} />
      </div>
    </div>
  );
}
```

### Migrating a Map View

**Before:**
```tsx
import { MapSkeleton } from '@/features/dashboard/components/common/loading/Skeletons';

export function MapPageLoading() {
  return (
    <div className="container">
      <h1>Map Loading</h1>
      <MapSkeleton />
    </div>
  );
}
```

**After:**
```tsx
import { MapSkeleton } from '@/shared/components/loading';

export function MapPageLoading() {
  return (
    <div className="container">
      <h1>Map Loading</h1>
      <MapSkeleton 
        height="h-[80vh]" 
        showControls={true}
        showMarker={true}
      />
    </div>
  );
}
```

### Migrating a Page with Full Background

**Before:**
```tsx
import { ResourceCardSkeleton } from '@/features/resources/components/ResourceCardSkeleton';

export function ResourcesPageLoading() {
  // Custom background and transition logic here
  // ...

  return (
    <div className={`relative w-full min-h-screen ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      <div className="grid grid-cols-2 gap-4">
        <ResourceCardSkeleton />
        <ResourceCardSkeleton />
      </div>
    </div>
  );
}
```

**After:**
```tsx
import { 
  AnimatedBackgroundSkeleton, 
  ResourceCardSkeleton 
} from '@/shared/components/loading';

export function ResourcesPageLoading() {
  return (
    <AnimatedBackgroundSkeleton>
      <div className="grid grid-cols-2 gap-4">
        <ResourceCardSkeleton tagCount={3} />
        <ResourceCardSkeleton tagCount={3} />
      </div>
    </AnimatedBackgroundSkeleton>
  );
}
```

## ChartSkeleton Type Mapping

When replacing `AnalyticsSkeleton`, use this mapping to determine the correct `chartType`:

| Old `type` | New `chartType` |
|------------|----------------|
| `distribution` | `distribution` |
| `comparison` | `comparison` |
| `cityComparison` | `comparison` |
| `trends` | `line` |
| `pieChart` | `pie` |
| `barChart` | `bar` |

## Testing After Migration

After migrating to the new components, make sure to:

1. Verify the skeleton has the correct dimensions and layout
2. Test in both light and dark modes
3. Check animations and transitions work correctly
4. Ensure there are no console errors or warnings

## Deprecation Timeline

We plan to keep the old components for backward compatibility until all usages have been migrated to the new shared components. After that, we'll remove them entirely.

## Need Help?

If you have any questions or need assistance migrating your components, please reach out to the UI team. 