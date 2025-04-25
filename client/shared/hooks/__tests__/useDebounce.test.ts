import { act, renderHook } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should update the value after the specified delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    // Initial value
    expect(result.current).toBe('initial');

    // Update the value
    rerender({ value: 'updated', delay: 500 });

    // Value should not have changed yet
    expect(result.current).toBe('initial');

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value should now be updated
    expect(result.current).toBe('updated');
  });

  it('should use default delay of 300ms when delay is not provided', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'initial' },
    });

    // Initial value
    expect(result.current).toBe('initial');

    // Update the value
    rerender({ value: 'updated' });

    // Value should not have changed after 299ms
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe('initial');

    // Value should change after 300ms
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('updated');
  });

  it('should cancel previous timeout when value changes rapidly', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'initial' },
    });

    // Initial value
    expect(result.current).toBe('initial');

    // Update value multiple times
    rerender({ value: 'first update' });
    rerender({ value: 'second update' });
    rerender({ value: 'final update' });

    // Advance time partially
    act(() => {
      jest.advanceTimersByTime(499);
    });

    // Value should still be initial
    expect(result.current).toBe('initial');

    // Complete the delay
    act(() => {
      jest.advanceTimersByTime(1);
    });

    // Should have the final value
    expect(result.current).toBe('final update');
  });

  it('should work with different types of values', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: { test: 1 } },
    });

    // Initial value
    expect(result.current).toEqual({ test: 1 });

    // Update with a different type
    rerender({ value: { test: 2, nested: { value: 'test' } } });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should handle complex objects
    expect(result.current).toEqual({ test: 2, nested: { value: 'test' } });
  });

  it('should cleanup timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
    const { unmount } = renderHook(() => useDebounce('test', 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
