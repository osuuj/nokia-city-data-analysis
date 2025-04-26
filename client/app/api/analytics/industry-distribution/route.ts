import {
  HttpStatus,
  createErrorResponse,
  createSuccessResponse,
  validateNumericParam,
} from '@/features/api';
import { withCache } from '@/shared/middleware/cache';
import type { NextRequest } from 'next/server';

/**
 * GET /api/analytics/industry-distribution
 *
 * Returns the distribution of industries across all cities.
 *
 * Query parameters:
 * - limit: number (default: 10) - Maximum number of industries to return
 *
 * @param request The incoming request
 * @returns A response with the industry distribution data
 */
async function getIndustryDistribution(request: NextRequest) {
  try {
    // Get the limit from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');

    // Set default limit if not provided
    const limit = limitParam ? Number(limitParam) : 10;

    // Validate limit parameter if provided
    if (limitParam) {
      validateNumericParam(limit, 'limit', 1, 100);
    }

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
    return createSuccessResponse(
      mockIndustryDistribution.slice(0, limit),
      'Industry distribution data retrieved successfully',
    );
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}

// Export the cached version of the handler
export const GET = withCache(getIndustryDistribution, {
  ttl: 3600, // Cache for 1 hour
  keyPrefix: 'analytics:industry-distribution:',
});
