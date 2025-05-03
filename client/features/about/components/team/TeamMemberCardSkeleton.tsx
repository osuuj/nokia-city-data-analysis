'use client';

import { Card, CardBody, CardFooter, CardHeader, Skeleton } from '@heroui/react';
import React from 'react';

export default function TeamMemberCardSkeleton() {
  return (
    <Card className="shadow-md h-full backdrop-blur-md bg-opacity-85 border border-content2">
      <CardHeader className="flex flex-col items-center gap-2 p-4">
        <Skeleton className="rounded-full w-24 h-24" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardBody className="p-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/6 mb-4" />
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
      </CardBody>
      <CardFooter className="flex justify-center gap-2 p-4">
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </Card>
  );
}
