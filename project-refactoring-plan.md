# Project Structure Refactoring Plan

## Current Structure Analysis

The project currently has a split structure between:

- `/client/app/project/` - Next.js app router pages
- `/client/features/project/` - Feature-specific components, hooks, and logic

### App Structure
```
client/app/project/
  ├── page.tsx           - Main projects listing page
  ├── metadata.ts        - SEO metadata
  ├── layout.tsx         - Minimal layout component
  └── [id]/              - Dynamic route
      └── page.tsx       - Individual project detail page
```

### Features Structure
```
client/features/project/
  ├── components/        - UI components
  │   ├── ProjectCard.tsx
  │   ├── ProjectDetailClient.tsx
  │   ├── ProjectErrorBoundary.tsx
  │   ├── hero/
  │   ├── ui/
  │   └── index.ts
  ├── config/            - Configuration settings
  │   ├── cache.ts
  │   └── index.ts
  ├── data/              - Sample data and data utilities
  │   ├── sampleProjects.ts
  │   └── index.ts
  ├── hooks/             - Data fetching hooks
  │   ├── useProjects.ts
  │   └── index.ts  
  ├── types/             - Type definitions
  │   ├── schemas.ts
  │   └── index.ts
  ├── utils/             - Empty directory
  └── index.ts           - Feature exports
```

## Identified Issues

1. **Empty directories**: The `utils` directory is empty and should be removed.
2. **Redundant exports**: Multiple index.ts files with duplicated exports.
3. **Unclear separation of concerns**: Mixing of page components and reusable feature components.
4. **Minimal layout component**: The layout.tsx is too simple and doesn't add value.
5. **Complex components**: Some components like ProjectDetailClient are large and could be split.
6. **Circular dependencies**: Types have circular import dependencies.

## Recommended Changes

### 1. Directory Structure

- **Keep app router structure** for routing and pages only
- **Refine features structure** for reusable components
- **Remove empty directories**
- **Simplify exports** in index.ts files

### 2. Component Organization

- Move page-specific UI components closer to their usage in the app directory
- Split larger components into smaller, more focused components
- Ensure components in the features directory are truly reusable

### 3. Code Quality Improvements

- Simplify the export pattern to avoid redundancy
- Enhance type safety throughout the codebase
- Add proper JSDoc comments for better developer experience
- Resolve circular dependencies in type definitions

## Action Items

- [x] Delete the empty `utils` folder
- [x] Simplify index.ts export structures to avoid duplication
- [x] Consider splitting ProjectDetailClient into smaller components
- [x] Either enhance layout.tsx or remove it completely
- [x] Unify the approach to imports and exports
- [x] Resolve circular dependencies in types
- [ ] Make a cleaner separation between page components and reusable components

## Progress Update

- **✅ Empty utils directory**: Removed unused directory
- **✅ Simplified exports**: Updated index.ts to avoid redundant exports
- **✅ Split components**: Created separate components for ProjectCallToAction and ProjectTeamSection
- **✅ Removed layout.tsx**: Eliminated the minimal layout component that didn't add value
- **✅ Fixed type system**: Restructured types to eliminate circular dependencies
- **✅ Improved type organization**: Created enums.ts and improved schemas.ts
- **🔄 Next steps**: Continue to improve separation of concerns between app and features modules

## Recommended Final Structure

```
client/
  ├── app/project/       (Next.js routes only)
  │   ├── page.tsx
  │   ├── [id]/page.tsx
  │   └── metadata.ts
  └── features/project/  (Reusable logic and components)
      ├── components/    (shared reusable components)
      ├── hooks/         (data fetching and business logic)
      ├── types/         (type definitions)
      │   ├── enums.ts   (enums for the project feature)
      │   ├── schemas.ts (zod schemas and derived types)
      │   └── index.ts   (barrel exports)
      ├── config/        (feature configuration)
      └── data/          (sample data and data utils)
```

This structure provides a clearer separation between routing concerns and reusable feature components, making the codebase more maintainable and easier to navigate. 