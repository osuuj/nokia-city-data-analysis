import { renderHook, waitFor } from '@/__tests__/utils/test-utils';
import { useData } from '../../hooks/data/useData';

// Mock the fetch function
global.fetch = jest.fn();

describe('useData', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('fetches data successfully', async () => {
    // Mock the fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test data' }),
    });

    const { result } = renderHook(() => useData());

    // Initially, the data should be null and loading should be true
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true);

    // Wait for the hook to update
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // After the update, the data should be set
    expect(result.current.data).toEqual({ data: 'test data' });
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('handles fetch errors', async () => {
    // Mock the fetch response to simulate an error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch error'));

    const { result } = renderHook(() => useData());

    // Initially, the data should be null and loading should be true
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true);

    // Wait for the hook to update
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // After the update, the error should be set
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Fetch error');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
