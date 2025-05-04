'use client';

import { useEffect } from 'react';

/**
 * Client component that provides global styles
 * This allows us to use styled-jsx in a client component context
 */
export function GlobalStyles() {
  // Apply theme on mount for all pages
  useEffect(() => {
    // Get theme from localStorage or default to 'dark'
    const storedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';

    // Ensure DOM has the right attributes on every page
    document.documentElement.setAttribute('data-theme', storedTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(storedTheme);

    // Apply colors directly to prevent flash
    document.documentElement.style.backgroundColor = storedTheme === 'dark' ? '#000000' : '#ffffff';
    document.documentElement.style.color = storedTheme === 'dark' ? '#ffffff' : '#000000';

    console.log('GlobalStyles initialized with theme:', storedTheme);
  }, []);

  return (
    <style jsx global>{`
      /* Default padding for all pages */
      body {
        padding-top: 6rem; /* equivalent to pt-24 */
        transition: padding-top 0.2s ease-in-out;
        background-color: var(--background) !important; /* Force background color */
        color: var(--foreground) !important; /* Force text color */
      }
      
      /* Remove padding for dashboard pages */
      body.dashboard-page {
        padding-top: 0;
      }

      /* Theme transition handling - disable transitions to prevent flash */
      html {
        transition: none !important;
      }
      
      /* Base styles for dark/light modes - apply these immediately */
      .dark {
        background-color: #000000 !important;
        color: #ffffff !important;
      }
      
      .light {
        background-color: #ffffff !important;
        color: #000000 !important;
      }
      
      /* Anti-flash styles for pages */
      html, body, #__next, main {
        min-height: 100vh;
        background-color: var(--background) !important;
        color: var(--foreground) !important;
      }
      
      /* Properly handle theme changes */
      html[data-theme="dark"] {
        color-scheme: dark;
        --background: #000000;
        --foreground: #ffffff;
        --primary: #0070f3;
        --primary-foreground: #ffffff;
        --content1: #111111;
        --content2: #222222;
        --content3: #333333;
        --content4: #444444;
        background-color: #000000 !important;
        color: #ffffff !important;
      }
      
      html[data-theme="light"] {
        color-scheme: light;
        --background: #ffffff;
        --foreground: #000000;
        --primary: #0070f3;
        --primary-foreground: #ffffff;
        --content1: #f5f5f5;
        --content2: #e5e5e5;
        --content3: #d4d4d4;
        --content4: #a3a3a3;
        background-color: #ffffff !important;
        color: #000000 !important;
      }
      
      /* Dashboard main section styling */
      .dashboard-main {
        min-height: 100vh;
        width: 100%;
        background-color: var(--background) !important;
      }
      
      /* Ensure map containers use the correct theme */
      .mapboxgl-map {
        color: inherit;
        background-color: var(--background) !important;
      }
      
      /* Fix map controls in dark mode */
      [data-theme='dark'] .mapboxgl-ctrl-attrib,
      [data-theme='dark'] .mapboxgl-ctrl button {
        color: #ffffff;
        background-color: #333333;
      }
      
      /* Fix map controls in light mode */
      [data-theme='light'] .mapboxgl-ctrl-attrib,
      [data-theme='light'] .mapboxgl-ctrl button {
        color: #000000;
        background-color: #ffffff;
      }
      
      /* Fix button styling */
      button[aria-label="Theme switch"],
      button[aria-label="Switch to dark mode"],
      button[aria-label="Switch to light mode"] {
        z-index: 5;
      }
      
      /* Prevent Next.js page transition flash */
      #__next {
        background-color: var(--background) !important;
        color: var(--foreground) !important;
      }
      
      /* Prevent flash during navigation */
      .page-transition {
        background-color: var(--background) !important;
        color: var(--foreground) !important;
      }
    `}</style>
  );
}
