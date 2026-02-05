'use client'

import { useEffect, useState } from 'react'
import { MapPin, Globe, Shield, AlertTriangle } from 'lucide-react'

/**
 * Geo-Blocked page - Displayed when website is accessed from outside Georgia, US
 * 
 * Shows clear information about geographic restrictions
 */
export default function GeoBlockedPage() {
  const [locationInfo, setLocationInfo] = useState<{
    country?: string
    state?: string
    city?: string
    isVPN?: boolean
  }>({})

  useEffect(() => {
    // Try to get stored location info
    try {
      const stored = localStorage.getItem('geo_verification')
      if (stored) {
        const verification = JSON.parse(stored)
        if (verification.location) {
          setLocationInfo({
            country: verification.location.country,
            state: verification.location.state || verification.location.region,
            city: verification.location.city,
            isVPN: verification.location.isVPN || verification.location.isProxy
          })
        }
      }
    } catch (error) {
      console.error('Error reading location info:', error)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-black to-purple-950 animate-gradient-shift" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      
      {/* Floating orbs - hidden on small screens for performance */}
      <div className="hidden sm:block absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="hidden sm:block absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="max-w-xl w-full space-y-4 sm:space-y-6 relative z-10 scale-[0.92] sm:scale-100 md:scale-95 lg:scale-90 xl:scale-85 transition-transform duration-300">
        {/* Map/Globe Icon with Animation */}
        <div className="flex justify-center">
          <div className="relative group">
            {/* Glow effect - reduced on mobile */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-lg sm:blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
            {/* Icon container */}
            <div className="relative bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-blue-500/30 backdrop-blur-xl shadow-2xl">
              <Globe className="w-14 h-14 sm:w-20 sm:h-20 text-blue-400 animate-bounce-gentle" />
            </div>
          </div>
        </div>

        {/* Title with gradient */}
        <div className="space-y-2 sm:space-y-3 text-center px-1">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x leading-tight">
            Geographic Restriction
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-300 font-bold tracking-wide">
            🌍 Access Limited to Georgia, United States
          </p>
        </div>

        {/* Main message card */}
        <div 
          role="alert"
          aria-live="assertive"
          className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 border border-blue-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-6 backdrop-blur-xl shadow-2xl"
        >
          {/* Detected location */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-white">
            <MapPin className="w-5 h-5 sm:w-7 sm:h-7 text-blue-400 flex-shrink-0" />
            <div className="text-center">
              <p className="text-xs sm:text-xs text-white/60 uppercase tracking-wider">Detected Location</p>
              <p className="text-base sm:text-xl font-bold">
                {locationInfo.city && `${locationInfo.city}, `}
                {locationInfo.state && `${locationInfo.state}, `}
                {locationInfo.country || 'Unknown'}
              </p>
              {locationInfo.isVPN && (
                <div className="mt-2 flex items-center justify-center gap-1 text-yellow-400">
                  <AlertTriangle className="w-3 h-3" />
                  <p className="text-xs">VPN/Proxy Detected</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          {/* Message */}
          <div className="space-y-2 sm:space-y-4 text-center px-1">
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              We&apos;re sorry, but access to this website is restricted to users physically located in Georgia, United States.
            </p>
            
            <div className="bg-black/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-500/20">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <p className="text-xs sm:text-sm text-white/70 font-semibold">
                  Geographic Access Requirements
                </p>
              </div>
              <div className="space-y-1 text-left sm:text-center">
                <p className="text-xs sm:text-sm text-white/80">
                  ✓ Must be physically located in Georgia, USA
                </p>
                <p className="text-xs sm:text-sm text-white/80">
                  ✓ IP address must resolve to Georgia location
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              This restriction is in place to ensure compliance with educational resource policies and to serve the Forsyth County community.
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          {/* Help section */}
          <div className="text-center space-y-2 sm:space-y-3 px-1">
            <p className="text-sm sm:text-base font-semibold text-white">
              Believe this is an error?
            </p>
            <div className="bg-black/30 rounded-xl p-3 sm:p-4 border border-blue-500/20">
              <p className="text-xs sm:text-sm text-white/80 mb-1">
                If you are located in Georgia and seeing this message:
              </p>
              <ul className="text-xs text-white/70 space-y-1 text-left max-w-xs mx-auto">
                <li>• Check your browser&apos;s location permissions</li>
                <li>• Try refreshing the page</li>
                <li>• Clear your browser cache and cookies</li>
                <li>• Contact your network administrator if on a school network</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-1 px-1">
          <p className="text-white/50 text-[10px] sm:text-xs">
            This geographic restriction ensures proper use of educational resources
          </p>
          <p className="text-white/30 text-[9px] sm:text-[10px]">
            Protected by multi-layered geolocation verification • Bypass attempts are logged
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
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
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
