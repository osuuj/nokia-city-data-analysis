import { NextResponse } from 'next/server';

// Mock data for company statistics
const mockStatistics = {
  '1': {
    revenue: {
      current: 1500000,
      previous: 1200000,
      growth: 25,
    },
    employees: {
      current: 50,
      previous: 40,
      growth: 25,
    },
    marketShare: {
      current: 15,
      previous: 12,
      growth: 25,
    },
    customerSatisfaction: {
      current: 4.5,
      previous: 4.2,
      growth: 7.14,
    },
  },
  '2': {
    revenue: {
      current: 2000000,
      previous: 1800000,
      growth: 11.11,
    },
    employees: {
      current: 75,
      previous: 65,
      growth: 15.38,
    },
    marketShare: {
      current: 20,
      previous: 18,
      growth: 11.11,
    },
    customerSatisfaction: {
      current: 4.8,
      previous: 4.6,
      growth: 4.35,
    },
  },
  '3': {
    revenue: {
      current: 800000,
      previous: 600000,
      growth: 33.33,
    },
    employees: {
      current: 25,
      previous: 20,
      growth: 25,
    },
    marketShare: {
      current: 8,
      previous: 6,
      growth: 33.33,
    },
    customerSatisfaction: {
      current: 4.3,
      previous: 4.0,
      growth: 7.5,
    },
  },
};

/**
 * GET handler for /api/companies/[id]/statistics
 * Returns statistics for a specific company
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const statistics = mockStatistics[params.id as keyof typeof mockStatistics];

    if (!statistics) {
      return NextResponse.json(
        {
          success: false,
          error: 'Statistics not found for this company',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error('Error in company statistics API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch company statistics',
      },
      { status: 500 },
    );
  }
}
