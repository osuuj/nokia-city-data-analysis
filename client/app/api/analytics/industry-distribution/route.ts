import { type NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/analytics/industry-distribution
 *
 * Returns the distribution of industries across all cities.
 *
 * Query parameters:
 * - limit: number (default: 10) - Maximum number of industries to return
 */
export async function GET(request: NextRequest) {
  try {
    // Get the limit from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = Number.parseInt(searchParams.get('limit') || '10', 10);

    // Mock data for industry distribution
    // In a real implementation, this would come from a database
    const mockIndustryDistribution = [
      { industry: 'Technology', count: 200, percentage: 25 },
      { industry: 'Manufacturing', count: 150, percentage: 18.75 },
      { industry: 'Healthcare', count: 120, percentage: 15 },
      { industry: 'Finance', count: 100, percentage: 12.5 },
      { industry: 'Retail', count: 80, percentage: 10 },
      { industry: 'Education', count: 60, percentage: 7.5 },
      { industry: 'Construction', count: 40, percentage: 5 },
      { industry: 'Transportation', count: 30, percentage: 3.75 },
      { industry: 'Energy', count: 20, percentage: 2.5 },
      { industry: 'Other', count: 10, percentage: 1.25 },
    ];

    // Return the mock data
    return NextResponse.json({
      data: mockIndustryDistribution.slice(0, limit),
      status: 'success',
    });
  } catch (error) {
    console.error('Error in industry-distribution API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch industry distribution data', status: 500 },
      { status: 500 },
    );
  }
}
