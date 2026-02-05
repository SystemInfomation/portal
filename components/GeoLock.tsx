'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * GeoLock Component - Restricts access to users from Georgia, United States only
 * 
 * Multi-layered protection:
 * 1. IP-based geolocation using multiple free APIs
 * 2. Browser Geolocation API for GPS verification
 * 3. VPN/Proxy detection mechanisms
 * 4. Persistent verification with expiration
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

    // Re-check every hour when verification expires
    // Only start interval if not blocked
    const interval = setInterval(() => {
      checkGeoLocation()
    }, VERIFICATION_EXPIRY)
    
    return () => clearInterval(interval)
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
      
      // Check for proxy/VPN indicators
      if (data.asn && (
        data.org?.toLowerCase().includes('vpn') ||
        data.org?.toLowerCase().includes('proxy') ||
        data.org?.toLowerCase().includes('hosting')
      )) {
        geoData.isVPN = true
      }
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
        
        // Check org for VPN/hosting indicators
        if (data.org && (
          data.org.toLowerCase().includes('vpn') ||
          data.org.toLowerCase().includes('proxy') ||
          data.org.toLowerCase().includes('hosting')
        )) {
          geoData.isVPN = true
        }
      }
    } catch (error) {
      console.warn('ipinfo.io failed:', error)
    }
  }

  // Method 3: Browser Geolocation API (GPS-based)
  // This can help verify location and detect VPN discrepancies
  try {
    if (navigator.geolocation) {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 300000, // 5 minutes
          enableHighAccuracy: false
        })
      })
      
      // If we have GPS coordinates but they're far from Georgia, it's suspicious
      if (geoData.lat && geoData.lon) {
        const distance = calculateDistance(
          geoData.lat,
          geoData.lon,
          position.coords.latitude,
          position.coords.longitude
        )
        
        // If IP location and GPS are more than 200km apart, flag as suspicious
        if (distance > 200) {
          geoData.isVPN = true
        }
      }
    }
  } catch (error) {
    // GPS denied or unavailable - not necessarily suspicious
    console.warn('Geolocation API failed:', error)
  }

  return geoData
}

/**
 * Validate if the detected location is in Georgia, US
 */
function validateLocation(geoData: GeoLocation): boolean {
  // If VPN/Proxy detected, block
  if (geoData.isVPN || geoData.isProxy) {
    return false
  }

  // Check country
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

  // Check state/region for Georgia
  const isGeorgia = 
    geoData.state === ALLOWED_STATE ||
    geoData.region === ALLOWED_STATE ||
    geoData.state?.toLowerCase() === 'georgia' ||
    geoData.region?.toLowerCase() === 'georgia' ||
    geoData.state?.toLowerCase() === 'ga' ||
    geoData.region?.toLowerCase() === 'ga'

  if (!isGeorgia) {
    // Additional check: verify coordinates are within Georgia bounds
    // Georgia approximate bounds: 30.36°N to 35°N, -85.61°W to -80.84°W
    if (geoData.lat && geoData.lon) {
      const inGeorgiaBounds = 
        geoData.lat >= 30.36 && geoData.lat <= 35.0 &&
        geoData.lon >= -85.61 && geoData.lon <= -80.84
      
      if (!inGeorgiaBounds) {
        return false
      }
    } else {
      // No coordinates and state name doesn't match - block
      return false
    }
  }

  // Additional validation: Check timezone
  // Georgia is in Eastern Time Zone
  if (geoData.timezone) {
    const validTimezones = ['America/New_York', 'EST', 'EDT', 'US/Eastern']
    const isValidTimezone = validTimezones.some(tz => 
      geoData.timezone?.includes(tz)
    )
    
    if (!isValidTimezone) {
      // Timezone doesn't match Georgia - suspicious
      return false
    }
  }

  // All checks passed
  return true
}

/**
 * Calculate distance between two coordinates in km
 * Uses Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}
