# Contact Feature

This feature contains components and functionality for the contact page of the application.

## Directory Structure

- `components/` - UI components for the contact page
  - `ContactForm` - Main form component with validation and submission handling
  - `ContactPage` - Page layout with contact information and form
  - `ContactErrorBoundary` - Error handling for the contact form
  - `ContactFormSkeleton` - Loading state for the form

- `hooks/` - Custom React hooks
  - `useContactForm` - Form state management and validation

- `types/` - TypeScript type definitions
  - Form-related interfaces
  - API response types

- `data/` - Data fetching and API
  - `contactApi` - API client for form submission

## Usage

Import components and utilities from the contact feature:

```tsx
import { ContactForm, ContactPage } from '@/features/contact';
import { useContactForm } from '@/features/contact';
```

## Features

1. **Form Validation**
   - Real-time field validation
   - Comprehensive error messages
   - Debounced validation for better performance

2. **Error Handling**
   - Dedicated error boundary
   - Graceful error recovery
   - User-friendly error messages

3. **Loading States**
   - Skeleton loading state
   - Form submission loading indicator
   - Smooth animations

4. **API Integration**
   - Robust API client
   - Retry mechanism
   - Error handling

## Best Practices

1. Keep components focused on a single responsibility
2. Use TypeScript for type safety
3. Follow the established directory structure
4. Document components with JSDoc comments
5. Test components thoroughly
6. Use proper error boundaries
7. Implement loading states for better UX 