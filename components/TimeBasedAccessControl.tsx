'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * TimeBasedAccessControl - Enforces time-based access control client-side
 * 
 * Allowed hours: 6 AM - 5 PM Eastern Time
 * Blocked hours: 5 PM - 6 AM Eastern Time
 * 
 * Multiple layers of protection:
 * - Immediate redirect on mount
 * - Continuous checking every second
 * - Blocks all navigation attempts
 * - Covers entire page to prevent interaction
 */
export function TimeBasedAccessControl() {
  const router = useRouter()
  const pathname = usePathname()
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    const checkTime = () => {
      // Get current time in Eastern timezone
      const now = new Date()
      const easternTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
      const hours = easternTime.getHours()
      
      // Block if outside 6 AM - 5 PM (Eastern Time)
      // Allowed: 6:00 AM (6) to 4:59 PM (16:59)
      // Blocked: 5:00 PM (17) to 5:59 AM (5:59)
      const blocked = hours < 6 || hours >= 17

      setIsBlocked(blocked)

      // If blocked and not already on locked page, redirect immediately
      if (blocked && pathname !== '/locked') {
        router.replace('/locked')
      }
      // If not blocked and on locked page, redirect to home
      else if (!blocked && pathname === '/locked') {
        router.replace('/')
      }
    }

    // Check immediately on mount
    checkTime()

    // Check every second for instant response at unlock/lock times
    const interval = setInterval(checkTime, 1000)

    return () => clearInterval(interval)
  }, [router, pathname])

  // Render blocking overlay if blocked and not on locked page
  // This prevents any interaction while redirect is happening
  if (isBlocked && pathname !== '/locked') {
    return (
      <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center">
        <div className="text-white text-xl">Redirecting to locked page...</div>
      </div>
    )
  }

  return null
}
