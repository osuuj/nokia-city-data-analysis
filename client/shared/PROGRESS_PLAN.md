# Dashboard Feature Refactoring Progress

## Tech Stack and Architecture

This feature is part of a Next.js application built with:
- **Next.js**: For server-side rendering and routing
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For styling and responsive design
- **HeroUI**: For UI components and design system
- **Feature-based Architecture**: Each feature is self-contained with its own components, hooks, types, and utilities
- **FastAPI Backend**: For API endpoints and data fetching
- **PostgreSQL**: For data storage
- **Mapbox**: For data visualization and mapping

The application follows a feature-based architecture where each feature is self-contained and follows a consistent structure:
- `components/`: UI components specific to the feature
- `hooks/`: Custom React hooks for feature-specific logic
- `types/`: TypeScript type definitions
- `utils/`: Utility functions
- `data/`: Data fetching and API integration
- `store/`: State management (if needed)

## App Structure Overview

The app folder contains Next.js pages and API routes with the following structure:
- **Key Pages**:
  - Home page (`page.tsx`)
  - Project pages (`project/page.tsx`, `project/[id]/page.tsx`)
  - Contact page (`contact/page.tsx`)
  - Dashboard page (`dashboard/page.tsx`)
  - About page (`about/page.tsx`)
  - Resources page (`resources/page.tsx`)

- **API Routes**:
  - Avatar API (`api/avatar/`)
  - Cities API (`api/cities/`)
  - Analytics API (`api/analytics/`)
  - Companies API (`api/companies/`)

---

## Shared Folder Refactoring Plan

### Insights from Feature Folder Analysis
- The feature folders follow a highly consistent and modular structure, which improves maintainability and discoverability.
- The shared folder should mirror this structure as much as possible, so that shared code is just as easy to navigate and maintain as feature code.
- Only include folders in shared that are actually needed; remove empty or placeholder folders.
- Ensure all subfolders have an `index.ts` for clean imports, just like in features.
- Document the structure and conventions in a `README.md` for the shared folder.

### Recommended Structure for Shared Folder
```
shared/
├── components/
├── hooks/
├── types/
├── utils/
├── data/
├── config/
├── store/
├── context/
├── schemas/
├── docs/
├── __tests__/
├── README.md
└── index.ts
```
- Only include folders that are actually needed for shared code.
- Remove empty or placeholder folders/files.

### Updated Checklist

#### 1. Remove Unused and Empty Folders
- [ ] Identify and delete all empty folders in `shared/`. (Checked: notification/hooks and notification/utils were empty/non-existent and are now confirmed handled)
- [ ] Remove folders that only contain placeholder files and are not planned for near-term use.

#### 2. Remove Unused Components and Files
- [ ] Search for components, hooks, and utilities in `shared/` that are not imported anywhere in the codebase.
- [ ] Delete or archive these unused files.

#### 3. Consolidate and Refactor Duplicates
- [ ] Identify duplicate or near-duplicate utilities, hooks, or components.
- [ ] Consolidate them into a single, reusable version.

#### 4. Standardize Exports and Index Files
- [ ] Ensure each subfolder (`components`, `hooks`, `utils`, etc.) has a clear and consistent `index.ts` export file.
- [ ] Remove or update any outdated or inconsistent export patterns.

#### 5. Move Feature-Specific Code Out
- [ ] Audit `shared/` for code that is only used by a single feature.
- [ ] Move such code to the appropriate feature folder.

#### 6. Document Structure and Conventions
- [ ] Update or add a `README.md` in `shared/` to document the intended structure, usage, and conventions.

#### 7. Automate Dead Code Detection
- [ ] Integrate tools like ESLint, TS-Prune, or Unused-Exports to help identify unused exports and files.

#### 8. Review for Consistency
- [ ] Check naming conventions, file/folder structure, and code style for consistency across `shared/`.

#### 9. Optimize for Reusability
- [ ] Refactor components/utilities that are almost reusable but have feature-specific logic.
- [ ] Generalize them for broader use if possible.

#### 10. Add/Improve Tests for Shared Logic
- [ ] Ensure that critical shared utilities and components have unit tests.
- [ ] Add or update tests as needed.

---

**Progress Tracking:**
- Use this checklist to track your progress as you clean up and optimize the `shared/` folder.
- Check off each item as it is completed. 