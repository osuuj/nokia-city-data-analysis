import { type NextRequest, NextResponse } from 'next/server';

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.osuuj.ai';

/**
 * This is a server-side proxy for the backend API.
 * It forwards requests to the backend API and returns the response.
 * This helps bypass CORS issues when the frontend and backend are on different domains.
 */
export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    // Get the path segments and reconstruct the path
    const pathSegments = params.path || [];
    const path = pathSegments.join('/');

    // Get the search params
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';

    // Construct the full URL
    const url = `${API_BASE_URL}/api/v1/${path}${queryString}`;

    console.log(`Proxy - Forwarding request to: ${url}`);

    // Forward the request to the backend API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    // Check if the response was successful
    if (!response.ok) {
      console.error(`Proxy - Error response: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch data: ${response.status} ${response.statusText}` },
        { status: response.status },
      );
    }

    // Get the response data
    const data = await response.json();

    // Return the response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy - Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching data from the API' },
      { status: 500 },
    );
  }
}
