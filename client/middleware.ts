import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit } from './shared/utils/rateLimit';

export async function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Apply rate limiting
  const rateLimitResult = await rateLimit(request);
  if (!rateLimitResult.success) {
    return rateLimitResult.error;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
