'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * TimeBasedAccessControl - Enforces time-based access control client-side
 * 
 * Allowed hours: 6 AM - 5 PM Eastern Time
 * Blocked hours: 5 PM - 6 AM Eastern Time
 * 
 * During after-school hours (blocked hours), only the /settings page is accessible.
 * All other pages redirect to /locked.
 * 
 * Can be disabled via localStorage setting: 'forsyth-time-restriction-enabled'
 * 
 * Multiple layers of protection:
 * - Immediate redirect on mount
 * - Continuous checking every second
 * - Blocks all navigation attempts (except /settings during blocked hours)
 * - Covers entire page to prevent interaction
 */
export function TimeBasedAccessControl() {
  const router = useRouter()
  const pathname = usePathname()
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    const checkTime = () => {
      // Check if time restriction is enabled (default: true)
      const restrictionEnabled = typeof window !== 'undefined' 
        ? localStorage.getItem('forsyth-time-restriction-enabled') !== 'false'
        : true

      // If restriction is disabled, don't block anything
      if (!restrictionEnabled) {
        setIsBlocked(false)
        
        // If we're on the locked page and restriction is disabled, redirect home
        const normalizedPath = pathname.replace(/\/$/, '')
        const isOnLockedPage = normalizedPath === '/locked'
        if (isOnLockedPage) {
          router.replace('/')
        }
        return
      }

      // Get current time in Eastern timezone
      const now = new Date()
      const easternTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
      const hours = easternTime.getHours()
      
      // Block if outside 6 AM - 5 PM (Eastern Time)
      // Allowed: 6:00 AM (6) to 4:59 PM (16:59)
      // Blocked: 5:00 PM (17) to 5:59 AM (5:59)
      const blocked = hours < 6 || hours >= 17

      setIsBlocked(blocked)

      // Normalize pathname for comparison (remove trailing slash)
      const normalizedPath = pathname.replace(/\/$/, '')
      const isOnLockedPage = normalizedPath === '/locked'
      const isOnSettingsPage = normalizedPath === '/settings'

      // During after-school hours, allow access to settings page only
      if (blocked) {
        // If not on locked page or settings page, redirect to locked page
        if (!isOnLockedPage && !isOnSettingsPage) {
          // Use replace to prevent browser back button from accessing blocked pages
          router.replace('/locked')
        }
      }
      // If not blocked and on locked page, redirect to home
      else if (!blocked && isOnLockedPage) {
        router.replace('/')
      }
    }

    // Check immediately on mount
    checkTime()

    // Check every second for instant response at unlock/lock times
    const interval = setInterval(checkTime, 1000)

    return () => clearInterval(interval)
  }, [router, pathname])

  // Render blocking overlay if blocked and not on locked page or settings page
  // This prevents any interaction while redirect is happening
  // Normalize pathname for comparison (remove trailing slash)
  const normalizedPath = pathname.replace(/\/$/, '')
  const isOnLockedPage = normalizedPath === '/locked'
  const isOnSettingsPage = normalizedPath === '/settings'
  
  if (isBlocked && !isOnLockedPage && !isOnSettingsPage) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-white text-lg md:text-xl mb-4">Redirecting to locked page...</div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
