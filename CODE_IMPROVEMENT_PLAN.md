# Code Improvement Plan

This document outlines specific tasks to improve the codebase by reducing duplication, consolidating similar functionality, and enhancing maintainability.

## 1. Loading State Management

### Tasks:

- [ ] **Consolidate Loading Hooks**
  - Evaluate `client/features/dashboard/hooks/useDashboardLoading.ts` which duplicates functionality available in `client/shared/context/loading/LoadingContext.tsx`
  - Consider refactoring dashboard components to use the shared loading context directly
  - Example refactor: Update `client/features/dashboard/components/views/AnalyticsView/AnalyticsDashboardLoadingState.tsx` to use shared loading context
  - Remove redundant loading state tracking in feature components

- [ ] **Standardize Loading Components**
  - Review and refactor `client/features/contact/components/ContactLoadingSkeleton.tsx` to use shared components
  - Check `client/features/dashboard/components/common/loading/DashboardLoadingState.tsx` and ensure it leverages shared components
  - Create reusable loading skeletons for common UI patterns (cards, tables, sections)
  - Add task in `client/docs/shared/loading.md` to document the standard loading patterns

## 2. Pagination and Data Handling

### Tasks:

- [ ] **Consolidate Pagination Hooks**
  - Analyze and merge `client/features/dashboard/hooks/usePagination.ts` (7777 lines) and `client/features/dashboard/hooks/useDashboardPagination.ts` (1262 lines)
  - Extract core pagination logic to `client/shared/hooks/usePagination.ts`
  - Implementation approach:
    1. Create base hook with pagination state management
    2. Add extension points for feature-specific customization
    3. Update dashboard to use the shared hook

- [ ] **Review Data Fetching Patterns**
  - Standardize based on `client/features/dashboard/hooks/useCompaniesQuery.ts` pattern
  - Create shared data fetching utilities in `client/shared/hooks/useQuery.ts` or similar
  - Implement consistent error handling wrapper for all API calls
  - Consider adding request/response interceptors for global error handling

## 3. Utility Functions

### Tasks:

- [ ] **Move Generic Utilities to Shared**
  - Move `client/features/dashboard/utils/errorReporting.ts` to `client/shared/utils/errorReporting.ts`
  - Evaluate `client/features/dashboard/utils/geo.ts` for shared geographic utilities
  - Extract reusable functions from `client/features/dashboard/utils/lazyLoading.ts` to `client/shared/utils/lazyLoading.ts`
  - Evaluate `client/features/dashboard/utils/filters.ts` for reusable filter patterns

- [ ] **Standardize Format Utilities**
  - Ensure all date formatting uses `client/shared/utils/formatting.ts`
  - Create number formatting utilities if not already present
  - Add address formatting utilities to shared codebase
  - Document formatting standards in shared utils documentation

## 4. Component Structure

### Tasks:

- [ ] **Identify Component Duplication**
  - Compare card components across features:
    - `client/features/project/components/ProjectCard.tsx`
    - `client/features/resources/components/ResourceCard.tsx`
    - `client/features/about/components/ui/TeamMemberCard.tsx`
  - Review all error boundary components:
    - `client/features/landing/components/LandingErrorBoundary.tsx`
    - `client/features/project/components/ProjectErrorBoundary.tsx`
    - `client/features/about/components/layout/AboutErrorBoundary.tsx`
  - Check loading skeleton implementations across features

- [ ] **Extract Common UI Patterns**
  - Create shared `client/shared/components/ui/Card.tsx` component with variants
  - Build standardized grid layout components
  - Implement reusable section layout components for consistent spacing/structure
  - Extract common hero section patterns from features

## 5. Type Definitions

### Tasks:

- [ ] **Consolidate Common Types**
  - Review `client/features/dashboard/types/business.ts` and `client/shared/types/index.ts` for duplicated types
  - Review team member types used in both about and project features
  - Ensure standardized address type definitions across the application
  - Standardize status and category enums across features

- [ ] **Update Import Paths**
  - Check all imports for consistency using: `find client -type f -name "*.ts*" | xargs grep -l "from '\.\./" | wc -l`
  - Replace relative imports with absolute imports using `@/` prefix
  - Update imports for any types that are moved to the shared directory
  - Run static type checker after updates to verify correctness

## 6. Error Handling

### Tasks:

- [ ] **Standardize Error Boundaries**
  - Create a shared `client/shared/components/error/FeatureErrorBoundary.tsx` component
  - Refactor feature-specific error boundaries to use the shared component:
    - `client/features/landing/components/LandingErrorBoundary.tsx`
    - `client/features/project/components/ProjectErrorBoundary.tsx`
    - `client/features/about/components/layout/AboutErrorBoundary.tsx`
  - Add standardized props interface for all error boundaries

