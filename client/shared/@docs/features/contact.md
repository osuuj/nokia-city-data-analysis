# Contact Feature

This document provides documentation for the Contact feature of the application.

## Components

See [Contact Components](../components/contact.md) for detailed component documentation.

## Architecture

The Contact feature is structured with a modular architecture:

```
features/contact/
├── components/        # UI components
├── data/              # Data models and API functions
├── hooks/             # Custom React hooks
├── types/             # TypeScript types and interfaces
├── utils/             # Utility functions and helpers
│   └── validation.ts  # Zod schemas for form validation
└── docs/              # Feature documentation
```

### Key Architectural Decisions

1. **Form Management**: Using React Hook Form for form state management and validation
2. **Data Handling**: Using React Query mutations for form submission
3. **Validation**: Using Zod for schema validation
4. **Component Structure**: Breaking down form into modular field components
5. **Styling**: Using Tailwind CSS for styling with consistent design tokens

## State Management

The Contact feature primarily uses local component state and React Query for mutations:

### Form State

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/features/contact/utils/validation';

// In ContactForm component
const {
  register,
  handleSubmit,
  reset,
  formState: { errors, isDirty, isValid }
} = useForm({
  resolver: zodResolver(contactSchema),
  mode: 'onChange'
});
```

### Submission State

```tsx
import { useMutation } from '@tanstack/react-query';
import { submitContactForm } from '@/features/contact/data';

export function useContactSubmit() {
  return useMutation({
    mutationFn: submitContactForm,
    onSuccess: (data) => {
      // Handle success
    },
    onError: (error) => {
      // Handle error
    }
  });
}
```

### UI State

```tsx
// UI state uses React's useState
const [isSubmitted, setIsSubmitted] = useState(false);
const [activeTab, setActiveTab] = useState('form');
```

## Data Flow

1. User fills out the contact form
2. Real-time validation occurs as fields are filled
3. On submission, the form data is validated against Zod schema
4. If valid, data is sent to the API using React Query mutation
5. Based on the response, success or error state is displayed
6. On successful submission, form is reset and success message is shown

## Form Validation

The Contact form uses Zod for schema validation:

```tsx
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  company: z.string().optional(),
  phone: z.string().optional()
});

export type ContactFormValues = z.infer<typeof contactSchema>;
```

## Error Handling

1. **Form Validation Errors**: Displayed inline next to each field
2. **API Errors**: Displayed as a notification at form level
3. **Network Errors**: Handled with retry mechanism and fallback UI

## Accessibility

The Contact feature implements these accessibility features:

1. Semantic HTML structure
2. ARIA labels and attributes
3. Keyboard navigation support
4. Focus management
5. Error announcements for screen readers

## Testing Strategy

1. **Unit Tests**: For individual form fields and validation functions
2. **Integration Tests**: For form submission and error handling
3. **End-to-End Tests**: For complete form flow

## Localization

The Contact form supports multiple languages:

```tsx
import { useTranslation } from 'next-i18next';

// In component
const { t } = useTranslation('contact');

// Usage
<label>{t('form.name.label')}</label>
<ErrorMessage>{t(error.message)}</ErrorMessage>
``` 