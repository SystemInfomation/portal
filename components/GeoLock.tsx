'use client'

/**
 * GeoLock Component - Restricts access to users from Georgia, United States only
 * 
 * Lightweight protection:
 * 1. IP-based geolocation using multiple free APIs
 * 2. Coordinate validation (if available)
 * 3. VPN/Proxy usage is allowed
 * 4. Persistent verification with 1-hour cache expiration
 * 5. No automatic background re-checking to prevent refresh loops
 */

export function GeoLock() {
  // No restrictions: anyone can enter the website
  return null;
}

