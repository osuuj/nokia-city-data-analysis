import { NextResponse } from 'next/server';

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
 */
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockCities,
    });
  } catch (error) {
    console.error('Error in cities API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cities',
      },
      { status: 500 },
    );
  }
}
