# Environment Variables Security Guidelines

## Client-Side Variables (`NEXT_PUBLIC_` prefix)

Next.js exposes environment variables with the `NEXT_PUBLIC_` prefix to the browser. This creates potential security risks if sensitive information is accidentally exposed.

### Rules for Client-Side Variables

Only use the `NEXT_PUBLIC_` prefix for variables that:
- Are truly public with no security implications
- Don't contain secrets, tokens, or credentials
- Need to be accessible in the browser

### Approved Public Environment Variables

| Variable | Purpose | Security Consideration |
|----------|---------|------------------------|
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Map rendering | Use public token only, not secret token |
| `NEXT_PUBLIC_API_BASE_URL` | Public API endpoint | Public URL only, no private endpoints |
| `NEXT_PUBLIC_API_VERSION` | API version identifier | Non-sensitive information |
| `NEXT_PUBLIC_ENVIRONMENT` | Current environment name | Non-sensitive information |

### ⚠️ Never Expose These in Client-Side Code:

- API keys with write access
- Authentication secrets
- Database credentials
- Tokens or keys granting admin/backend access
- Session secrets
- Private encryption keys

## Handling Sensitive Data

For operations that require secrets or credentials:

1. **Use Server-Side API Routes**:
   ```javascript
   // pages/api/secure-operation.js
   export default async function handler(req, res) {
     // Access server-side environment variables here
     const secretApiKey = process.env.SECRET_API_KEY; // Not exposed to client
     // Make authenticated request with the secret
     // Return only safe data to client
   }
   ```

2. **Store Secrets Without `NEXT_PUBLIC_` Prefix**:
   ```
   # Safe - not exposed to browser
   SECRET_API_KEY=sk_12345
   
   # Dangerous - exposed to browser
   NEXT_PUBLIC_SECRET_API_KEY=sk_12345  # NEVER DO THIS
   ```

3. **Use Runtime Environment Variables**:
   - For AWS ECS deployments, use container environment variables
   - For Vercel, use the Environment Variables section in the Vercel dashboard
   - Never commit actual values to source control

## Security Verification

We have automated checks to prevent accidental exposure of sensitive data:

- Pre-commit hook verifies no sensitive variables use the `NEXT_PUBLIC_` prefix
- CI pipeline validates environment variable patterns
- Run `node scripts/check-env-vars.js` locally to audit your .env files

## Adding New Public Environment Variables

If you need to add a new `NEXT_PUBLIC_` variable:

1. Verify it contains no sensitive information
2. Add it to the `ALLOWED_PUBLIC_VARS` list in `scripts/check-env-vars.js`
3. Document its purpose and security considerations in this document
4. Get approval from a security reviewer 