'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

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

interface GeoLocation {
  country?: string
  region?: string
  state?: string
  city?: string
  lat?: number
  lon?: number
  timezone?: string
  isVPN?: boolean
  isProxy?: boolean
}

const ALLOWED_STATE = 'Georgia'
const ALLOWED_COUNTRY = 'United States'
const ALLOWED_COUNTRY_CODE = 'US'
const VERIFICATION_EXPIRY = 3600000 // 1 hour in milliseconds

export function GeoLock() {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    const checkGeoLocation = async () => {
      try {
        // Normalize pathname
        const normalizedPath = pathname.replace(/\/$/, '')
        const isOnGeoBlockedPage = normalizedPath === '/geo-blocked'
        
        // Check if we have a recent valid verification
        const storedVerification = localStorage.getItem('geo_verification')
        if (storedVerification) {
          try {
            const verification = JSON.parse(storedVerification)
            const now = Date.now()
            
            // If verification is recent and valid, allow access
            if (verification.timestamp && (now - verification.timestamp) < VERIFICATION_EXPIRY && verification.allowed) {
              setIsChecking(false)
              setIsBlocked(false)
              return
            }
          } catch {
            // Invalid verification, continue with checks
            localStorage.removeItem('geo_verification')
          }
        }

        // Perform multiple geolocation checks
        const geoData = await performGeoChecks()
        
        // Determine if user is in Georgia, US
        const isAllowed = validateLocation(geoData)
        
        // Store verification result
        const verification = {
          timestamp: Date.now(),
          allowed: isAllowed,
          location: geoData
        }
        localStorage.setItem('geo_verification', JSON.stringify(verification))
        
        setIsBlocked(!isAllowed)
        setIsChecking(false)

        // Redirect if needed
        if (!isAllowed && !isOnGeoBlockedPage) {
          router.replace('/geo-blocked')
        } else if (isAllowed && isOnGeoBlockedPage) {
          router.replace('/')
        }
      } catch (error) {
        console.error('Geo-lock error:', error)
        // On error, block access for security
        setIsBlocked(true)
        setIsChecking(false)
        const normalizedPath = pathname.replace(/\/$/, '')
        if (normalizedPath !== '/geo-blocked') {
          router.replace('/geo-blocked')
        }
      }
    }

    checkGeoLocation()

    // Note: Automatic re-checking has been removed to prevent refresh loops
    // Users will be re-verified only when they reload the page or after cache expiry
  }, [router, pathname])

  // Render blocking overlay if checking or blocked
  const normalizedPath = pathname.replace(/\/$/, '')
  const isOnGeoBlockedPage = normalizedPath === '/geo-blocked'
  
  if (isChecking || (isBlocked && !isOnGeoBlockedPage)) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-white text-lg md:text-xl mb-4">
            {isChecking ? 'Verifying location...' : 'Redirecting...'}
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

/**
 * Perform multiple geolocation checks using different methods
 */
async function performGeoChecks(): Promise<GeoLocation> {
  const geoData: GeoLocation = {}
  
  // Method 1: ipapi.co (Free, no API key required)
  try {
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    
    if (response.ok) {
      const data = await response.json()
      geoData.country = data.country_name
      geoData.region = data.region
      geoData.state = data.region
      geoData.city = data.city
      geoData.lat = data.latitude
      geoData.lon = data.longitude
      geoData.timezone = data.timezone
      
      // VPN/proxy detection removed - VPNs are now allowed
      // Users can access the site regardless of VPN usage
    }
  } catch (error) {
    console.warn('ipapi.co failed:', error)
  }

  // Method 2: ipinfo.io (backup, free, no API key required)
  if (!geoData.country) {
    try {
      // Create AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch('https://ipinfo.io/json', {
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        geoData.country = data.country === 'US' ? 'United States' : data.country
        geoData.region = data.region
        geoData.state = data.region
        geoData.city = data.city
        
        // Parse location coordinates
        if (data.loc) {
          const [lat, lon] = data.loc.split(',').map(Number)
          geoData.lat = lat
          geoData.lon = lon
        }
        
        geoData.timezone = data.timezone
        
        // VPN/proxy detection removed - VPNs are now allowed
        // Users can access the site regardless of VPN usage
      }
    } catch (error) {
      console.warn('ipinfo.io failed:', error)
    }
  }

  // GPS-based validation removed for lighter geo-blocking
  // This reduces false positives and allows VPN users

  return geoData
}

/**
 * Validate if the detected location is in Georgia, US
 * Simplified version - lighter and less strict to reduce false positives
 */
function validateLocation(geoData: GeoLocation): boolean {
  // VPN/Proxy blocking removed - all VPNs are now allowed
  
  // Check country (basic check only)
  const isUSA = 
    geoData.country === ALLOWED_COUNTRY ||
    geoData.country === ALLOWED_COUNTRY_CODE ||
    geoData.country?.toLowerCase() === 'us' ||
    geoData.country?.toLowerCase() === 'usa' ||
    geoData.country?.toLowerCase() === 'united states' ||
    geoData.country?.toLowerCase() === 'united states of america'

  if (!isUSA) {
    return false
  }

  // Check state/region for Georgia (more lenient)
  const isGeorgia = 
    geoData.state === ALLOWED_STATE ||
    geoData.region === ALLOWED_STATE ||
    geoData.state?.toLowerCase() === 'georgia' ||
    geoData.region?.toLowerCase() === 'georgia' ||
    geoData.state?.toLowerCase() === 'ga' ||
    geoData.region?.toLowerCase() === 'ga'

  if (!isGeorgia) {
    // Fallback: check if coordinates are within Georgia bounds
    // This is more lenient than before - allows access if coordinates match
    if (geoData.lat && geoData.lon) {
      const inGeorgiaBounds = 
        geoData.lat >= 30.36 && geoData.lat <= 35.0 &&
        geoData.lon >= -85.61 && geoData.lon <= -80.84
      
      return inGeorgiaBounds
    }
    // If no coordinates and state name doesn't match, block
    return false
  }

  // Timezone validation removed for lighter geo-blocking
  // State/country validation passed
  return true
}
