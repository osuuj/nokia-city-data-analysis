# Security Documentation

This document outlines the security measures implemented in the Nokia City Data Analysis client application.

## Content Security Policy (CSP)

Content Security Policy headers are implemented to protect against Cross-Site Scripting (XSS) and other code injection attacks. These headers control what resources the browser is allowed to load.

### Implementation

The CSP is configured in `vercel.json` with the following directives:

```
default-src 'self'; 
script-src 'self' 'unsafe-eval'; 
style-src 'self' 'unsafe-inline'; 
font-src 'self'; 
img-src 'self' data: https://img.heroui.chat https://i.pravatar.cc https://api.dicebear.com; 
connect-src 'self' https://*.amazonaws.com https://*.vercel.app; 
frame-ancestors 'none'; 
object-src 'none'; 
base-uri 'none'
```

This configuration:
- Restricts scripts to the same origin plus needed evaluations for Next.js
- Allows inline styles for Tailwind CSS
- Restricts fonts to the same origin
- Allows images from whitelisted domains only
- Restricts API connections to our domains and AWS
- Prevents our site from being embedded in frames
- Blocks object embeddings
- Prevents base URI manipulation

## Continuous Security Checks

Security is integrated into the development workflow:

### Pre-commit Hooks

Local security checks run before each commit with pre-commit hooks:
- Detecting private keys and secrets
- Checking JSON validity
- Running npm audit on dependency changes

### Pull Request Validation

Security checks are part of the PR validation process:
- Dependency vulnerability scanning
- Linting and type checking
- Build validation with security audits

### Production Deployment

Before deployment to production:
- Full security audit runs against dependencies
- License compliance check ensures all libraries have appropriate licenses
- Build process includes security gates

## Dependency Security

### Automatic Scanning

Dependency vulnerabilities are automatically scanned:

1. **Pre-commit**: Basic npm audit runs locally before commits affecting package files
2. **CI/CD Pipeline**: GitHub Actions workflow checks dependencies on every PR and push to main
3. **Weekly Scans**: Scheduled dependency audits run every Sunday
4. **Pre-build**: Security audit runs before every build

### Manual Checks

Run these commands to check dependencies manually:

- `npm run security:audit` - Check for vulnerabilities
- `npm run security:audit-fix` - Attempt to fix vulnerabilities automatically

## Environment Variables

All sensitive information is stored in environment variables:

- Production API endpoints are configured in Vercel's environment settings
- No secrets are stored in `NEXT_PUBLIC_` variables which are exposed to the client

## Error Handling

The application implements proper error boundaries and error handling:

- Errors are caught and displayed with appropriate UI
- Error details are safely displayed for debugging
- A retry mechanism is available for recoverable errors

## API Security

API requests are secured through:

- Input validation
- Error categorization
- Proper error handling
- Automatic retry for transient errors

## Additional Headers

Beyond CSP, the application sets:

- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - Additional XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy` - Restricts browser features

## Security Reporting

If you discover a security vulnerability in this project, please report it by:

1. **Email**: Send details to [security@example.com](mailto:security@example.com)
2. **Do not** disclose publicly until we've had a chance to address it

## Security Updates

Security updates and patches are applied:

1. Weekly automated security scans
2. Manual reviews before major releases
3. Critical vulnerabilities are addressed immediately 