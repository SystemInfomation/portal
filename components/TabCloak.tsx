'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import Image from 'next/image'

const DEFAULT_FAVICON = 'https://site.imsglobal.org/sites/default/files/orgs/logos/primary/fcslogo_hexagon.png'
const CLOAK_COOLDOWN_MS = 3000 // 3 seconds

interface CloakOption {
  id: string
  name: string
  title: string
  icon: string
  cssClass: string
}

const CLOAK_OPTIONS: CloakOption[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgPhsxRI-t33a1g_wvkRX5IhEKUB-2lHfQ5A&s',
    cssClass: 'cloak-google-drive' // black background with white accents
  },
  {
    id: 'canvas',
    name: 'Canvas',
    title: 'Dashboard',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYWy6tLxBPdE65jokTz4cBuyyNGDkupZVdtg&s',
    cssClass: 'cloak-canvas' // red theme
  },
  {
    id: 'classlink',
    name: 'Classlink',
    title: 'ClassLink LaunchPad',
    icon: 'https://play-lh.googleusercontent.com/ujsa1M8GdT-fo-GfPazpUwgPXVWEOWKUgKZk-SdnUhmcL3opS24MiHe6ypEgqxGpllw',
    cssClass: 'cloak-classlink' // blue theme
  },
  {
    id: 'linewize',
    name: 'Linewize',
    title: 'Linewize',
    icon: 'https://gdm-catalog-fmapi-prod.imgix.net/ProductLogo/f23cec1c-1e86-4dc3-9e77-ce04c063ef21.jpeg?w=128&h=128&fit=max&dpr=3&auto=format&q=50',
    cssClass: 'cloak-linewize' // blue theme
  },
  {
    id: 'infinite-campus',
    name: 'Infinite Campus',
    title: 'Campus Portal',
    icon: 'https://3.files.edl.io/2e70/22/08/03/181301-467a6df0-d6f0-4a65-a41a-cb9e96558e30.png',
    cssClass: 'cloak-infinite-campus' // green theme
  }
]

// Helper to remove all cloak classes from body
const removeCloakClasses = () => {
  CLOAK_OPTIONS.forEach(option => {
    document.body.classList.remove(option.cssClass)
  })
}

export function TabCloak() {
  const [selectedCloak, setSelectedCloak] = useState<string>('none')
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  useEffect(() => {
    // Load saved cloak on mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('forsyth-tab-cloak')
      if (saved && saved !== 'none') {
        setSelectedCloak(saved)
      }
    }
  }, [])

  const applyCloak = (cloakId: string) => {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined') return
    
    // Check rate limit
    const lastChange = localStorage.getItem('forsyth-cloak-last-change')
    if (lastChange) {
      const timeSinceChange = Date.now() - parseInt(lastChange)
      if (timeSinceChange < CLOAK_COOLDOWN_MS) {
        const remaining = Math.ceil((CLOAK_COOLDOWN_MS - timeSinceChange) / 1000)
        setCooldownRemaining(remaining)
        
        // Start countdown
        const interval = setInterval(() => {
          setCooldownRemaining(prev => {
            if (prev <= 1) {
              clearInterval(interval)
              return 0
            }
            return prev - 1
          })
        }, 1000)
        
        return
      }
    }
    
    setSelectedCloak(cloakId)
    
    if (cloakId === 'none') {
      // Reset to default
      document.title = 'Forsyth Games Portal'
      const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement
      if (favicon) {
        favicon.href = DEFAULT_FAVICON
      }
      // Remove all cloak CSS classes
      removeCloakClasses()
      localStorage.removeItem('forsyth-tab-cloak')
      localStorage.removeItem('forsyth-bg-color') // Clean up legacy key
      localStorage.setItem('forsyth-cloak-last-change', Date.now().toString())
    } else {
      const option = CLOAK_OPTIONS.find(o => o.id === cloakId)
      if (option) {
        document.title = option.title
        
        // Update favicon
        let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement
        if (!favicon) {
          favicon = document.createElement('link')
          favicon.rel = 'icon'
          document.head.appendChild(favicon)
        }
        favicon.href = option.icon
        
        // Remove existing cloak classes and add new one
        removeCloakClasses()
        document.body.classList.add(option.cssClass)
        
        // Save to localStorage
        localStorage.setItem('forsyth-tab-cloak', cloakId)
        localStorage.setItem('forsyth-cloak-last-change', Date.now().toString())
      }
    }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative p-8 lg:p-10 space-y-6">
        {/* Section Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
            <Globe className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">Change Theme</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Customize your tab with educational preset colors</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Personalize your experience:
        </p>

        {/* Cooldown Message */}
        {cooldownRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
          >
            <p className="text-sm text-yellow-600/90 dark:text-yellow-300/90 text-center">
              ⏱️ Please wait {cooldownRemaining} second{cooldownRemaining !== 1 ? 's' : ''} before changing cloak again.
            </p>
          </motion.div>
        )}

        {/* Preset Cards - Horizontal Scroll */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white"> </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {/* Default Option */}
            <button
              onClick={() => applyCloak('none')}
              disabled={cooldownRemaining > 0}
              className={`flex-shrink-0 w-48 p-4 rounded-2xl border-2 transition-all duration-300 text-left group ${
                selectedCloak === 'none'
                  ? 'border-blue-500 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 shadow-lg shadow-blue-500/20'
                  : 'border-slate-300/50 dark:border-slate-600/50 hover:border-blue-500/50 hover:bg-slate-100/50 dark:hover:bg-slate-700/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Default</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Forsyth Portal</div>
                </div>
                {selectedCloak === 'none' && (
                  <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Active</span>
                  </div>
                )}
              </div>
            </button>

            {/* Cloak Options */}
            {CLOAK_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => applyCloak(option.id)}
                disabled={cooldownRemaining > 0}
                className={`flex-shrink-0 w-48 p-4 rounded-2xl border-2 transition-all duration-300 text-left group ${
                  selectedCloak === option.id
                    ? 'border-blue-500 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 shadow-lg shadow-blue-500/20'
                    : 'border-slate-300/50 dark:border-slate-600/50 hover:border-blue-500/50 hover:bg-slate-100/50 dark:hover:bg-slate-700/30'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden group-hover:scale-110 transition-transform">
                    <Image
                      src={option.icon}
                      alt={option.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = DEFAULT_FAVICON
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{option.name}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 truncate">{option.title}</div>
                  </div>
                  {selectedCloak === option.id && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Active</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info Note */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <p className="text-sm text-blue-700/90 dark:text-blue-300/90">
            💡 <strong>Tip:</strong> The tab cloak applies immediately and persists across browser sessions.
          </p>
        </div>
      </div>
    </section>
  )
}
