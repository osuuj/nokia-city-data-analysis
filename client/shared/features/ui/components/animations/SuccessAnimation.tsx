'use client';

import { cn } from '@/shared/utils/cn';
import { transitionClasses } from '@/shared/utils/transitions';
import { memo, useEffect, useState } from 'react';

export interface SuccessAnimationProps {
  /**
   * Whether the success state is active
   */
  isSuccess?: boolean;
  /**
   * The message to display
   */
  message?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Callback when animation completes
   */
  onComplete?: () => void;
  /**
   * Auto hide duration in milliseconds
   */
  autoHideDuration?: number;
}

/**
 * Success animation component
 * Displays a checkmark animation with optional message
 */
function SuccessAnimationComponent({
  isSuccess = false,
  message = 'Success!',
  className,
  onComplete,
  autoHideDuration = 3000,
}: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isSuccess && !isVisible) {
      setIsVisible(true);
      setIsAnimating(true);

      // Start exit animation after duration
      const timeout = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, autoHideDuration);

      return () => clearTimeout(timeout);
    }
  }, [isSuccess, isVisible, autoHideDuration, onComplete]);

  // Handle animation end
  const handleAnimationEnd = () => {
    if (!isVisible) {
      setIsAnimating(false);
    }
  };

  if (!isAnimating) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center z-50',
        isVisible ? 'pointer-events-auto' : 'pointer-events-none',
        className,
      )}
    >
      <div
        className={cn(
          'flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6',
          isVisible ? transitionClasses.scale.enterTo : transitionClasses.scale.leaveFrom,
          'transform transition-all duration-300 ease-in-out',
        )}
        onTransitionEnd={handleAnimationEnd}
      >
        {/* Checkmark circle */}
        <div
          className={cn(
            'relative w-16 h-16 rounded-full border-4 border-green-500',
            isVisible ? transitionClasses.scale.enterTo : transitionClasses.scale.leaveFrom,
            'transform transition-all duration-300 ease-in-out delay-150',
          )}
        >
          {/* Checkmark */}
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              isVisible ? transitionClasses.scale.enterTo : transitionClasses.scale.leaveFrom,
              'transform transition-all duration-300 ease-in-out delay-300',
            )}
          >
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Success checkmark</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        {message && (
          <p
            className={cn(
              'mt-4 text-lg font-medium text-gray-900 dark:text-gray-100',
              isVisible ? transitionClasses.fade.enterTo : transitionClasses.fade.leaveFrom,
              'transition-opacity duration-300 ease-in-out delay-450',
            )}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const SuccessAnimation = memo(SuccessAnimationComponent);
