'use client';

import { useEffect } from 'react';
import { DeferredScript } from './DeferredScript';

/**
 * ResourceOptimizer Component
 *
 * Improves performance by deferring non-critical resources and
 * optimizing loading patterns
 */
export function ResourceOptimizer() {
  // Cleanup unnecessary resources when component mounts
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Remove unused CSS on mobile, but be careful not to affect critical UI
    const removeUnusedCss = () => {
      // Query selectors that match unused desktop-only styles in mobile view
      const unusedSelectors = ['link[href*="desktop"]', 'style[data-for="desktop-only"]'];

      if (window.innerWidth < 768) {
        for (const selector of unusedSelectors) {
          const elements = document.querySelectorAll(selector);
          for (const el of elements) {
            // Ensure we're not affecting critical UI components
            if (!el.classList?.contains('critical')) {
              el.setAttribute('media', 'print');
            }
          }
        }
      }
    };

    // Delay the execution slightly to ensure page content is visible first
    setTimeout(() => {
      removeUnusedCss();
      window.addEventListener('resize', removeUnusedCss);
    }, 100);

    return () => {
      window.removeEventListener('resize', removeUnusedCss);
    };
  }, []);

  // Optimization script to run after page loads
  const optimizationScript = `
    // Function to defer non-critical resources
    function deferNonCriticalResources() {
      // Find all scripts with data-defer attribute
      const deferredScripts = document.querySelectorAll('script[data-defer="true"]');
      for (const script of deferredScripts) {
        const newScript = document.createElement('script');
        
        // Copy all attributes
        for (const attr of Array.from(script.attributes)) {
          if (attr.name !== 'data-defer') {
            newScript.setAttribute(attr.name, attr.value);
          }
        }
        
        newScript.innerHTML = script.innerHTML;
        script.parentNode.replaceChild(newScript, script);
      }

      // Convert print stylesheets to all media
      const printStylesheets = document.querySelectorAll('link[rel="stylesheet"][media="print"]');
      for (const stylesheet of printStylesheets) {
        stylesheet.media = 'all';
      }
    }

    // Run optimization after everything else has loaded
    if (document.readyState === 'complete') {
      setTimeout(deferNonCriticalResources, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(deferNonCriticalResources, 1000);
      });
    }

    // Clean up unused JS modules - only after page is fully interactive
    window.addEventListener('load', () => {
      setTimeout(() => {
        const unusedModules = [
          // Add module names that are not needed on this page
        ];
        
        if (window.__NEXT_LOADED_MODULES__) {
          for (const module of unusedModules) {
            if (window.__NEXT_LOADED_MODULES__[module]) {
              delete window.__NEXT_LOADED_MODULES__[module];
            }
          }
        }
      }, 3000);
    });
  `;

  return <DeferredScript delay={3000}>{optimizationScript}</DeferredScript>;
}
