'use client'

import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'

const CLOAK_OPTIONS = [
  {
    id: 'google-drive',
    title: 'My Drive - Google Drive',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgPhsxRI-t33a1g_wvkRX5IhEKUB-2lHfQ5A&s',
    backgroundColor: '#ffffff' // white
  },
  {
    id: 'canvas',
    title: 'Dashboard',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYWy6tLxBPdE65jokTz4cBuyyNGDkupZVdtg&s',
    backgroundColor: '#ff0000' // red
  },
  {
    id: 'classlink',
    title: 'ClassLink LaunchPad',
    icon: 'https://play-lh.googleusercontent.com/ujsa1M8GdT-fo-GfPazpUwgPXVWEOWKUgKZk-SdnUhmcL3opS24MiHe6ypEgqxGpllw',
    backgroundColor: '#e1f5fe'
  },
  {
    id: 'linewize',
    title: 'Linewize',
    icon: 'https://gdm-catalog-fmapi-prod.imgix.net/ProductLogo/f23cec1c-1e86-4dc3-9e77-ce04c063ef21.jpeg?w=128&h=128&fit=max&dpr=3&auto=format&q=50',
    backgroundColor: '#2196f3' // blue
  },
  {
    id: 'infinite-campus',
    title: 'Campus Portal',
    icon: 'https://3.files.edl.io/2e70/22/08/03/181301-467a6df0-d6f0-4a65-a41a-cb9e96558e30.png',
    backgroundColor: '#43a047' // green
  }
]

export function TabCloakLoader() {
  const pathname = usePathname()

  const applyCloak = useCallback(() => {
    if (typeof window === 'undefined') return
    
    const savedCloak = localStorage.getItem('forsyth-tab-cloak')
    
    if (savedCloak && savedCloak !== 'none') {
      const option = CLOAK_OPTIONS.find(o => o.id === savedCloak)
      if (option) {
        // Set title
        document.title = option.title
        
        // Set favicon
        let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement
        if (!favicon) {
          favicon = document.createElement('link')
          favicon.rel = 'icon'
          document.head.appendChild(favicon)
        }
        favicon.href = option.icon
        
        // Apply background color
        document.body.style.backgroundColor = option.backgroundColor
      }
    }
  }, [])

  // Apply cloak on mount and whenever pathname changes
  useEffect(() => {
    applyCloak()
    
    // Small delays to override Next.js metadata changes after navigation
    const initialCloakTimeout = setTimeout(applyCloak, 50)
    const secondaryCloakTimeout = setTimeout(applyCloak, 150)
    
    return () => {
      clearTimeout(initialCloakTimeout)
      clearTimeout(secondaryCloakTimeout)
    }
  }, [pathname, applyCloak])

  // Use MutationObserver to prevent title changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const savedCloak = localStorage.getItem('forsyth-tab-cloak')
    if (!savedCloak || savedCloak === 'none') return
    
    const option = CLOAK_OPTIONS.find(o => o.id === savedCloak)
    if (!option) return

    // Watch for title changes and revert them
    const titleObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && document.title !== option.title) {
          document.title = option.title
        }
      }
    })

    const titleElement = document.querySelector('title')
    if (titleElement) {
      titleObserver.observe(titleElement, { childList: true, characterData: true, subtree: true })
    }

    // Also watch for title element being added/changed in head
    const headObserver = new MutationObserver(() => {
      if (document.title !== option.title) {
        document.title = option.title
      }
    })

    headObserver.observe(document.head, { childList: true, subtree: true })

    return () => {
      titleObserver.disconnect()
      headObserver.disconnect()
    }
  }, [pathname])

  return null
}
