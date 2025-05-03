import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
