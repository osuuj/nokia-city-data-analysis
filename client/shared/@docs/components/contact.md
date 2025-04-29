# Contact Feature Components

This document describes the components used in the Contact feature of the application.

## Directory Structure

```
features/contact/components/
├── ContactForm.tsx        # Main contact form component
├── ContactSuccess.tsx     # Success message component
├── ContactMap.tsx         # Office location map component
├── ContactInfo.tsx        # Contact information component
├── fields/                # Form field components
│   ├── NameField.tsx
│   ├── EmailField.tsx
│   ├── MessageField.tsx
│   ├── SubjectField.tsx
│   └── index.ts
└── index.ts               # Export file
```

## Core Components

### ContactPage

The main component for the Contact page, which composes various contact components.

```tsx
import {
  ContactForm,
  ContactMap,
  ContactInfo
} from '@/features/contact/components';

export default function ContactPage() {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <div className="contact-grid">
        <div className="form-section">
          <ContactForm />
        </div>
        <div className="info-section">
          <ContactInfo />
          <ContactMap />
        </div>
      </div>
    </div>
  );
}
```

### ContactForm

The main form component for submitting contact requests.

```tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/features/contact/utils/validation';
import {
  NameField,
  EmailField,
  SubjectField,
  MessageField
} from '@/features/contact/components/fields';
import { Button } from '@/shared/components/ui';
import { useContactSubmit } from '@/features/contact/hooks';
import { ContactSuccess } from '@/features/contact/components';

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate, isLoading, error } = useContactSubmit();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(contactSchema)
  });
  
  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => setIsSubmitted(true)
    });
  };
  
  if (isSubmitted) {
    return <ContactSuccess />;
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
      <NameField register={register} error={errors.name} />
      <EmailField register={register} error={errors.email} />
      <SubjectField register={register} error={errors.subject} />
      <MessageField register={register} error={errors.message} />
      
      {error && (
        <div className="error-message">
          {error.message || 'An error occurred. Please try again.'}
        </div>
      )}
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
```

### ContactMap

Component for displaying office locations on a map.

```tsx
import { useEffect, useRef } from 'react';
import { useOfficeLocations } from '@/features/contact/hooks';
import { MapPin } from '@/shared/icons';

export function ContactMap() {
  const mapRef = useRef(null);
  const { data: locations, isLoading } = useOfficeLocations();
  
  useEffect(() => {
    if (!mapRef.current || isLoading || !locations) return;
    
    // Initialize map and add markers (implementation depends on map library)
    // ...
  }, [locations, isLoading]);
  
  if (isLoading) return <div className="map-loading">Loading map...</div>;
  
  return (
    <div className="contact-map">
      <h2>Our Offices</h2>
      <div ref={mapRef} className="map-container">
        {/* Map will be initialized here */}
      </div>
      <div className="location-list">
        {locations?.map(location => (
          <div key={location.id} className="location-item">
            <MapPin className="icon" />
            <div>
              <strong>{location.name}</strong>
              <p>{location.address}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Form Field Components

Each field component is encapsulated for reusability:

```tsx
// Example: EmailField.tsx
import { ForwardedRef, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';
import { FormField, Input } from '@/shared/components/ui';

interface EmailFieldProps {
  register: any;
  error?: FieldError;
}

export const EmailField = forwardRef(
  ({ register, error }: EmailFieldProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <FormField label="Email" error={error?.message}>
        <Input
          type="email"
          placeholder="your.email@example.com"
          {...register('email')}
          ref={ref}
          isInvalid={!!error}
        />
      </FormField>
    );
  }
);

EmailField.displayName = 'EmailField';
```

## Best Practices

1. **Form Handling**
   - Use react-hook-form for form state management
   - Use zod for validation
   - Handle loading and error states

2. **Component Composition**
   - Break down the form into smaller, reusable components
   - Use composition to build complex interfaces

3. **State Management**
   - Use local state for UI interactions
   - Use React Query for data fetching and mutations

4. **Validation**
   - Implement client-side validation before submission
   - Provide clear error messages to users

5. **Accessibility**
   - Ensure all form fields have proper labels
   - Add appropriate ARIA attributes
   - Make form submission keyboard accessible 