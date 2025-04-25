import { type NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/analytics/company-growth
 *
 * Returns the growth trend of companies over time.
 *
 * Query parameters:
 * - period: string (default: 'monthly') - The time period for the data ('daily', 'weekly', 'monthly', 'yearly')
 * - limit: number (default: 12) - Maximum number of data points to return
 */
export async function GET(request: NextRequest) {
  try {
    // Get the query parameters
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'monthly';
    const limit = Number.parseInt(searchParams.get('limit') || '12', 10);

    // Generate mock data based on the period
    const mockCompanyGrowth = generateMockGrowthData(period, limit);

    // Return the mock data
    return NextResponse.json({
      data: mockCompanyGrowth,
      status: 'success',
    });
  } catch (error) {
    console.error('Error in company-growth API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company growth data', status: 500 },
      { status: 500 },
    );
  }
}

/**
 * Generates mock company growth data based on the specified period and limit.
 */
function generateMockGrowthData(period: string, limit: number) {
  const data = [];
  const now = new Date();

  // Base growth rate and volatility for the mock data
  const baseGrowthRate = 0.05; // 5% base growth
  const volatility = 0.02; // 2% volatility

  // Starting company count
  let companyCount = 1000;

  // Generate data points based on the period
  for (let i = limit - 1; i >= 0; i--) {
    // Calculate the date for this data point
    const date = new Date(now);
    switch (period) {
      case 'daily':
        date.setDate(date.getDate() - i);
        break;
      case 'weekly':
        date.setDate(date.getDate() - i * 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() - i);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() - i);
        break;
      default:
        date.setMonth(date.getMonth() - i);
    }

    // Calculate a random growth factor with some volatility
    const growthFactor = 1 + baseGrowthRate + (Math.random() * volatility * 2 - volatility);

    // Apply the growth factor to the company count
    companyCount = Math.round(companyCount * growthFactor);

    // Format the date based on the period
    let formattedDate: string;
    switch (period) {
      case 'daily':
        formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
        break;
      case 'weekly': {
        const weekNumber = Math.ceil(
          (date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7,
        );
        formattedDate = `${date.getFullYear()}-W${weekNumber}`;
        break;
      }
      case 'monthly':
        formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'yearly':
        formattedDate = `${date.getFullYear()}`;
        break;
      default:
        formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    // Add the data point
    data.push({
      date: formattedDate,
      count: companyCount,
      growth: ((growthFactor - 1) * 100).toFixed(2), // Growth percentage
    });
  }

  return data;
}
