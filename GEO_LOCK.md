# Geographic Access Control (GeoLock)

## Overview

The Forsyth County Portal implements geographic access control to restrict website access to users physically located in Georgia, United States only. This feature uses multiple layers of verification to ensure compliance with educational resource policies.

## How It Works

### Multi-Layer Verification

The GeoLock system uses IP-based geolocation to verify user location:

1. **IP-Based Geolocation**
   - Primary: ipapi.co API (HTTPS)
   - Backup: ipinfo.io API (HTTPS)
   - Detects location from user's IP address

2. **Geographic Coordinates**
   - Validates coordinates are within Georgia state bounds (if available)
   - Georgia bounds: 30.36°N to 35°N, -85.61°W to -80.84°W

### Access Requirements

To access the portal, users must:

✅ Be physically located in Georgia, United States  
✅ Have an IP address that resolves to Georgia, US  

### Caching

- Valid location verification is cached for 1 hour
- Reduces API calls and improves performance
- Re-verification occurs automatically when cache expires or page is reloaded
- No automatic background re-checking to prevent refresh loops

## User Experience

### Allowed Users (Georgia, US)

1. Page loads normally
2. Quick location verification in background
3. Seamless access to all features

### Blocked Users (Outside Georgia)

1. Loading screen with "Verifying location..." message
2. Redirect to geo-blocked page
3. Clear message explaining geographic restrictions
4. Display of detected location (city, state, country)
5. Troubleshooting steps if location is incorrect

## Technical Implementation

### Files

- **`/components/GeoLock.tsx`** - Main geolocation verification component
- **`/app/geo-blocked/page.tsx`** - Blocked users landing page
- **`/app/layout.tsx`** - Integration point (GeoLock runs first)

### Key Features

- **Client-side only** - Works with Next.js static export
- **No API keys required** - Uses free geolocation APIs
- **Privacy-focused** - Only stores verification status locally
- **Multiple fallbacks** - Redundant APIs ensure reliability
- **Security-first** - Blocks on failure, not allows
- **VPN-friendly** - VPN and proxy usage is permitted
- **Lightweight** - Simplified validation reduces false positives

## Troubleshooting

### For Users in Georgia

If you're in Georgia and seeing the blocked page:

1. **Check Location Permissions**
   - Allow location access in browser settings if prompted
   - Reload the page

2. **Clear Cache**
   - Clear browser cache and cookies
   - Specifically clear localStorage

3. **Network Issues**
   - Contact network administrator if on school network
   - Try a different network connection
   - VPN usage is allowed, so this shouldn't cause issues

### For Administrators

If legitimate users are being blocked:

1. Check if school network uses a proxy that appears outside Georgia
2. Verify school's public IP resolves to Georgia location
3. Consider whitelisting school IP addresses (requires server-side implementation)

## Security Considerations

### Bypass Prevention

The system uses IP-based geolocation with coordinate validation:

- **State Validation**: Checks if IP resolves to Georgia
- **Coordinate Validation**: Verifies coordinates are within Georgia bounds (when available)
- **Multiple APIs**: Uses fallback APIs for reliability

### Limitations

The GeoLock provides basic geographic access control. For maximum security:

- Monitor access logs for suspicious patterns
- Consider server-side enforcement if available
- This is a lightweight system focused on reducing false positives

## API Dependencies

### Primary: ipapi.co
- **URL**: https://ipapi.co/json/
- **Free tier**: 1,000 requests/day
- **No API key required**
- **Returns**: Country, state, city, coordinates, timezone, ISP

### Backup: ipinfo.io
- **URL**: https://ipinfo.io/json
- **Free tier**: 50,000 requests/month
- **No API key required**
- **Returns**: Country, region, city, location, timezone, ISP

### Browser Geolocation API
- **Built-in**: No external service
- **Requires**: User permission
- **Returns**: GPS coordinates
- **Optional**: Not required for verification

## Future Enhancements

Potential improvements:

1. **Server-side enforcement** - Add Vercel Edge Middleware for pre-render blocking
2. **IP whitelisting** - Allow specific school IPs
3. **Admin override** - Temporary access codes for authorized users
4. **Analytics** - Track blocked access attempts
5. **Enhanced VPN detection** - Integrate dedicated VPN detection services

## Support

For issues or questions about geographic access control:

1. Check troubleshooting guide above
2. Contact school IT support
3. Submit issue on GitHub repository
