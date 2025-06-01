# Security Policy

Thank you for helping to keep the Nokia City Data Analysis project secure.

## Reporting a Vulnerability

If you believe you've found a security vulnerability, **please report it privately** to prevent abuse before a fix is implemented.

### Contact Method
- 📧 Email: [juuso.juvonen@osuuh.ai](mailto:juuso.juvonen@osuuh.ai)

Please include:
- Description of the issue
- Steps to reproduce (if applicable)
- Any potential impact

⚠️ **Do not create public GitHub issues for security-related reports.**

We'll respond as quickly as possible and coordinate a fix before any public disclosure.

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | ✅         |
| Older Releases | ❌         |

---

## Security Documentation

Our security implementation is documented across several files:

### Client-Side Security
- [Client Security Overview](../client/SECURITY.md) - Comprehensive client-side security measures
- [Content Security Policy](../client/docs/CSP_CONFIGURATION.md) - CSP configuration and implementation
- [Environment Variables Security](../client/docs/ENV_SECURITY.md) - Guidelines for secure environment variable usage
- [Mapbox Security](../client/docs/MAPBOX_SECURITY.md) - Security measures for Mapbox integration
- [API Endpoints Security](../client/docs/api-endpoints.md) - API security and documentation

### Security Practices

The Nokia City Data Analysis project implements multiple security layers:

1. **Content Security Policy (CSP)**
   - Strict CSP headers to prevent XSS and injection attacks
   - Configurable through Vercel deployment
   - Regular monitoring of CSP violations

2. **Environment Security**
   - Strict separation of client/server environment variables
   - No sensitive data in `NEXT_PUBLIC_` variables
   - Automated environment variable validation

3. **API Security**
   - Input validation on all endpoints
   - Rate limiting and request validation
   - Secure error handling and logging

4. **Continuous Security**
   - Automated dependency vulnerability scanning
   - Pre-commit security checks
   - PR validation with security gates
   - Regular security audits

5. **Mapbox Integration Security**
   - URL-restricted access tokens
   - Usage monitoring and limits
   - Regular token rotation

For detailed implementation guides and best practices, please refer to the specific documentation files linked above.

---

## Additional Resources

- [GitHub Code Scanning Alerts](../../security/code-scanning)
- [Dependabot Alerts](../../security/dependabot)
- [Project Documentation](../client/docs/README.md)