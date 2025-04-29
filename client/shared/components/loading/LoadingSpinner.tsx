'use client';

import { cn } from '@/shared/utils/cn';
import { Spinner } from '@heroui/react';

export interface LoadingSpinnerProps {
  /**
   * The size of the spinner
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * The color of the spinner
   * @default "primary"
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default';
  /**
   * Additional CSS classes to apply to the spinner
   */
  className?: string;
  /**
   * Whether to show a loading text below the spinner
   * @default false
   */
  showText?: boolean;
  /**
   * The text to show below the spinner when showText is true
   * @default "Loading..."
   */
  text?: string;
}

/**
 * LoadingSpinner component
 * A reusable spinner component for indicating loading states
 */
export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  className,
  showText = false,
  text = 'Loading...',
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Spinner size={size} color={color} aria-label="Loading" />
      {showText && <p className="mt-2 text-sm text-default-600">{text}</p>}
    </div>
  );
}
