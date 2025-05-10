'use client';

export interface MapSkeletonProps {
  /**
   * Height of the map skeleton
   * @default 'h-[70vh]'
   */
  height?: string;
  /**
   * Additional class name for the container
   */
  className?: string;
  /**
   * Whether to show map controls
   * @default true
   */
  showControls?: boolean;
  /**
   * Whether to show a location marker
   * @default true
   */
  showMarker?: boolean;
  /**
   * Custom minimum height
   * @default 'min-h-[400px]'
   */
  minHeight?: string;
}

/**
 * MapSkeleton component
 *
 * A reusable skeleton for map visualizations showing a loading state
 * with customizable height and optional elements.
 */
export function MapSkeleton({
  height = 'h-[70vh]',
  className = '',
  showControls = true,
  showMarker = true,
  minHeight = 'min-h-[400px]',
}: MapSkeletonProps) {
  return (
    <div
      className={`w-full ${height} ${minHeight} bg-default-100 dark:bg-default-50/5 rounded-lg animate-pulse overflow-hidden relative ${className}`}
    >
      {/* Map center marker */}
      {showMarker && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-default-200 dark:bg-default-800 mb-2" />
            <div className="w-32 h-4 bg-default-200 dark:bg-default-800 rounded-md" />
          </div>
        </div>
      )}

      {/* Map controls */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="w-8 h-8 bg-default-200 dark:bg-default-800 rounded-md" />
          <div className="w-8 h-8 bg-default-200 dark:bg-default-800 rounded-md" />
          <div className="w-8 h-8 bg-default-200 dark:bg-default-800 rounded-md" />
        </div>
      )}

      {/* Optional grid pattern to simulate map tiles */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-10">
        {Array.from({ length: 16 }).map(() => (
          <div
            key={`map-tile-${crypto.randomUUID()}`}
            className="border border-default-300 dark:border-default-700"
          />
        ))}
      </div>
    </div>
  );
}
