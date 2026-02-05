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
  backgroundColor: string
}

const CLOAK_OPTIONS: CloakOption[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgPhsxRI-t33a1g_wvkRX5IhEKUB-2lHfQ5A&s',
    backgroundColor: '#ffffff' // white
  },
  {
    id: 'canvas',
    name: 'Canvas',
    title: 'Dashboard',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYWy6tLxBPdE65jokTz4cBuyyNGDkupZVdtg&s',
    backgroundColor: '#ff0000' // red
  },
  {
    id: 'classlink',
    name: 'Classlink',
    title: 'ClassLink LaunchPad',
    icon: 'https://play-lh.googleusercontent.com/ujsa1M8GdT-fo-GfPazpUwgPXVWEOWKUgKZk-SdnUhmcL3opS24MiHe6ypEgqxGpllw',
    backgroundColor: '#e1f5fe'
  },
  {
    id: 'linewize',
    name: 'Linewize',
    title: 'Linewize',
    icon: 'https://gdm-catalog-fmapi-prod.imgix.net/ProductLogo/f23cec1c-1e86-4dc3-9e77-ce04c063ef21.jpeg?w=128&h=128&fit=max&dpr=3&auto=format&q=50',
    backgroundColor: '#2196f3' // blue
  },
  {
    id: 'infinite-campus',
    name: 'Infinite Campus',
    title: 'Campus Portal',
    icon: 'https://3.files.edl.io/2e70/22/08/03/181301-467a6df0-d6f0-4a65-a41a-cb9e96558e30.png',
    backgroundColor: '#43a047' // green
  }
]

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
    // Check rate limit
    if (typeof window !== 'undefined') {
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
    }
    
    setSelectedCloak(cloakId)
    
    if (cloakId === 'none') {
      // Reset to default
      document.title = 'Forsyth Games Portal'
      const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement
      if (favicon) {
        favicon.href = DEFAULT_FAVICON
      }
      // Reset background color
      document.body.style.backgroundColor = ''
      if (typeof window !== 'undefined') {
        localStorage.removeItem('forsyth-tab-cloak')
        localStorage.removeItem('forsyth-bg-color')
        localStorage.setItem('forsyth-cloak-last-change', Date.now().toString())
      }
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
        
        // Set background color
        document.body.style.backgroundColor = option.backgroundColor
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('forsyth-tab-cloak', cloakId)
          localStorage.setItem('forsyth-bg-color', option.backgroundColor)
          localStorage.setItem('forsyth-cloak-last-change', Date.now().toString())
        }
      }
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl border border-border p-8 space-y-4"
    >
      <div className="flex items-center gap-3">
        <Globe className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-primary">Tab Cloaking</h2>
      </div>
      
      <p className="text-muted-foreground text-sm">
        Change your browser tab title and icon to blend in. Select a preset below:
      </p>

      <div className="grid gap-3 mt-6">
        {cooldownRemaining > 0 && (
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-center">
            <p className="text-sm text-yellow-200/80">
              Please wait {cooldownRemaining} second{cooldownRemaining !== 1 ? 's' : ''} before changing cloak again.
            </p>
          </div>
        )}
        
        {/* Default Option */}
        <button
          onClick={() => applyCloak('none')}
          disabled={cooldownRemaining > 0}
          className={`p-4 rounded-xl border-2 transition-all text-left ${
            selectedCloak === 'none'
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-foreground">Default</div>
              <div className="text-sm text-muted-foreground">Forsyth Games Portal</div>
            </div>
          </div>
        </button>

        {/* Cloak Options */}
        {CLOAK_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => applyCloak(option.id)}
            disabled={cooldownRemaining > 0}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedCloak === option.id
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex items-center gap-3">
              <Image
                src={option.icon}
                alt={option.name}
                width={40}
                height={40}
                className="rounded-lg object-cover"
                unoptimized
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = DEFAULT_FAVICON
                }}
              />
              <div>
                <div className="font-semibold text-foreground">{option.name}</div>
                <div className="text-sm text-muted-foreground">{option.title}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-sm text-yellow-200/80">
          <strong>Note:</strong> The tab cloak will be applied immediately and persist across sessions.
        </p>
      </div>
    </motion.section>
  )
}
