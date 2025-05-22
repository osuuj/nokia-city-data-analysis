# Securing Mapbox Access Tokens

This guide explains how to properly secure your Mapbox access tokens, which are used in our client-side application for map rendering.

## Current Implementation

In our application, we use a Mapbox access token exposed to the client via the environment variable `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`. This token is necessary for client-side map rendering, but its exposure requires additional security measures.

## Security Concerns

Exposing the Mapbox token to client-side code poses these risks:
- Unauthorized usage of your Mapbox services
- Potential billing impacts if the token is abused
- Service disruptions if usage limits are exceeded

## Required Security Measures

### 1. Add URL Restrictions to Your Mapbox Token

1. Log in to your [Mapbox account](https://account.mapbox.com/)
2. Navigate to "Access tokens" in the account menu
3. Find your public token used for this application
4. Click "Edit" next to the token
5. Under "URL restrictions", add the following URLs:
   - Your production domain: `https://yourdomain.com/*`
   - Your staging domain: `https://staging.yourdomain.com/*`
   - For local development: `http://localhost:*`
6. Save your changes

Example configuration:
```
URL restrictions:
- https://osuuj.ai/*
- https://*.osuuj.ai/*
- https://*.vercel.app/*
- http://localhost:*
```

### 2. Set Usage Limits

1. In the same token settings, set appropriate usage limits
2. Monitor usage regularly through the Mapbox dashboard

### 3. Use Scoped Tokens

Ensure your token has only the scopes it needs:
- `styles:read` - For loading map styles
- `fonts:read` - For loading map fonts
- `styles:tiles` - For loading map tiles

Remove any unnecessary scopes, especially:
- `styles:write`
- `datasets:write`
- `tilesets:write`

### 4. Token Rotation Plan

1. Create a schedule for rotating tokens (e.g., quarterly)
2. Create the new token before disabling the old one
3. Update the token in all environment configurations
4. Monitor for any issues after rotation

## Testing Token Restrictions

After setting URL restrictions, verify that:
1. Maps load correctly on your authorized domains
2. Direct API calls with the token fail from unauthorized domains

## Emergency Response

If you suspect your token has been compromised:
1. Immediately create a new token with proper restrictions
2. Delete the compromised token
3. Update all environment variables with the new token

Remember that properly implementing URL restrictions is the most critical security measure for public Mapbox tokens. 