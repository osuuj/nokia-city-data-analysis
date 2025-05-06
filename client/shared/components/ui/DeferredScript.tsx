'use client';

import { useEffect, useState } from 'react';

interface DeferredScriptProps {
  /**
   * The JavaScript content to execute after the page has loaded
   */
  children: string;
  /**
   * The time in milliseconds to wait before executing the script
   * @default 2000
   */
  delay?: number;
}

/**
 * DeferredScript component
 *
 * Loads and executes JavaScript after the page has fully loaded
 * to avoid blocking the main thread during initial render
 */
export function DeferredScript({ children, delay = 2000 }: DeferredScriptProps) {
  const [shouldExecute, setShouldExecute] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Wait until page is fully loaded and then some additional delay
    const timer = setTimeout(() => {
      // Execute the script after the page has loaded and the delay has passed
      setShouldExecute(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (shouldExecute && children) {
      try {
        // Create a new function from the script content and execute it
        const fn = new Function(children);
        fn();
      } catch (error) {
        console.error('Error executing deferred script:', error);
      }
    }
  }, [shouldExecute, children]);

  return null;
}
