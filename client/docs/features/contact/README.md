# Contact Feature

The Contact feature provides contact information and a contact form for users to reach out to the team behind the Nokia City Data Analysis application.

## Overview

- **Contact Form**: Interactive form with validation
- **Team Contact Cards**: Visual cards for team member contact info
- **Contact Information**: Address, phone, and email information
- **Loading States**: Skeleton loaders for smooth loading experience
- **Error Handling**: Form validation and submission error handling
- **Responsive Design**: Mobile-friendly layout

## Directory Structure

```
client/features/contact/
├── components/               # UI components
│   ├── ClientContactContent.tsx  # Client-side contact form
│   ├── ContactInfo.tsx       # Contact information display
│   ├── ContactLoadingSkeleton.tsx # Loading skeleton
│   ├── ContactPageWrapper.tsx # Page layout wrapper
│   ├── TeamMemberCard.tsx    # Team member contact card
│   └── index.ts              # Component exports
└── index.ts                  # Feature exports
```

## Key Components

### Main Components

- **ClientContactContent**: Client-side rendered contact form with validation
- **ContactInfo**: Display of general contact information
- **ContactPageWrapper**: Layout wrapper for the contact page
- **TeamMemberCard**: Card component for team member contact information

### UI Components

- **ContactLoadingSkeleton**: Loading state skeleton for the contact page

## Component Hierarchy

```
ContactPage
├── ContactPageWrapper
│   ├── ContactLoadingSkeleton (during loading)
│   ├── ContactInfo
│   │   └── TeamMemberCard (multiple)
│   └── ClientContactContent
│       └── Form components
```

## Shared Component Usage

The Contact feature leverages several shared components:

```tsx
// Background and theme
import { TransitionBackground } from '@/shared/components/ui/background';
import { gradientColors } from '@/shared/utils/backgroundConfig';

// Loading components
import { CardSkeleton } from '@/shared/components/loading';

// Error handling
import { ErrorDisplay } from '@/shared/components/error';

// UI components
import { Button, Input, TextArea } from '@/shared/components/ui';
```

## Data Management

The Contact feature manages form state and validation:

```tsx
// Form state management example
import { useState } from 'react';

function ContactForm() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Form validation and submission logic
    
    setIsSubmitting(false);
  };
  
  // Component implementation
}
```

## Core Types

```typescript
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  imageUrl: string;
}
```

## Usage Examples

### Contact Information Display

```tsx
import { ContactInfo } from '@/features/contact/components';

function ContactSection() {
  const teamMembers = [
    {
      id: '1',
      name: 'Jane Doe',
      role: 'Project Manager',
      email: 'jane.doe@example.com',
      phone: '+358 40 123 4567',
      imageUrl: '/images/team/jane-doe.jpg'
    },
    // More team members
  ];
  
  return (
    <ContactInfo 
      teamMembers={teamMembers}
      address="Nokia HQ, Karakaari 7, 02610 Espoo, Finland"
      email="contact@nokiacitydata.com"
      phone="+358 40 123 4567"
    />
  );
}
```

### Contact Form

```tsx
import { ClientContactContent } from '@/features/contact/components';

function ContactPage() {
  const handleFormSubmit = async (formData) => {
    // Form submission logic
    console.log('Form data:', formData);
    return { success: true };
  };
  
  return (
    <ClientContactContent 
      onSubmit={handleFormSubmit}
      submitEndpoint="/api/contact"
      showSubject={true}
    />
  );
}
```

## Best Practices

1. **Form Design**
   - Implement client-side validation for immediate feedback
   - Use clear error messages for form validation
   - Provide visual feedback during form submission
   - Include appropriate form labels and placeholders

2. **Accessibility**
   - Ensure form elements have proper labels
   - Use ARIA attributes for form validation
   - Ensure sufficient color contrast for form elements
   - Provide keyboard navigation support

3. **Responsiveness**
   - Adapt layout for different screen sizes
   - Adjust form controls for touch interfaces
   - Ensure contact cards stack properly on mobile

4. **Performance**
   - Optimize images for team member photos
   - Implement lazy loading for contact page sections
   - Use appropriate skeleton loaders during loading 