import type React from 'react';

/**
 * A skeleton loading state for the contact page
 * Displays while the page is being hydrated on the client
 */
export const ContactPageSkeleton: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen px-4 py-8 md:px-6 animate-pulse">
      <div className="fixed inset-0 z-0 bg-gray-100 dark:bg-gray-900" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header skeleton */}
        <div className="w-48 h-10 mx-auto mb-12 bg-gray-300 dark:bg-gray-700 rounded-md" />

        {/* Team section skeleton */}
        <div className="mb-16">
          <div className="w-32 h-8 mx-auto mb-6 bg-gray-300 dark:bg-gray-700 rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Team member 1 skeleton */}
            <div className="p-6 rounded-lg bg-gray-200 dark:bg-gray-800">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div className="w-full text-center">
                  <div className="w-32 h-6 mx-auto mb-1 bg-gray-300 dark:bg-gray-700 rounded-md" />
                  <div className="w-24 h-4 mx-auto mb-4 bg-gray-300 dark:bg-gray-700 rounded-md" />

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-md" />
                    <div className="w-36 h-4 bg-gray-300 dark:bg-gray-700 rounded-md" />
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-md" />
                    <div className="w-36 h-4 bg-gray-300 dark:bg-gray-700 rounded-md" />
                  </div>
                </div>
              </div>
            </div>

            {/* Team member 2 skeleton */}
            <div className="p-6 rounded-lg bg-gray-200 dark:bg-gray-800">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div className="w-full text-center">
                  <div className="w-32 h-6 mx-auto mb-1 bg-gray-300 dark:bg-gray-700 rounded-md" />
                  <div className="w-24 h-4 mx-auto mb-4 bg-gray-300 dark:bg-gray-700 rounded-md" />

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-md" />
                    <div className="w-36 h-4 bg-gray-300 dark:bg-gray-700 rounded-md" />
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-md" />
                    <div className="w-36 h-4 bg-gray-300 dark:bg-gray-700 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info skeleton */}
        <div className="p-6 rounded-lg bg-gray-200 dark:bg-gray-800">
          <div className="w-48 h-6 mx-auto mb-4 bg-gray-300 dark:bg-gray-700 rounded-md" />
          <div className="w-full max-w-md h-16 mx-auto mb-4 bg-gray-300 dark:bg-gray-700 rounded-md" />
          <div className="w-80 h-4 mx-auto bg-gray-300 dark:bg-gray-700 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default ContactPageSkeleton;
