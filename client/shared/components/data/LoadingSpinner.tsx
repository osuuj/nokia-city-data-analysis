'use client';

import { Spinner } from '@heroui/react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

/**
 * LoadingSpinner component for visual loading states
 * Can be used as a Suspense fallback or standalone
 */
export const LoadingSpinner = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const spinnerSize = size as 'sm' | 'md' | 'lg';

  const containerClassName = `flex flex-col items-center justify-center gap-4 ${
    fullScreen ? 'min-h-screen' : 'min-h-[200px]'
  }`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={containerClassName}
    >
      <Spinner size={spinnerSize} color="primary" />
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-default-600 dark:text-default-400 text-sm"
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
};
