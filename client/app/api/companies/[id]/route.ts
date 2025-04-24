import { NextResponse } from 'next/server';

// Mock data for companies (should be imported from a shared location in a real app)
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
 * GET handler for /api/companies/[id]
 * Returns details for a specific company
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const company = mockCompanies.find((c) => c.id === params.id);

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error: 'Company not found',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('Error in company detail API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch company details',
      },
      { status: 500 },
    );
  }
}

/**
 * PUT handler for /api/companies/[id]
 * Updates a specific company
 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const companyIndex = mockCompanies.findIndex((c) => c.id === params.id);

    if (companyIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Company not found',
        },
        { status: 404 },
      );
    }

    // In a real application, validate the body and update in database
    const updatedCompany = {
      ...mockCompanies[companyIndex],
      ...body,
      id: params.id, // Ensure ID doesn't change
    };

    return NextResponse.json({
      success: true,
      data: updatedCompany,
    });
  } catch (error) {
    console.error('Error in company update API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update company',
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE handler for /api/companies/[id]
 * Deletes a specific company
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const companyIndex = mockCompanies.findIndex((c) => c.id === params.id);

    if (companyIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Company not found',
        },
        { status: 404 },
      );
    }

    // In a real application, delete from database
    return NextResponse.json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    console.error('Error in company delete API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete company',
      },
      { status: 500 },
    );
  }
}
