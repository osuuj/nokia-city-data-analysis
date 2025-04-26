import { HttpStatus, createErrorResponse, createSuccessResponse } from '@/features/api';
import { withCache } from '@/shared/middleware/cache';
import { type NextRequest, NextResponse } from 'next/server';

// Mock data for cities
const mockCities = [
  {
    id: '1',
    name: 'Helsinki',
    country: 'Finland',
    population: 658864,
    coordinates: {
      latitude: 60.1699,
      longitude: 24.9384,
    },
  },
  {
    id: '2',
    name: 'Espoo',
    country: 'Finland',
    population: 297132,
    coordinates: {
      latitude: 60.2055,
      longitude: 24.6559,
    },
  },
  {
    id: '3',
    name: 'Tampere',
    country: 'Finland',
    population: 244671,
    coordinates: {
      latitude: 61.4978,
      longitude: 23.761,
    },
  },
  {
    id: '4',
    name: 'Vantaa',
    country: 'Finland',
    population: 239216,
    coordinates: {
      latitude: 60.2934,
      longitude: 25.0378,
    },
  },
  {
    id: '5',
    name: 'Oulu',
    country: 'Finland',
    population: 208939,
    coordinates: {
      latitude: 65.0121,
      longitude: 25.4651,
    },
  },
];

/**
 * GET handler for /api/cities
 * Returns a list of cities
 *
 * @param request The incoming request
 * @returns A response with the list of cities
 */
async function getCities(request: NextRequest) {
  try {
    // In a real implementation, this would fetch from a database
    return createSuccessResponse(mockCities, 'Cities retrieved successfully');
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}

// Export the cached version of the handler
export const GET = withCache(getCities, {
  ttl: 3600, // Cache for 1 hour
  keyPrefix: 'cities:',
});
