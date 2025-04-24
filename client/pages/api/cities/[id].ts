import type { City } from '@/features/dashboard/hooks/useCities';
import type { NextApiRequest, NextApiResponse } from 'next';

// Mock data for demonstration
const mockCities: { [key: string]: City } = {
  '1': {
    id: '1',
    name: 'Helsinki',
    country: 'Finland',
    population: 658864,
    coordinates: {
      latitude: 60.1699,
      longitude: 24.9384,
    },
  },
  '2': {
    id: '2',
    name: 'Tampere',
    country: 'Finland',
    population: 244029,
    coordinates: {
      latitude: 61.4978,
      longitude: 23.761,
    },
  },
  '3': {
    id: '3',
    name: 'Turku',
    country: 'Finland',
    population: 194244,
    coordinates: {
      latitude: 60.4518,
      longitude: 22.2666,
    },
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  const cityId = Array.isArray(id) ? id[0] : id;

  if (!cityId) {
    return res.status(400).json({ message: 'City ID is required' });
  }

  try {
    const city = mockCities[cityId];

    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    return res.status(200).json({
      data: city,
      message: 'City retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching city:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
