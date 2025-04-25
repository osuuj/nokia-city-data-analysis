import { Card, CardBody, CardFooter, CardHeader, Skeleton } from '@heroui/react';
import React from 'react';

export default function TeamMemberCardSkeleton() {
  return (
    <Card className="shadow-md h-full backdrop-blur-md bg-opacity-85 border border-content2">
      <CardHeader className="flex flex-col items-center gap-2 p-4">
        <Skeleton className="rounded-full w-24 h-24" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardBody className="p-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex flex-wrap gap-2 justify-center">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-6 w-16" />
          ))}
        </div>
      </CardBody>
      <CardFooter className="flex justify-center gap-2 p-4">
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </Card>
  );
}
