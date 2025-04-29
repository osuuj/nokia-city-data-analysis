'use client';

/**
 * Client component that provides global styles
 * This allows us to use styled-jsx in a client component context
 */
export function GlobalStyles() {
  return (
    <style jsx global>{`
      /* Default padding for all pages */
      body {
        padding-top: 6rem; /* equivalent to pt-24 */
        transition: padding-top 0.2s ease-in-out;
      }
      
      /* Remove padding for dashboard pages */
      body.dashboard-page {
        padding-top: 0;
      }
    `}</style>
  );
}
