import { fetchData } from '../../features/dashboard/api/data';

// Mock the fetch function
global.fetch = jest.fn();

describe('fetchData', () => {
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

    const result = await fetchData();
    expect(result).toEqual({ data: 'test data' });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('handles fetch errors', async () => {
    // Mock the fetch response to simulate an error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch error'));

    await expect(fetchData()).rejects.toThrow('Fetch error');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
