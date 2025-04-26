import {
  ApiError,
  HttpStatus,
  createErrorResponse,
  createSuccessResponse,
  validateNumericParam,
} from '@/features/api';
import { withCache } from '@/shared/middleware/cache';
import { type NextRequest, NextResponse } from 'next/server';

// Mock data for companies
const mockCompanies = [
  {
    id: '1',
    name: 'Tech Solutions Oy',
    industry: 'Technology',
    city: 'Nokia',
    address: 'Teollisuustie 1',
    postalCode: '37100',
    website: 'https://techsolutions.fi',
    active: true,
  },
  {
    id: '2',
    name: 'Green Energy Ab',
    industry: 'Energy',
    city: 'Nokia',
    address: 'Energiakatu 5',
    postalCode: '37120',
    website: 'https://greenenergy.fi',
    active: true,
  },
  {
    id: '3',
    name: 'Digital Services Ltd',
    industry: 'IT Services',
    city: 'Nokia',
    address: 'Digitaalitie 10',
    postalCode: '37150',
    website: 'https://digitalservices.fi',
    active: true,
  },
];

/**
 * GET handler for /api/companies
 * Returns a list of companies, optionally filtered by query parameters
 *
 * @param request The incoming request
 * @returns A response with the filtered list of companies
 */
async function getCompanies(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const industry = searchParams.get('industry');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');

    let filteredCompanies = [...mockCompanies];

    // Apply filters if provided
    if (city) {
      filteredCompanies = filteredCompanies.filter(
        (company) => company.city.toLowerCase() === city.toLowerCase(),
      );
    }

    if (industry) {
      filteredCompanies = filteredCompanies.filter(
        (company) => company.industry.toLowerCase() === industry.toLowerCase(),
      );
    }

    // Handle pagination
    let paginatedCompanies = filteredCompanies;
    let pagination = undefined;

    if (page && limit) {
      // Validate pagination parameters
      validateNumericParam(page, 'page', 1);
      validateNumericParam(limit, 'limit', 1, 100);

      const pageNum = Number(page);
      const limitNum = Number(limit);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;

      paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);
      pagination = {
        page: pageNum,
        limit: limitNum,
        total: filteredCompanies.length,
        totalPages: Math.ceil(filteredCompanies.length / limitNum),
      };
    }

    return createSuccessResponse(
      paginatedCompanies,
      'Companies retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}

/**
 * POST handler for /api/companies
 * Creates a new company
 *
 * @param request The incoming request
 * @returns A response with the newly created company
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      throw new ApiError('Company name is required', HttpStatus.BAD_REQUEST);
    }

    if (!body.industry) {
      throw new ApiError('Company industry is required', HttpStatus.BAD_REQUEST);
    }

    if (!body.city) {
      throw new ApiError('Company city is required', HttpStatus.BAD_REQUEST);
    }

    // In a real application, validate the body and save to database
    const newCompany = {
      id: String(mockCompanies.length + 1),
      ...body,
      active: true,
    };

    return createSuccessResponse(newCompany, 'Company created successfully', HttpStatus.CREATED);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}

// Export the cached version of the GET handler
export const GET = withCache(getCompanies, {
  ttl: 1800, // Cache for 30 minutes
  keyPrefix: 'companies:',
});
