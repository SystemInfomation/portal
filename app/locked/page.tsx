'use client'

import { useEffect, useState } from 'react'
import { Clock, Lock, Unlock, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

/**
 * Locked page - Displayed when website is accessed outside school hours
 * 
 * During locked hours, users can access the Settings page to configure preferences.
 * Automatically redirects back to home when school hours resume.
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

      // Calculate next unlock time (7 AM)
      const tomorrow = new Date(easternTime)
      if (hours >= 16) {
        // After 4 PM, unlock tomorrow at 7 AM
        tomorrow.setDate(tomorrow.getDate() + 1)
      }
      tomorrow.setHours(7, 0, 0, 0)
      setNextUnlockTime(tomorrow.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'America/New_York',
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      }))

      // If within allowed hours (7 AM - 4 PM), redirect back to home
      if (hours >= 7 && hours < 16) {
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
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-3 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-orange-950 animate-gradient-shift" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]" />
      
      {/* Floating orbs - hidden on small screens for performance */}
      <div className="hidden sm:block absolute top-8 left-8 w-40 h-40 bg-red-500/10 rounded-full blur-2xl animate-pulse-slow" />
      <div className="hidden sm:block absolute bottom-8 right-8 w-56 h-56 bg-orange-500/10 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="max-w-xl w-full space-y-4 sm:space-y-6 relative z-10">
        {/* Lock Icon with Animation */}
        <div className="flex justify-center">
          <div className="relative group">
            {/* Glow effect - reduced on mobile */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 blur-md sm:blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
            {/* Lock container */}
            <div className="relative bg-gradient-to-br from-red-500/20 to-orange-500/20 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-red-500/30 backdrop-blur-xl shadow-2xl">
              <Lock className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 animate-bounce-gentle" />
            </div>
          </div>
        </div>

        {/* Title with gradient */}
        <div className="space-y-2 sm:space-y-3 text-center px-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-gradient-x leading-tight">
            Access Restricted
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-red-300 font-bold tracking-wide">
            🔒 After School Hours Lockdown
          </p>
        </div>

        {/* Main message card */}
        <div className="bg-gradient-to-br from-red-950/50 to-orange-950/50 border border-red-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-5 space-y-4 sm:space-y-5 backdrop-blur-xl shadow-2xl">
          {/* Current time */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-white">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 animate-pulse flex-shrink-0" />
            <div className="text-center">
              <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider">Current Time</p>
              <p className="text-base sm:text-lg font-bold font-mono">{currentTime}</p>
            </div>
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

          {/* Message */}
          <div className="space-y-2 sm:space-y-3 text-center px-1">
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              I&apos;m sorry, but you cannot access this website after school hours.
            </p>
            <div className="bg-black/30 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-red-500/20">
              <p className="text-xs sm:text-sm text-white/70 mb-1 sm:mb-2">
                This website is only available during:
              </p>
              <p className="text-lg sm:text-xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                7:00 AM - 4:00 PM
              </p>
              <p className="text-[10px] sm:text-xs text-white/50 mt-1">Eastern Time</p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

          {/* Next unlock time */}
          <div className="text-center space-y-1 sm:space-y-2 px-1">
            <div className="flex items-center justify-center gap-1 sm:gap-2 text-green-400">
              <Unlock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <p className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold">Next Unlock</p>
            </div>
            <p className="text-sm sm:text-base font-bold text-white">{nextUnlockTime}</p>
            <p className="text-[10px] sm:text-xs text-white/60">
              The page will automatically redirect when access is restored
            </p>
          </div>
        </div>

        {/* Settings Access Button */}
        <Link href="/settings">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-2xl hover:border-cyan-400/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-cyan-500/20 p-2 sm:p-3 rounded-lg group-hover:bg-cyan-500/30 transition-colors">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-white text-sm sm:text-base">Access Settings</p>
                <p className="text-xs sm:text-sm text-white/60">Configure portal preferences during locked hours</p>
              </div>
              <div className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                →
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Footer */}
        <div className="text-center space-y-1 px-1">
          <p className="text-white/50 text-[10px] sm:text-xs">
            This restriction ensures responsible use of educational resources
          </p>
          <p className="text-white/30 text-[8px] sm:text-[10px]">
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
