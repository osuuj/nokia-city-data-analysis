# Content Security Policy for Vercel Deployment

This document outlines how to configure Content Security Policy (CSP) for the client-side application deployed on Vercel.

## Why CSP Is Important

Content Security Policy is a critical security layer that helps prevent:
- Cross-Site Scripting (XSS) attacks
- Data injection attacks
- Clickjacking
- Code injection from unauthorized sources

## CSP Implementation for Vercel

### Option 1: Using Vercel.json (Recommended)

1. Add or update your `client/vercel.json` file with proper CSP headers:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' https://*.vercel-insights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.mapbox.com https://api.mapbox.com https://events.mapbox.com; connect-src 'self' https://*.mapbox.com https://api.mapbox.com https://events.mapbox.com https://api.osuuj.ai https://*.vercel-insights.com; worker-src 'self' blob:; child-src blob:; frame-ancestors 'none'; object-src 'none'; base-uri 'none'"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

### Option 2: Using Next.js API Route

If you need more dynamic control, create a custom middleware in your Next.js app:

1. Create a file at `client/middleware.ts`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the response
  const response = NextResponse.next();

  // Add the CSP header
  const cspValue = 
    "default-src 'self'; " +
    "script-src 'self' https://*.vercel-insights.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https://*.mapbox.com https://api.mapbox.com https://events.mapbox.com; " +
    "connect-src 'self' https://*.mapbox.com https://api.mapbox.com https://events.mapbox.com https://api.osuuj.ai https://*.vercel-insights.com; " +
    "worker-src 'self' blob:; " +
    "child-src blob:; " +
    "frame-ancestors 'none'; " +
    "object-src 'none'; " +
    "base-uri 'none'";

  response.headers.set('Content-Security-Policy', cspValue);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

// Only run middleware on these paths
export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
```

## CSP Directives Explained

- `default-src 'self'`: Only allow resources from the same origin by default
- `script-src`: Restricts JavaScript sources
- `style-src`: Restricts CSS sources
- `img-src`: Restricts image sources (includes Mapbox)
- `connect-src`: Restricts URLs for fetch, WebSocket, and EventSource
- `worker-src`: Restricts Worker/ServiceWorker sources
- `child-src`: Restricts frame and worker sources
- `frame-ancestors 'none'`: Prevents your page from being framed (clickjacking protection)
- `object-src 'none'`: Prevents object/embed/applet elements
- `base-uri 'none'`: Prevents base tag injection attacks

## Testing CSP Configuration

Test your CSP configuration using these tools:
1. [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
2. [Security Headers](https://securityheaders.com/)
3. Browser developer tools (Console will show CSP violations)

## Monitoring CSP Violations

To monitor CSP violations in production:

1. Add a report-uri directive to your CSP:
```
report-uri https://your-reporting-endpoint.com/csp-reports;
```

2. Create a simple endpoint to collect these reports in `pages/api/csp-reports.js`:
```javascript
export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log('CSP violation:', req.body);
    // Store or forward the violation report
  }
  res.status(204).end();
}
```

## Important Notes

1. Test thoroughly after implementation as CSP can break functionality
2. Start with a more permissive policy and tighten gradually
3. Always include the required Mapbox domains in your CSP
4. Update the CSP whenever new external resources are added 