import { Avatar, Card, CardBody, Skeleton } from '@heroui/react';
import React from 'react';

export default function ProfileSkeleton() {
  return (
    <div className="space-y-8" data-testid="profile-skeleton">
      {/* Profile Header Skeleton */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-large bg-content1 shadow-small backdrop-blur-md bg-opacity-85 border border-content2">
        <Skeleton className="rounded-full w-32 h-32" />
        <div className="flex-grow w-full">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      {/* Skills Skeleton */}
      <div>
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="grid gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-content1 p-4 rounded-large backdrop-blur-md bg-opacity-85 border border-content2"
            >
              <div className="flex justify-between mb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-12" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Projects Skeleton */}
      <div>
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="backdrop-blur-md bg-opacity-90">
              <CardBody>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <div className="flex flex-wrap gap-2 mb-4">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-6 w-16" />
                  ))}
                </div>
                <Skeleton className="h-8 w-32" />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Experience Skeleton */}
      <div>
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-content1 p-4 rounded-large backdrop-blur-md bg-opacity-85 border border-content2"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Education Skeleton */}
      <div>
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-content1 p-4 rounded-large backdrop-blur-md bg-opacity-85 border border-content2"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-5 w-48" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
