import type React from 'react';

interface ChartSkeletonProps {
  height?: string; // Allow customizing height, e.g., '300px', '400px'
  className?: string;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
  height = '300px',
  className = '',
}) => {
  return (
    <output
      className={`w-full bg-default-100 rounded-lg animate-pulse ${className}`}
      style={{ height: height }} // Apply dynamic height
      aria-label="Loading chart data"
    >
      {/* Optional: Add some internal pulsing elements for more visual feedback */}
      {/* <div className="h-1/2 w-3/4 bg-default-200 rounded mx-auto mt-8 opacity-75"></div> */}
    </output>
  );
};
