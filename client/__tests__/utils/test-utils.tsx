import { render as rtlRender } from '@testing-library/react';
import { renderHook as rtlRenderHook } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import type React from 'react';

/**
 * Wrapper component that provides all necessary providers for testing
 */
function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}

/**
 * Custom render function that includes all necessary providers
 */
function customRender(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, { wrapper: AllTheProviders, ...options });
}

/**
 * Custom renderHook function that includes all necessary providers
 */
function customRenderHook<TProps, TResult>(callback: (props: TProps) => TResult, options = {}) {
  return rtlRenderHook(callback, {
    wrapper: AllTheProviders,
    ...options,
  });
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render methods
export { customRender as render, customRenderHook as renderHook };
