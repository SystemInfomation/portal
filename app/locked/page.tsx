'use client'

import { useEffect, useState } from 'react'
import { Clock, Lock, Unlock } from 'lucide-react'
import { useRouter } from 'next/navigation'

/**
 * Locked page - Displayed when website is accessed outside school hours
 * 
 * Automatically redirects back to home when school hours resume
 */
export default function LockedPage() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState('')
  const [nextUnlockTime, setNextUnlockTime] = useState('')

  useEffect(() => {
    const checkTime = () => {
      // Get current time in Eastern timezone
      const now = new Date()
      const easternTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
      const hours = easternTime.getHours()
      const minutes = easternTime.getMinutes()
      
      // Update current time display
      setCurrentTime(easternTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/New_York',
        timeZoneName: 'short'
      }))

      // Calculate next unlock time (6 AM)
      const tomorrow = new Date(easternTime)
      if (hours >= 17) {
        // After 5 PM, unlock tomorrow at 6 AM
        tomorrow.setDate(tomorrow.getDate() + 1)
      }
      tomorrow.setHours(6, 0, 0, 0)
      
      setNextUnlockTime(tomorrow.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'America/New_York',
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      }))

      // If within allowed hours (6 AM - 5 PM), redirect back to home
      if (hours >= 6 && hours < 17) {
        router.push('/')
      }
    }

    // Check immediately
    checkTime()

    // Check every second for precise unlock timing
    const interval = setInterval(checkTime, 1000)

    return () => clearInterval(interval)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-orange-950 animate-gradient-shift" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]" />
      
      {/* Floating orbs - hidden on small screens for performance */}
      <div className="hidden sm:block absolute top-20 left-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="hidden sm:block absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="max-w-3xl w-full space-y-6 sm:space-y-10 relative z-10">
        {/* Lock Icon with Animation */}
        <div className="flex justify-center">
          <div className="relative group">
            {/* Glow effect - reduced on mobile */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 blur-xl sm:blur-2xl opacity-50 group-hover:opacity-70 transition-opacity animate-pulse" />
            
            {/* Lock container */}
            <div className="relative bg-gradient-to-br from-red-500/20 to-orange-500/20 p-8 sm:p-12 rounded-2xl sm:rounded-3xl border border-red-500/30 backdrop-blur-xl shadow-2xl">
              <Lock className="w-20 h-20 sm:w-28 sm:h-28 text-red-400 animate-bounce-gentle" />
            </div>
          </div>
        </div>

        {/* Title with gradient */}
        <div className="space-y-3 sm:space-y-4 text-center px-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-gradient-x leading-tight">
            Access Restricted
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-red-300 font-bold tracking-wide">
            🔒 After School Hours Lockdown
          </p>
        </div>

        {/* Main message card */}
        <div className="bg-gradient-to-br from-red-950/50 to-orange-950/50 border border-red-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-10 space-y-6 sm:space-y-8 backdrop-blur-xl shadow-2xl">
          {/* Current time */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 text-white">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 animate-pulse flex-shrink-0" />
            <div className="text-center">
              <p className="text-xs sm:text-sm text-white/60 uppercase tracking-wider">Current Time</p>
              <p className="text-lg sm:text-2xl font-bold font-mono">{currentTime}</p>
            </div>
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

          {/* Message */}
          <div className="space-y-4 sm:space-y-6 text-center px-2">
            <p className="text-base sm:text-xl text-white/90 leading-relaxed">
              I&apos;m sorry, but you cannot access this website after school hours.
            </p>
            
            <div className="bg-black/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-500/20">
              <p className="text-sm sm:text-base text-white/70 mb-2 sm:mb-3">
                This website is only available during:
              </p>
              <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                6:00 AM - 5:00 PM
              </p>
              <p className="text-xs sm:text-sm text-white/50 mt-2">Eastern Time</p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

          {/* Next unlock time */}
          <div className="text-center space-y-2 sm:space-y-3 px-2">
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-green-400">
              <Unlock className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <p className="text-xs sm:text-sm uppercase tracking-wider font-semibold">Next Unlock</p>
            </div>
            <p className="text-base sm:text-xl font-bold text-white">{nextUnlockTime}</p>
            <p className="text-xs sm:text-sm text-white/60">
              The page will automatically redirect when access is restored
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 px-2">
          <p className="text-white/50 text-xs sm:text-sm">
            This restriction ensures responsible use of educational resources
          </p>
          <p className="text-white/30 text-[10px] sm:text-xs">
            Protected by server-side enforcement • No bypass possible
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }

        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s linear infinite;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
