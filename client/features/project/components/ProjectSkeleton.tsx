import { Card, CardBody, CardFooter, CardHeader, Skeleton } from '@heroui/react';

export function ProjectSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="p-0">
        <Skeleton className="w-full h-48 rounded-lg" />
      </CardHeader>
      <CardBody className="pb-0">
        <Skeleton className="w-24 h-6 mb-2" />
        <Skeleton className="w-3/4 h-6 mb-2" />
        <Skeleton className="w-full h-20 mb-4" />
        <div className="flex flex-wrap gap-1">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-16 h-6 rounded-full" />
          ))}
        </div>
      </CardBody>
      <CardFooter className="flex justify-between mt-4">
        <Skeleton className="w-24 h-9" />
        <Skeleton className="w-24 h-9" />
      </CardFooter>
    </Card>
  );
}

export function ProjectGridSkeleton() {
  return (
    <div className="grid gap-6 mb-2 max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <ProjectSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Section */}
      <div className="relative h-[40vh] overflow-hidden">
        <Skeleton className="w-full h-full" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Skeleton className="w-32 h-8 mb-4" />
          <Skeleton className="w-3/4 h-12 mb-2" />
          <Skeleton className="w-1/2 h-6" />
        </div>
      </div>

      {/* Overview Section */}
      <Card>
        <CardBody className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="w-32 h-8" />
            <Skeleton className="w-48 h-6" />
          </div>
          <Skeleton className="w-full h-24" />
          <div className="space-y-2">
            <Skeleton className="w-32 h-6" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4" />
          </div>
        </CardBody>
      </Card>

      {/* Gallery Section */}
      <div>
        <Skeleton className="w-48 h-8 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardBody className="p-0">
                <Skeleton className="w-full h-48" />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Tech Stack Section */}
      <div>
        <Skeleton className="w-48 h-8 mb-6 mx-auto" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardBody className="flex flex-col items-center justify-center p-4">
                <Skeleton className="w-12 h-12 rounded-full mb-2" />
                <Skeleton className="w-20 h-4" />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
