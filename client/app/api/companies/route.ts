import { NextResponse } from 'next/server';

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
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const industry = searchParams.get('industry');

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

    return NextResponse.json({
      success: true,
      data: filteredCompanies,
      count: filteredCompanies.length,
    });
  } catch (error) {
    console.error('Error in companies API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch companies',
      },
      { status: 500 },
    );
  }
}

/**
 * POST handler for /api/companies
 * Creates a new company
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // In a real application, validate the body and save to database
    const newCompany = {
      id: String(mockCompanies.length + 1),
      ...body,
      active: true,
    };

    return NextResponse.json({
      success: true,
      data: newCompany,
    });
  } catch (error) {
    console.error('Error in companies API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create company',
      },
      { status: 500 },
    );
  }
}
