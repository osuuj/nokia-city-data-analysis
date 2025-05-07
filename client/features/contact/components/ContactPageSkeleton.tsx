'use client';

import { Card, CardBody, Skeleton } from '@heroui/react';

/**
 * A lightweight skeleton loading state for the contact page
 * Uses the Card components with styling matching the final cards in the contact page
 */
export function ContactPageSkeleton() {
  // Use the same colors as AnimatedBackground
  const lightGradientStart = 'rgba(240, 240, 255, 0.7)';
  const lightGradientEnd = 'rgba(255, 255, 255, 0.5)';
  // Dark theme colors
  const darkGradientStart = 'rgba(50, 50, 80, 0.5)';
  const darkGradientEnd = 'rgba(30, 30, 60, 0.3)';

  return (
    <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
      {/* Background with gradient that exactly matches AnimatedBackground */}
      <div
        className="fixed inset-0 z-0 dark:hidden"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${lightGradientStart}, ${lightGradientEnd})`,
        }}
      />
      <div
        className="fixed inset-0 z-0 hidden dark:block"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${darkGradientStart}, ${darkGradientEnd})`,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header skeleton with shimmer effect */}
        <Skeleton className="h-10 w-48 mx-auto mb-12 rounded-md" />

        {/* Team section skeleton with subtle animation */}
        <div className="mb-16">
          <Skeleton className="h-8 w-32 mx-auto mb-6 rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Team member cards with Card components matching final appearance */}
            <Card className="backdrop-blur-md bg-opacity-90 transition-colors">
              <CardBody className="flex flex-col items-center gap-4">
                <Skeleton className="rounded-full w-24 h-24" />
                <div className="text-center w-full">
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                  <Skeleton className="h-4 w-full mb-2 mx-auto" />
                  <Skeleton className="h-4 w-full mb-2 mx-auto" />
                </div>
              </CardBody>
            </Card>
            <Card className="backdrop-blur-md bg-opacity-90 transition-colors">
              <CardBody className="flex flex-col items-center gap-4">
                <Skeleton className="rounded-full w-24 h-24" />
                <div className="text-center w-full">
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                  <Skeleton className="h-4 w-full mb-2 mx-auto" />
                  <Skeleton className="h-4 w-full mb-2 mx-auto" />
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Contact Info skeleton with Card matching final appearance */}
        <Card className="backdrop-blur-md bg-opacity-90 transition-colors mb-12">
          <CardBody className="p-6">
            <Skeleton className="h-6 w-48 mx-auto mb-4" />
            <Skeleton className="h-4 w-full mx-auto mb-6" />
            <div className="flex items-center justify-center gap-3 mb-4">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-4 w-64 mx-auto mt-6" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
