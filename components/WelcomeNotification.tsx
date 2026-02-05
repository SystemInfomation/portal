'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, X } from 'lucide-react'

// Forsyth County, GA high school locations
const FORSYTH_SCHOOLS = [
  { id: 'south-forsyth', displayName: 'South Forsyth', coordinates: { lat: 34.118, lon: -84.156 } },
  { id: 'denmark', displayName: 'Denmark', coordinates: { lat: 34.078, lon: -84.200 } },
  { id: 'lambert', displayName: 'Lambert', coordinates: { lat: 34.084, lon: -84.142 } },
  { id: 'north-forsyth', displayName: 'North Forsyth', coordinates: { lat: 34.250, lon: -84.120 } },
  { id: 'west-forsyth', displayName: 'West Forsyth', coordinates: { lat: 34.140, lon: -84.250 } },
  { id: 'forsyth-central', displayName: 'Forsyth Central', coordinates: { lat: 34.180, lon: -84.090 } },
  { id: 'east-forsyth', displayName: 'East Forsyth', coordinates: { lat: 34.300, lon: -84.000 } },
  { id: 'alliance-academy', displayName: 'Alliance', coordinates: { lat: 34.150, lon: -84.180 } },
]

type SchoolLocation = (typeof FORSYTH_SCHOOLS)[number]

const PROXIMITY_THRESHOLD_KM = 20 // Only show if within ~12 miles
const NOTIFICATION_DURATION_MS = 8000
const STORAGE_KEY = 'forsyth-welcome-shown'

/**
 * Calculates the great-circle distance between two geographic points
 * using spherical law of cosines (simpler alternative to Haversine)
 */
function calculateDistanceKm(
  pointA: { lat: number; lon: number },
  pointB: { lat: number; lon: number }
): number {
  const EARTH_RADIUS_KM = 6371
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180

  const latARad = toRadians(pointA.lat)
  const latBRad = toRadians(pointB.lat)
  const lonDiffRad = toRadians(pointB.lon - pointA.lon)

  const centralAngle =
    Math.sin(latARad) * Math.sin(latBRad) +
    Math.cos(latARad) * Math.cos(latBRad) * Math.cos(lonDiffRad)

  return EARTH_RADIUS_KM * Math.acos(Math.min(1, centralAngle))
}

function findNearestSchool(userLocation: { lat: number; lon: number }): { school: SchoolLocation; distanceKm: number } | null {
  if (FORSYTH_SCHOOLS.length === 0) {
    return null
  }

  let nearestSchool: SchoolLocation = FORSYTH_SCHOOLS[0]
  let shortestDistance = Infinity

  for (const school of FORSYTH_SCHOOLS) {
    const distance = calculateDistanceKm(userLocation, school.coordinates)
    if (distance < shortestDistance) {
      shortestDistance = distance
      nearestSchool = school
    }
  }

  return { school: nearestSchool, distanceKm: shortestDistance }
}

export function WelcomeNotification() {
  const [schoolName, setSchoolName] = useState<string | null>(null)
  const [showNotification, setShowNotification] = useState(false)

  const dismissNotification = useCallback(() => {
    setShowNotification(false)
    sessionStorage.setItem(STORAGE_KEY, 'true')
  }, [])

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem(STORAGE_KEY)) {
      return
    }

    // Check for geolocation support
    if (!navigator.geolocation) {
      return
    }

    const geoOptions: PositionOptions = {
      enableHighAccuracy: false, // Network-based location is sufficient for 20km threshold
      timeout: 5000,
      maximumAge: 0,
    }

    let dismissTimer: ReturnType<typeof setTimeout> | null = null

    const onLocationSuccess = (position: GeolocationPosition) => {
      const userCoords = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      }

      const result = findNearestSchool(userCoords)
      if (!result) return

      const { school, distanceKm } = result

      // Only display if user is reasonably close to Forsyth County
      if (distanceKm <= PROXIMITY_THRESHOLD_KM) {
        setSchoolName(school.displayName)
        setShowNotification(true)

        // Auto-dismiss after duration
        dismissTimer = setTimeout(dismissNotification, NOTIFICATION_DURATION_MS)
      }
    }

    const onLocationError = (error: GeolocationPositionError) => {
      // Silently handle - no notification shown
      console.debug('Geolocation unavailable:', error.message)
    }

    navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError, geoOptions)

    // Cleanup function to clear any pending timer
    return () => {
      if (dismissTimer) {
        clearTimeout(dismissTimer)
      }
    }
  }, [dismissNotification])

  return (
    <AnimatePresence>
      {showNotification && schoolName && (
        <motion.div
          initial={{ opacity: 0, y: -80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[95] w-full max-w-md px-4"
        >
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 backdrop-blur-xl shadow-2xl shadow-emerald-500/20">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-80" />

            {/* Animated shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
            />

            {/* Content */}
            <div className="relative p-4 flex items-center gap-4">
              {/* Location icon with animation */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <MapPin className="w-5 h-5" />
                </motion.div>
              </div>

              {/* Welcome message */}
              <div className="flex-1">
                <p className="text-foreground font-semibold text-lg">
                  Welcome {schoolName}! 👋
                </p>
                <p className="text-sm text-muted-foreground">
                  Enjoy your visit to Forsyth Games
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={dismissNotification}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-background/30 hover:bg-background/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss welcome notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress indicator */}
            <motion.div
              className="h-1 bg-emerald-400"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: NOTIFICATION_DURATION_MS / 1000, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
