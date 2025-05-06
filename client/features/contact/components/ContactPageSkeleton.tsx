import type React from 'react';

/**
 * A lightweight skeleton loading state for the contact page
 * Optimized for performance with minimal DOM elements and animations
 */
export const ContactPageSkeleton: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
      {/* Simplified static background */}
      <div className="fixed inset-0 z-0 bg-default-100 dark:bg-default-900" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header skeleton */}
        <div className="w-48 h-10 mx-auto mb-12 bg-default-200 dark:bg-default-800 rounded-md" />

        {/* Team section skeleton - simplified */}
        <div className="mb-16">
          <div className="w-32 h-8 mx-auto mb-6 bg-default-200 dark:bg-default-800 rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Just two boxes instead of complex card structures */}
            <div className="h-64 rounded-lg bg-default-200/80 dark:bg-default-800/80" />
            <div className="h-64 rounded-lg bg-default-200/80 dark:bg-default-800/80" />
          </div>
        </div>

        {/* Contact Info skeleton - simplified */}
        <div className="h-48 rounded-lg bg-default-200/80 dark:bg-default-800/80" />
      </div>
    </div>
  );
};

export default ContactPageSkeleton;
