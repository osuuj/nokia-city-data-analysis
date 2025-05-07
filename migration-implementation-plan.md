# Skeleton Component Migration Implementation Plan

Based on our analysis of the codebase, we've identified several deprecated skeleton components that need to be migrated to our shared components. This document outlines the specific files to update and the changes needed.

## 1. `DashboardSkeleton` Migration

**Current Usage:**
- `client/features/dashboard/components/common/DashboardPage.tsx` (2 occurrences)

**Migration Steps:**
1. Create a replacement component using our shared components:
   ```tsx
   // In client/features/dashboard/components/common/loading/DashboardLoadingState.tsx
   import { 
     HeaderSectionSkeleton, 
     TableSkeleton 
   } from '@/shared/components/loading';
   
   export function DashboardLoadingState() {
     return (
       <div className="space-y-4 w-full">
         {/* Header section */}
         <HeaderSectionSkeleton titleWidth="w-48" descriptionLines={0} className="flex flex-col sm:flex-row gap-2 justify-between" />
         
         {/* Control panel */}
         <div className="flex flex-wrap gap-2 p-4 bg-default-50 dark:bg-default-50/5 rounded-lg">
           <div className="animate-pulse">
             <div className="h-10 w-48 bg-default-200 dark:bg-default-700 rounded-lg" />
           </div>
           <div className="animate-pulse">
             <div className="h-10 w-32 bg-default-200 dark:bg-default-700 rounded-lg" />
           </div>
           <div className="ml-auto flex gap-2 animate-pulse">
             <div className="h-10 w-24 bg-default-200 dark:bg-default-700 rounded-lg" />
             <div className="h-10 w-10 bg-default-200 dark:bg-default-700 rounded-lg" />
           </div>
         </div>
         
         {/* Content area */}
         <div className="h-[calc(100vh-300px)] min-h-[400px]">
           <TableSkeleton 
             rows={8} 
             columns={4}
             showHeader={true}
             showPagination={true}
           />
         </div>
       </div>
     );
   }
   ```

2. Update `client/features/dashboard/components/common/DashboardPage.tsx` to use the new component:
   ```tsx
   // Old
   import { DashboardSkeleton } from '@/features/dashboard/components/common/loading/Skeletons';
   // ...
   <DashboardSkeleton />
   
   // New
   import { DashboardLoadingState } from '@/features/dashboard/components/common/loading/DashboardLoadingState';
   // ...
   <DashboardLoadingState />
   ```

## 2. `SectionSkeleton` Migration

**Current Usage:**
- `client/features/dashboard/components/controls/Toggles/ViewSwitcher.tsx` (1 occurrence)
- AnalyticsDashboardSkeleton in Skeletons.tsx

**Migration Steps:**
1. Update ViewSwitcher.tsx:
   ```tsx
   // Old
   import { SectionSkeleton } from '../../../components/common/loading/Skeletons';
   // ...
   <Suspense fallback={<SectionSkeleton section="map" />}>
   
   // New
   import { MapSkeleton } from '@/shared/components/loading';
   // ...
   <Suspense fallback={<MapSkeleton height="h-[400px]" showControls={true} />}>
   ```

## 3. Other Skeletons to Check

### `MapSkeleton`
- Already replaced in ViewSwitcher.tsx with shared ChartSkeleton
- Need to check for other usages

### `TableSkeleton`
- Already used in DashboardSkeleton

### `AnalyticsSkeleton`
- Already replaced in ViewSwitcher.tsx with shared ChartSkeleton
- Check for other usages

## 4. Final Clean-up

After confirming all migrations and thorough testing:

1. Remove deprecated exports from loading/index.ts:
   ```tsx
   // Old
   export * from './Skeletons';
   
   // New
   // No replacement needed as we're removing these exports
   ```

2. Delete the deprecated file:
   ```
   client/features/dashboard/components/common/loading/Skeletons.tsx
   ```

## Testing Plan

For each component:

1. Verify visual appearance in:
   - Light mode
   - Dark mode
   - Mobile view
   - Desktop view

2. Check loading behavior:
   - Animation works correctly
   - Dimensions match the content it's replacing
   - No console errors

## Timeline

1. Create DashboardLoadingState component - Day 1
2. Update ViewSwitcher to use MapSkeleton - Day 1
3. Test all changes - Day 2
4. Final clean-up - Day 3 