'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function TabHider() {
  const [isHidden, setIsHidden] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()
  
  // Check if we're on a game page
  const isGamePage = pathname?.startsWith('/play/') && pathname !== '/play/'

  useEffect(() => {
    // Don't activate tab hider on game pages to prevent accidental freezing during gameplay
    if (isGamePage) {
      return
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Instantly hide when tab loses focus
        setIsHidden(true)
      } else {
        // Show content when tab regains focus
        setIsHidden(false)
      }
    }

    const handleBlur = () => {
      // Handle window losing focus (clicking outside)
      setIsHidden(true)
    }

    const handleFocus = () => {
      // Handle window gaining focus
      setIsHidden(false)
    }

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)

    return () => {
      // Clean up event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isGamePage])

  if (isHidden) {
    return (
      <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-white text-2xl font-bold">Classroom Tools</h1>
          <p className="text-gray-400">Click to return to content</p>
        </div>
      </div>
    )
  }

  return null
}
