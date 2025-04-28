import { useQueryClient } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { usePrefetch } from '../../hooks/usePrefetch';

// Mock the useQueryClient hook
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(),
}));

describe('usePrefetch', () => {
  const mockPrefetchQuery = jest.fn();
  const mockQueryClient = {
    prefetchQuery: mockPrefetchQuery,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
  });

  it('returns a function that prefetches data', () => {
    const queryKey = ['test', 'key'];
    const queryFn = jest.fn().mockResolvedValue({ data: 'test' });

    const { result } = renderHook(() => usePrefetch(queryKey, queryFn));

    // Call the prefetch function
    act(() => {
      result.current();
    });

    // Check if prefetchQuery was called with the correct arguments
    expect(mockPrefetchQuery).toHaveBeenCalledWith({
      queryKey,
      queryFn,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });
  });

  it('uses custom staleTime and gcTime if provided', () => {
    const queryKey = ['test', 'key'];
    const queryFn = jest.fn().mockResolvedValue({ data: 'test' });
    const options = {
      staleTime: 1000,
      gcTime: 2000,
    };

    const { result } = renderHook(() => usePrefetch(queryKey, queryFn, options));

    // Call the prefetch function
    act(() => {
      result.current();
    });

    // Check if prefetchQuery was called with the custom staleTime and gcTime
    expect(mockPrefetchQuery).toHaveBeenCalledWith({
      queryKey,
      queryFn,
      staleTime: 1000,
      gcTime: 2000,
    });
  });

  it('does not prefetch if enabled is false', () => {
    const queryKey = ['test', 'key'];
    const queryFn = jest.fn().mockResolvedValue({ data: 'test' });
    const options = {
      enabled: false,
    };

    const { result } = renderHook(() => usePrefetch(queryKey, queryFn, options));

    // Call the prefetch function
    act(() => {
      result.current();
    });

    // Check if prefetchQuery was not called
    expect(mockPrefetchQuery).not.toHaveBeenCalled();
  });

  it('debounces prefetch calls', () => {
    jest.useFakeTimers();

    const queryKey = ['test', 'key'];
    const queryFn = jest.fn().mockResolvedValue({ data: 'test' });

    const { result } = renderHook(() => usePrefetch(queryKey, queryFn));

    // Call the prefetch function multiple times
    act(() => {
      result.current();
      result.current();
      result.current();
    });

    // Check if prefetchQuery was not called yet (debounced)
    expect(mockPrefetchQuery).not.toHaveBeenCalled();

    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Check if prefetchQuery was called only once
    expect(mockPrefetchQuery).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});
