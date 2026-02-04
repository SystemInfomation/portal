'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'

const DEFAULT_FAVICON = 'https://site.imsglobal.org/sites/default/files/orgs/logos/primary/fcslogo_hexagon.png'

interface CloakOption {
  id: string
  name: string
  title: string
  icon: string
}

const CLOAK_OPTIONS: CloakOption[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgPhsxRI-t33a1g_wvkRX5IhEKUB-2lHfQ5A&s'
  },
  {
    id: 'canvas',
    name: 'Canvas',
    title: 'Dashboard',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYWy6tLxBPdE65jokTz4cBuyyNGDkupZVdtg&s'
  },
  {
    id: 'classlink',
    name: 'Classlink',
    title: 'ClassLink LaunchPad',
    icon: 'https://play-lh.googleusercontent.com/ujsa1M8GdT-fo-GfPazpUwgPXVWEOWKUgKZk-SdnUhmcL3opS24MiHe6ypEgqxGpllw'
  },
  {
    id: 'linewize',
    name: 'Linewize',
    title: 'Linewize',
    icon: 'https://gdm-catalog-fmapi-prod.imgix.net/ProductLogo/f23cec1c-1e86-4dc3-9e77-ce04c063ef21.jpeg?w=128&h=128&fit=max&dpr=3&auto=format&q=50'
  },
  {
    id: 'infinite-campus',
    name: 'Infinite Campus',
    title: 'Campus Portal',
    icon: 'https://3.files.edl.io/2e70/22/08/03/181301-467a6df0-d6f0-4a65-a41a-cb9e96558e30.png'
  }
]

export function TabCloak() {
  const [selectedCloak, setSelectedCloak] = useState<string>('none')

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
    setSelectedCloak(cloakId)
    
    if (cloakId === 'none') {
      // Reset to default
      document.title = 'Forsyth Games Portal'
      const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement
      if (favicon) {
        favicon.href = DEFAULT_FAVICON
      }
      if (typeof window !== 'undefined') {
        localStorage.removeItem('forsyth-tab-cloak')
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
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('forsyth-tab-cloak', cloakId)
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
        {/* Default Option */}
        <button
          onClick={() => applyCloak('none')}
          className={`p-4 rounded-xl border-2 transition-all text-left ${
            selectedCloak === 'none'
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50'
          }`}
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
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedCloak === option.id
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={option.icon}
                alt={option.name}
                className="w-10 h-10 rounded-lg object-cover"
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
