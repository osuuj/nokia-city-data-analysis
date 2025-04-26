import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import { Input } from '@heroui/input';
import { Label } from '@heroui/label';
import { Textarea } from '@heroui/textarea';
import type React from 'react';
import { Suspense } from 'react';
import { ContactErrorBoundary } from './ContactErrorBoundary';
import { ContactForm } from './ContactForm';
import { ContactFormSkeleton } from './ContactFormSkeleton';

/**
 * ContactPage Component
 *
 * The main page component for the contact feature.
 * Integrates the ContactForm with error boundary and loading states.
 * Provides a responsive layout for the contact form.
 *
 * @example
 * ```tsx
 * import { ContactPage } from '../components';
 *
 * const App = () => {
 *   return (
 *     <div>
 *       <Header />
 *       <ContactPage />
 *       <Footer />
 *     </div>
 *   );
 * };
 * ```
 *
 * @returns {JSX.Element} A page component that displays the contact form
 */
export const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Contact Us</h1>
      <ContactErrorBoundary>
        <Suspense fallback={<ContactFormSkeleton />}>
          <ContactForm />
        </Suspense>
      </ContactErrorBoundary>
    </div>
  );
};
