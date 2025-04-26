import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as rtlRender } from '@testing-library/react';
import type React from 'react';

// Create a custom render function that includes providers
function render(ui: React.ReactElement, { ...renderOptions } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { render };

// Mock API response helper
export const mockApiResponse = <T,>(data: T, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
};

// Mock API error helper
export const mockApiError = (status: number, message: string) => {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve({ message }),
  });
};

// Mock IntersectionObserver
export const mockIntersectionObserver = () => {
  const mock = jest.fn();
  mock.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mock;
  return mock;
};

// Mock ResizeObserver
export const mockResizeObserver = () => {
  const mock = jest.fn();
  mock.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.ResizeObserver = mock;
  return mock;
};

// Mock matchMedia
export const mockMatchMedia = (matches = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};
