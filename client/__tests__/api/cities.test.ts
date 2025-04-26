import { NextRequest } from 'next/server';
import { GET } from '../app/api/cities/route';

describe('Cities API', () => {
  it('should return a list of cities', async () => {
    // Create a mock request
    const request = new NextRequest('http://localhost:3000/api/cities');

    // Call the GET handler
    const response = await GET(request);

    // Parse the response
    const data = await response.json();

    // Check the response structure
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.message).toBe('Cities retrieved successfully');

    // Check the data structure
    const cities = data.data;
    expect(cities.length).toBeGreaterThan(0);
    expect(cities[0]).toHaveProperty('id');
    expect(cities[0]).toHaveProperty('name');
    expect(cities[0]).toHaveProperty('country');
    expect(cities[0]).toHaveProperty('population');
    expect(cities[0]).toHaveProperty('coordinates');
    expect(cities[0].coordinates).toHaveProperty('latitude');
    expect(cities[0].coordinates).toHaveProperty('longitude');
  });

  it('should handle errors gracefully', async () => {
    // Create a mock request that will cause an error
    const request = new NextRequest('http://localhost:3000/api/cities?error=true');

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
