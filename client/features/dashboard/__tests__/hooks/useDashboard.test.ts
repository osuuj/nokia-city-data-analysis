import { act, renderHook } from '@testing-library/react-hooks';
import { useDashboard } from '../../hooks/useDashboard';
import type { DashboardError } from '../../types';
import type { ViewMode } from '../../types/view';

describe('useDashboard', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useDashboard());
    const [state] = result.current;

    expect(state.activeView).toBe('overview');
    expect(state.theme).toBe('light');
    expect(state.sidebarCollapsed).toBe(false);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('initializes with provided values', () => {
    const initialState = {
      activeView: 'map',
      theme: 'dark' as const,
      sidebarCollapsed: true,
      error: {
        message: 'Test error',
        code: 'TEST_ERROR',
        severity: 'error' as const,
        timestamp: new Date(),
      },
      isLoading: true,
    };

    const { result } = renderHook(() => useDashboard(initialState));
    const [state] = result.current;

    expect(state.activeView).toBe('map');
    expect(state.theme).toBe('dark');
    expect(state.sidebarCollapsed).toBe(true);
    expect(state.error).toBe(initialState.error);
    expect(state.isLoading).toBe(true);
  });

  it('updates activeView when setActiveView is called', () => {
    const { result } = renderHook(() => useDashboard());
    const [, actions] = result.current;

    act(() => {
      actions.setActiveView('analytics');
    });

    const [state] = result.current;
    expect(state.activeView).toBe('analytics');
  });

  it('updates theme when setTheme is called', () => {
    const { result } = renderHook(() => useDashboard());
    const [, actions] = result.current;

    act(() => {
      actions.setTheme('dark');
    });

    const [state] = result.current;
    expect(state.theme).toBe('dark');
  });

  it('toggles sidebarCollapsed when toggleSidebar is called', () => {
    const { result } = renderHook(() => useDashboard());
    const [, actions] = result.current;

    // Initial state
    let [state] = result.current;
    expect(state.sidebarCollapsed).toBe(false);

    // Toggle to collapsed
    act(() => {
      actions.toggleSidebar();
    });

    [state] = result.current;
    expect(state.sidebarCollapsed).toBe(true);

    // Toggle back to expanded
    act(() => {
      actions.toggleSidebar();
    });

    [state] = result.current;
    expect(state.sidebarCollapsed).toBe(false);
  });

  it('updates error when setError is called', () => {
    const { result } = renderHook(() => useDashboard());
    const [, actions] = result.current;

    const testError: DashboardError = {
      message: 'Test error',
      code: 'TEST_ERROR',
      severity: 'error',
      timestamp: new Date(),
    };

    act(() => {
      actions.setError(testError);
    });

    let [state] = result.current;
    expect(state.error).toBe(testError);

    // Clear error
    act(() => {
      actions.setError(null);
    });

    [state] = result.current;
    expect(state.error).toBeNull();
  });

  it('updates isLoading when setLoading is called', () => {
    const { result } = renderHook(() => useDashboard());
    const [, actions] = result.current;

    act(() => {
      actions.setLoading(true);
    });

    let [state] = result.current;
    expect(state.isLoading).toBe(true);

    act(() => {
      actions.setLoading(false);
    });

    [state] = result.current;
    expect(state.isLoading).toBe(false);
  });
});
