'use client';

import { Spinner } from '@heroui/react';
import { useEffect, useState } from 'react';

interface LoadingOverlayProps {
  message?: string;
  delay?: number;
}

/**
 * LoadingOverlay component
 * Shows a full-screen loading overlay with a spinner and message
 * Automatically hides after a specified delay
 */
export function LoadingOverlay({ message = 'Loading data...', delay = 500 }: LoadingOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <Spinner size="lg" color="primary" />
      <p className="mt-4 text-default-600">{message}</p>
    </div>
  );
}
