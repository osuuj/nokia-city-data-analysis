import { Skeleton } from '@heroui/skeleton';
import React from 'react';

/**
 * ContactFormSkeleton Component
 *
 * A loading skeleton component that mimics the structure of the ContactForm.
 * Used as a fallback during the loading state of the ContactForm.
 * Provides a smooth user experience by showing a placeholder while the form loads.
 *
 * @example
 * ```tsx
 * import { ContactFormSkeleton } from '../components';
 *
 * const ContactPage = () => {
 *   return (
 *     <div>
 *       <h1>Contact Us</h1>
 *       <Suspense fallback={<ContactFormSkeleton />}>
 *         <ContactForm />
 *       </Suspense>
 *     </div>
 *   );
 * };
 * ```
 *
 * @returns {JSX.Element} A skeleton loading component for the contact form
 */
const ContactFormSkeletonComponent: React.FC = () => {
  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Name field skeleton */}
      <div>
        <Skeleton className="h-4 w-20 mb-2 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Email field skeleton */}
      <div>
        <Skeleton className="h-4 w-20 mb-2 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Subject field skeleton */}
      <div>
        <Skeleton className="h-4 w-20 mb-2 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Message field skeleton */}
      <div>
        <Skeleton className="h-4 w-20 mb-2 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-32 w-full bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Submit button skeleton */}
      <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
export const ContactFormSkeleton = React.memo(ContactFormSkeletonComponent);
