# Google Analytics Real-time Setup

To enable Google Analytics real-time data in the admin dashboard, you need to:

## 1. Get Your GA4 Property ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Go to Admin → Property Settings
4. Copy your Property ID: `523244119` ✅

## 2. Set Up Google Analytics Data API with OAuth2

**Important:** The Google Analytics Data API requires OAuth2 authentication, not API keys.

### Option A: Service Account (Recommended for Production)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a service account
3. Enable the "Google Analytics Data API"
4. Download JSON key file
5. Add the service account email to your Google Analytics property with "Read & Analyze" permissions

### Option B: OAuth2 Client (For Development)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth2 Client ID credentials
3. Enable the "Google Analytics Data API"
4. Generate access token using OAuth2 flow

## 3. Update Configuration

Update `/lib/google-analytics.ts` with your credentials:

```typescript
constructor() {
  this.propertyId = '523244119'; // Your GA4 property ID
  this.accessToken = 'YOUR_OAUTH2_ACCESS_TOKEN'; // Generate via OAuth2 flow
}
```

## 4. Alternative: Use a Server-Side Proxy

For better security, create a server-side API route that handles the OAuth2 authentication:

```typescript
// app/api/ga-realtime/route.ts
export async function GET() {
  // Handle OAuth2 server-side
  // Return data to client
}
```

## 5. Features Available

Once configured, the admin dashboard will show:

- **Real-time Active Users**: Users active in the last 30 minutes
- **Active Users by Country**: Geographic distribution of active users
- **Active Users by Page**: Which pages users are currently viewing

## 6. Current Status

- ✅ Property ID configured: `523244119`
- ⏳ OAuth2 authentication needed
- 🚀 Basic gtag.js tracking already working

The admin dashboard gracefully handles missing GA API credentials and will show "N/A" for real-time data until OAuth2 is properly configured.
