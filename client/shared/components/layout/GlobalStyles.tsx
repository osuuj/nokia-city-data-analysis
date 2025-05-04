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

      /* Theme transition handling */
      html {
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      
      /* Disable transitions during theme changes to prevent flash */
      html.theme-transition-disabled,
      html.theme-transition-disabled * {
        transition: none !important;
      }
      
      /* Properly handle theme changes */
      html[data-theme="dark"] {
        color-scheme: dark;
      }
      
      html[data-theme="light"] {
        color-scheme: light;
      }
      
      /* Dashboard main section styling */
      .dashboard-main {
        min-height: 100vh;
        width: 100%;
      }
      
      /* Ensure map containers use the correct theme */
      .mapboxgl-map {
        color: inherit;
        background-color: var(--background);
      }
      
      /* Fix map controls in dark mode */
      [data-theme='dark'] .mapboxgl-ctrl-attrib,
      [data-theme='dark'] .mapboxgl-ctrl button {
        color: #ffffff;
        background-color: #333333;
      }
      
      /* Fix button styling */
      button[aria-label="Theme switch"],
      button[aria-label="Switch to dark mode"],
      button[aria-label="Switch to light mode"] {
        z-index: 5;
      }
    `}</style>
  );
}
