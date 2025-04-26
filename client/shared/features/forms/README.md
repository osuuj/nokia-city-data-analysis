# Forms Feature

This feature contains components, hooks, and utilities for form handling in the application.

## Directory Structure

- `components/`: React components for form UI
- `hooks/`: Custom React hooks for form logic
- `utils/`: Utility functions for form validation and handling
- `types/`: TypeScript type definitions for forms

## Components

### ContactForm

A reusable contact form component that handles form submission and validation.

```tsx
import { ContactForm } from '@/shared/features/forms/components/ContactForm';

function ContactPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
      <ContactForm />
    </div>
  );
}
```

## Hooks

### useForm

A custom hook for managing form state and validation.

```tsx
import { useForm } from '@/shared/features/forms/hooks/useForm';

function LoginForm() {
  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      // Handle form submission
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Types

### FormField

```typescript
interface FormField {
  value: string;
  error?: string;
  touched: boolean;
  dirty: boolean;
}
```

### FormState

```typescript
interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}
```

## Dependencies

- `react`: For React components and hooks
- `@heroui/react`: For UI components
- `framer-motion`: For animations

## Usage Notes

- Form components are designed to be reusable across the application
- Form hooks provide a consistent way to handle form state and validation
- Form utilities help with common form operations like validation and submission 