- [ ] **Implement Consistent Error Reporting**
  - Use shared error utilities for all API calls
  - Implement consistent error toasts/alerts across the application
  - Create standard error logging format
  - Add retry mechanisms where appropriate

## 7. Context Management

### Tasks:

- [ ] **Evaluate Context Usage**
  - Review all context providers:
    - `client/shared/context/loading/LoadingContext.tsx`
    - Any other contexts in the features directories
  - Check for related contexts that could be combined
  - Ensure no features are recreating existing shared context functionality

- [ ] **Document Context Dependencies**
  - Create a context dependency diagram showing provider nesting requirements
  - Document in `client/docs/shared/context.md`
  - Add provider usage examples to documentation
  - Create a list of all available context hooks and their purposes

## 8. Performance Optimization

### Tasks:

- [ ] **Review Memoization Usage**
  - Audit useMemo/useCallback usage in table components
  - Check consistent use of React.memo for pure components
  - Identify expensive calculations that should be memoized
  - Focus on:
    - Large lists/tables (e.g., `client/features/dashboard/components/views/TableView`)
    - Filter/sort operations
    - Calculation-heavy components

- [ ] **Lazy Loading Analysis**
  - Review current implementation in `client/features/dashboard/components/lazy/LazyComponentWrapper.tsx`
  - Apply consistent lazy loading for all large view components
  - Add loading boundaries around lazily loaded components
  - Measure and document performance improvements

## 9. Code Organization

### Tasks:

- [ ] **Folder Structure Consistency**
  - Standardize component subdirectory structure across features
    - Common pattern seems to be: ui/, layout/, sections/, common/
  - Ensure consistent naming for component files (PascalCase) and utility files (camelCase)
  - Verify consistent use of index.ts barrel files
  - Create documented folder structure standard

- [ ] **Index File Exports**
  - Review all index.ts files for consistency
  - Use named exports rather than default exports where possible
  - Consider using export type * where appropriate for type definitions
  - Ensure index files don't re-export everything from subdirectories unnecessarily

## 10. Documentation

### Tasks:

- [ ] **Update Component Documentation**
  - Ensure all components have proper JSDoc comments
  - Update documentation to reflect refactored code structure
  - Add usage examples for all shared components
  - Add props documentation for all component interfaces

- [ ] **Create Architecture Diagram**
  - Document the application architecture in `client/docs/ARCHITECTURE.md`
  - Create component relationship diagrams for each feature
  - Diagram the shared component usage across features
  - Create data flow diagrams for key features

## Implementation Approach

For each area:

1. First conduct a thorough analysis to identify duplication or overlapping code
   - Use `grep` and `find` to identify patterns
   - Create lists of similar components across features
   - Document current state before refactoring

2. Create tests for existing functionality where needed
   - Use React Testing Library for component tests
   - Test edge cases and error states
   - Ensure test coverage for critical paths

3. Refactor the code while maintaining functionality
   - Make small, incremental changes
   - Test after each significant change
   - Commit frequently with descriptive messages

4. Update component documentation
   - Update JSDoc comments
   - Update README files
   - Add usage examples

5. Update imports across the codebase
   - Use IDE tools to help with refactoring imports
   - Verify type correctness after updates

## Prioritization

Recommended order of implementation:

1. Loading State Management (highest ROI)
   - Immediate benefit: Reduced code duplication and consistent UX
   - Complexity: Medium

2. Utility Functions (easiest wins)
   - Immediate benefit: Code reuse and standardization
   - Complexity: Low

3. Type Definitions (foundational)
   - Immediate benefit: Better type safety and consistency
   - Complexity: Low

4. Error Handling (improves reliability)
   - Immediate benefit: More consistent error recovery
   - Complexity: Medium

5. Pagination and Data Handling (improves performance)
   - Immediate benefit: More consistent data loading
   - Complexity: Medium-High

6. Component Structure (improves maintainability)
   - Immediate benefit: Easier component reuse
   - Complexity: Medium-High

7. Context Management (reduces complexity)
   - Immediate benefit: Simplified state management
   - Complexity: High

8. Performance Optimization (enhances UX)
   - Immediate benefit: Better application responsiveness
   - Complexity: Medium-High

9. Code Organization (improves developer experience)
   - Immediate benefit: Easier codebase navigation
   - Complexity: Low

10. Documentation (ensures knowledge transfer)
    - Immediate benefit: Better onboarding and knowledge sharing
    - Complexity: Low 