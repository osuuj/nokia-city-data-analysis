import { renderHook } from '@testing-library/react';
import { useMemoizedCallback } from '../useMemoizedCallback';

describe('useMemoizedCallback', () => {
  it('should return a stable function reference', () => {
    const fn = jest.fn();
    const { result, rerender } = renderHook(() => useMemoizedCallback(fn));

    const initialCallback = result.current;
    rerender();
    const newCallback = result.current;

    expect(initialCallback).toBe(newCallback);
  });

  it('should call the latest version of the function', () => {
    const fn1 = jest.fn().mockReturnValue(1);
    const fn2 = jest.fn().mockReturnValue(2);

    const { result, rerender } = renderHook(({ fn }) => useMemoizedCallback(fn), {
      initialProps: { fn: fn1 },
    });

    // Call with initial function
    expect(result.current()).toBe(1);
    expect(fn1).toHaveBeenCalledTimes(1);

    // Update the function
    rerender({ fn: fn2 });

    // Call with updated function
    expect(result.current()).toBe(2);
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments correctly to the function', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => useMemoizedCallback(fn));

    const args = ['test', 123, { key: 'value' }];
    result.current(...args);

    expect(fn).toHaveBeenCalledWith(...args);
  });

  it('should maintain the same reference even when the function changes', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();

    const { result, rerender } = renderHook(({ fn }) => useMemoizedCallback(fn), {
      initialProps: { fn: fn1 },
    });

    const initialCallback = result.current;
    rerender({ fn: fn2 });
    const newCallback = result.current;

    expect(initialCallback).toBe(newCallback);
  });

  it('should work with async functions', async () => {
    const asyncFn = jest.fn().mockResolvedValue('result');
    const { result } = renderHook(() => useMemoizedCallback(asyncFn));

    const promise = result.current();
    expect(promise).toBeInstanceOf(Promise);
    expect(await promise).toBe('result');
  });

  it('should handle functions that return different types', () => {
    const stringFn = jest.fn().mockReturnValue('string');
    const numberFn = jest.fn().mockReturnValue(42);
    const objectFn = jest.fn().mockReturnValue({ key: 'value' });

    const { result, rerender } = renderHook(({ fn }) => useMemoizedCallback(fn), {
      initialProps: { fn: stringFn },
    });

    expect(result.current()).toBe('string');
    rerender({ fn: numberFn });
    expect(result.current()).toBe(42);
    rerender({ fn: objectFn });
    expect(result.current()).toEqual({ key: 'value' });
  });
});
