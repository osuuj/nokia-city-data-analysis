export function TeamMemberSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          <div className="mt-6">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          <div className="mt-6">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
