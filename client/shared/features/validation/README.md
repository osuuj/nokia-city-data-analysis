# Validation Feature

This feature contains utilities and hooks for form and data validation.

## Directory Structure

- `utils/`: Utility functions for validation
- `hooks/`: Custom React hooks for form validation
- `types/`: TypeScript type definitions for validation

## Validation Utilities

### Email Validation

```typescript
import { validateEmail } from '@/shared/features/validation/utils/email';

const isValid = validateEmail('user@example.com');
```

### Password Validation

```typescript
import { validatePassword } from '@/shared/features/validation/utils/password';

const { isValid, errors } = validatePassword('password123', {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
});
```

### Form Validation

```typescript
import { useFormValidation } from '@/shared/features/validation/hooks/useFormValidation';

const { values, errors, handleChange, handleSubmit, isValid } = useFormValidation({
  initialValues: {
    name: '',
    email: '',
    message: '',
  },
  validationSchema: {
    name: { required: true, minLength: 2 },
    email: { required: true, email: true },
    message: { required: true, minLength: 10 },
  },
  onSubmit: (values) => {
    console.log('Form submitted:', values);
  },
});
```

## Dependencies

- `react`: For React hooks
- `zod`: For schema validation (optional)

## Usage Notes

- The validation utilities are designed to work with HeroUI components
- The validation hooks provide a simple API for form validation
- The validation types provide TypeScript type definitions for validation 