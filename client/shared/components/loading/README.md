# Loading Components

This directory contains shared loading components for consistent loading states throughout the application.

## Available Components

### AnimatedBackgroundSkeleton

A reusable animated background skeleton that provides consistent transition animations for loading states.

```tsx
import { AnimatedBackgroundSkeleton } from '@/shared/components/loading';

export function PageLoading() {
  return (
    <AnimatedBackgroundSkeleton>
      <div className="p-8">
        {/* Your loading content here */}
      </div>
    </AnimatedBackgroundSkeleton>
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Content to render on top of the animated background |
| `className` | string | - | Optional class name for the container |
| `gradientDelay` | number | 300 | Delay before showing the gradient background (ms) |
| `contentDelay` | number | 600 | Delay before showing the content (ms) |
| `style` | CSSProperties | - | Optional additional styling |

### TableSkeleton

A reusable skeleton for tables showing a loading state with customizable number of rows, columns, and optional header and pagination.

```tsx
import { TableSkeleton } from '@/shared/components/loading';

export function DataTableLoading() {
  return (
    <TableSkeleton 
      rows={10} 
      columns={5} 
      showHeader={true}
      showPagination={true}
    />
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rows` | number | 5 | Number of skeleton rows to display |
| `className` | string | '' | Additional class name for the container |
| `columns` | number | 4 | Number of columns to display in each row |
| `showHeader` | boolean | true | Whether to show the table header |
| `showPagination` | boolean | true | Whether to show pagination controls |
| `showRowSelection` | boolean | true | Whether to show a row selection checkbox |

### MapSkeleton

A reusable skeleton for map visualizations showing a loading state with customizable height and optional elements.

```tsx
import { MapSkeleton } from '@/shared/components/loading';

export function MapLoading() {
  return (
    <MapSkeleton 
      height="h-[60vh]"
      showControls={true}
      showMarker={true}
    />
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `height` | string | 'h-[70vh]' | Height of the map skeleton |
| `className` | string | '' | Additional class name for the container |
| `showControls` | boolean | true | Whether to show map controls |
| `showMarker` | boolean | true | Whether to show a location marker |
| `minHeight` | string | 'min-h-[400px]' | Custom minimum height |

### ChartSkeleton

A reusable skeleton for various chart types showing a loading state with customizable options. Supports bar, line, pie, distribution and comparison charts.

```tsx
import { ChartSkeleton } from '@/shared/components/loading';

export function AnalyticsLoading() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ChartSkeleton chartType="bar" dataPoints={6} />
      <ChartSkeleton chartType="pie" />
      <ChartSkeleton chartType="line" dataPoints={10} />
      <ChartSkeleton chartType="distribution" dataPoints={8} />
    </div>
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `chartType` | 'bar' \| 'line' \| 'pie' \| 'distribution' \| 'comparison' | 'bar' | Type of chart to display skeleton for |
| `height` | string | 'h-[400px]' | Height of the chart skeleton |
| `className` | string | '' | Additional class name for the container |
| `showTitle` | boolean | true | Whether to show a chart title |
| `showControls` | boolean | true | Whether to show chart controls/legend |
| `dataPoints` | number | 5 | Number of bars/categories to show |

### Card Skeletons

#### BasicCardSkeleton

A basic card skeleton that can be used for most card layouts.

```tsx
import { BasicCardSkeleton } from '@/shared/components/loading';

export function ProductGridLoading() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <BasicCardSkeleton withImage={true} withFooter={true} />
      <BasicCardSkeleton withImage={true} withFooter={true} />
      <BasicCardSkeleton withImage={true} withFooter={true} />
    </div>
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | - | Additional class name for the card |
| `withImage` | boolean | false | Whether to include an image placeholder |
| `withFooter` | boolean | false | Whether to include a footer |
| `descriptionLines` | number | 2 | Number of description lines to show |
| `tagCount` | number | 2 | Number of tag placeholders to show |
| `delay` | number | 0 | Animation delay in milliseconds |
| `animate` | boolean | true | Whether to apply animation styles |

#### ResourceCardSkeleton

A skeleton specifically for resource cards with icon, title, description, and tags.

```tsx
import { ResourceCardSkeleton } from '@/shared/components/loading';

export function ResourcesLoading() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ResourceCardSkeleton tagCount={3} />
      <ResourceCardSkeleton tagCount={3} />
    </div>
  );
}
```

#### HeaderSectionSkeleton

Header section skeleton with title and optional description.

```tsx
import { HeaderSectionSkeleton } from '@/shared/components/loading';

export function PageHeaderLoading() {
  return (
    <HeaderSectionSkeleton 
      titleWidth="w-64" 
      descriptionLines={2} 
      className="mb-8" 
    />
  );
}
```

#### CardGridSkeleton

Grid of card skeletons with animation.

```tsx
import { CardGridSkeleton, BasicCardSkeleton } from '@/shared/components/loading';

export function ProductGridLoading() {
  return (
    <CardGridSkeleton 
      cardCount={6} 
      CardComponent={BasicCardSkeleton} 
      cardProps={{ withImage: true, withFooter: true }} 
      columns={{ sm: 2, lg: 3 }}
    />
  );
}
```

### Other Components

- **LoadingSpinner**: Simple spinner for indicating loading
- **LoadingOverlay**: Full screen overlay with a customizable message
- **SkeletonLoader**: Basic building block for custom skeleton components

## Best Practices

1. For page-level loading, use `AnimatedBackgroundSkeleton`
2. For card grids, use `CardGridSkeleton` with the appropriate card component
3. For headers and sections, use `HeaderSectionSkeleton`
4. For data tables, use `TableSkeleton` with appropriate configuration
5. For map interfaces, use `MapSkeleton` with customized options
6. For charts and analytics, use `ChartSkeleton` with the appropriate chart type
7. When creating custom skeletons, use `SkeletonLoader` as building blocks

## Migration from Feature-Specific Components

If you're using any of these deprecated components:
- `TeamMemberCardSkeleton`
- `ResourcesSkeleton`
- `ContactPageSkeleton`
- Dashboard skeleton components (`DashboardSkeleton`, `TableSkeleton`, `MapSkeleton`, `AnalyticsSkeleton`, etc.)
- Any feature-specific skeleton components

Replace them with the appropriate shared components above. 