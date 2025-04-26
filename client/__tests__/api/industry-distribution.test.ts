import { NextRequest } from 'next/server';
import { GET } from '../app/api/analytics/industry-distribution/route';

// Define the IndustryDistribution interface
interface IndustryDistribution {
  industry: string;
  count: number;
  percentage: number;
}

describe('Industry Distribution API', () => {
  it('should return industry distribution data', async () => {
    // Create a mock request
    const request = new NextRequest('http://localhost:3000/api/analytics/industry-distribution');

    // Call the GET handler
    const response = await GET(request);

    // Parse the response
    const data = await response.json();

    // Check the response structure
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.message).toBe('Industry distribution data retrieved successfully');

    // Check the data structure
    const distribution = data.data as IndustryDistribution[];
    expect(distribution.length).toBeGreaterThan(0);
    expect(distribution[0]).toHaveProperty('industry');
    expect(distribution[0]).toHaveProperty('count');
    expect(distribution[0]).toHaveProperty('percentage');
  });

  it('should respect the limit parameter', async () => {
    // Create a mock request with limit
    const request = new NextRequest(
      'http://localhost:3000/api/analytics/industry-distribution?limit=5',
    );

    // Call the GET handler
    const response = await GET(request);

    // Parse the response
    const data = await response.json();

    // Check the response
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeLessThanOrEqual(5);
  });

  it('should validate the limit parameter', async () => {
    // Create a mock request with invalid limit
    const request = new NextRequest(
      'http://localhost:3000/api/analytics/industry-distribution?limit=0',
    );

    // Call the GET handler
    const response = await GET(request);

    // Parse the response
    const data = await response.json();

    // Check the error response
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });

  it('should handle errors gracefully', async () => {
    // Create a mock request that will cause an error
    const request = new NextRequest(
      'http://localhost:3000/api/analytics/industry-distribution?error=true',
    );

    // Mock the console.error to prevent test output pollution
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Call the GET handler
    const response = await GET(request);

    // Restore console.error
    consoleSpy.mockRestore();

    // Parse the response
    const data = await response.json();

    // Check the error response structure
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });
});
