import { type NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/analytics/top-cities
 *
 * Returns the top cities based on company count.
 *
 * Query parameters:
 * - limit: number (default: 10) - Maximum number of cities to return
 */
export async function GET(request: NextRequest) {
  try {
    // Get the limit from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = Number.parseInt(searchParams.get('limit') || '10', 10);

    // Mock data for top cities
    // In a real implementation, this would come from a database
    const mockTopCities = [
      {
        city: 'Helsinki',
        count: 150,
        companyCount: 120,
        industryCount: 15,
        averageCompaniesPerIndustry: 8,
      },
      {
        city: 'Espoo',
        count: 120,
        companyCount: 100,
        industryCount: 12,
        averageCompaniesPerIndustry: 8.3,
      },
      {
        city: 'Tampere',
        count: 100,
        companyCount: 80,
        industryCount: 10,
        averageCompaniesPerIndustry: 8,
      },
      {
        city: 'Vantaa',
        count: 80,
        companyCount: 60,
        industryCount: 8,
        averageCompaniesPerIndustry: 7.5,
      },
      {
        city: 'Oulu',
        count: 60,
        companyCount: 50,
        industryCount: 7,
        averageCompaniesPerIndustry: 7.1,
      },
      {
        city: 'Turku',
        count: 50,
        companyCount: 40,
        industryCount: 6,
        averageCompaniesPerIndustry: 6.7,
      },
      {
        city: 'Jyväskylä',
        count: 40,
        companyCount: 30,
        industryCount: 5,
        averageCompaniesPerIndustry: 6,
      },
      {
        city: 'Lahti',
        count: 30,
        companyCount: 25,
        industryCount: 4,
        averageCompaniesPerIndustry: 6.3,
      },
      {
        city: 'Kuopio',
        count: 25,
        companyCount: 20,
        industryCount: 3,
        averageCompaniesPerIndustry: 6.7,
      },
      {
        city: 'Pori',
        count: 20,
        companyCount: 15,
        industryCount: 3,
        averageCompaniesPerIndustry: 5,
      },
    ];

    // Return the mock data
    return NextResponse.json({
      data: mockTopCities.slice(0, limit),
      status: 'success',
    });
  } catch (error) {
    console.error('Error in top-cities API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top cities data', status: 500 },
      { status: 500 },
    );
  }
}
