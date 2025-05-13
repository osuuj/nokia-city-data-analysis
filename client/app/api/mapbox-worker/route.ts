import { NextResponse } from 'next/server';

const MAPBOX_WORKER_URL = 'https://api.mapbox.com/mapbox-gl-js/v3.11.1/mapbox-gl-csp-worker.js';

export async function GET() {
  try {
    // Fetch the worker script from Mapbox CDN
    const response = await fetch(MAPBOX_WORKER_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch Mapbox worker: ${response.status}`);
    }

    // Get the worker script content
    const workerScript = await response.text();

    // Return the script with proper JS MIME type
    return new NextResponse(workerScript, {
      headers: {
        'Content-Type': 'application/javascript',
        // Cache the worker for 1 week (604800 seconds)
        'Cache-Control': 'public, max-age=604800, immutable',
      },
    });
  } catch (error) {
    console.error('Error fetching Mapbox worker:', error);
    return new NextResponse('Failed to load Mapbox worker script', { status: 500 });
  }
}
